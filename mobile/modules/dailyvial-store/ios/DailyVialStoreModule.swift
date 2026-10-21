import ExpoModulesCore
import StoreKit

public final class DailyVialStoreModule: Module {
  private let productIDs = ["DailyVial_premium_monthly", "DailyVial_premium_annual"]
  private var updatesTask: Task<Void, Never>?

  public func definition() -> ModuleDefinition {
    Name("DailyVialStore")
    Events("entitlementsChanged")
    OnCreate { [weak self] in
      guard let self = self else { return }
      self.updatesTask = Task { [weak self] in
        for await update in Transaction.updates {
          guard !Task.isCancelled, let self = self else { return }
          guard case .verified(let transaction) = update,
                self.productIDs.contains(transaction.productID) else { continue }
          self.sendEvent("entitlementsChanged", await self.entitlements())
          await transaction.finish()
        }
      }
    }
    OnDestroy { [weak self] in self?.updatesTask?.cancel() }
    AsyncFunction("products") { () async throws -> [[String: Any]] in
      let products = try await Product.products(for: self.productIDs)
      return products.filter { $0.type == .autoRenewable }.map { product in
        ["id": product.id,
         "plan": product.id == "DailyVial_premium_monthly" ? "month" : "year",
         "name": product.displayName,
         "price": product.displayPrice,
         "period": product.id == "DailyVial_premium_monthly" ? "month" : "year"]
      }
    }
    AsyncFunction("entitlements") { () async -> [String: Any] in
      await self.entitlements()
    }
    AsyncFunction("restore") { () async throws -> [String: Any] in
      try await AppStore.sync()
      return await self.entitlements()
    }
    AsyncFunction("purchase") { (productID: String) async throws -> [String: Any] in
      guard self.productIDs.contains(productID) else { throw StoreError.invalidProduct }
      let products = try await Product.products(for: [productID])
      guard let product = products.first, product.type == .autoRenewable else { throw StoreError.unavailable }
      switch try await product.purchase() {
      case .success(let result):
        guard case .verified(let transaction) = result,
              self.productIDs.contains(transaction.productID),
              transaction.revocationDate == nil else { throw StoreError.unverified }
        let current = await self.entitlements()
        await transaction.finish()
        return ["status": "purchased", "entitlements": current]
      case .userCancelled: return ["status": "cancelled"]
      case .pending: return ["status": "pending"]
      @unknown default: throw StoreError.unavailable
      }
    }
  }

  private func entitlements() async -> [String: Any] {
    var active: [[String: Any]] = []
    for await result in Transaction.currentEntitlements {
      guard case .verified(let transaction) = result,
            productIDs.contains(transaction.productID),
            transaction.productType == .autoRenewable,
            transaction.revocationDate == nil,
            !transaction.isUpgraded,
            let expiry = transaction.expirationDate,
            expiry > Date() else { continue }
      active.append(["productID": transaction.productID,
                     "expiresAt": expiry.timeIntervalSince1970 * 1000])
    }
    return ["active": !active.isEmpty, "items": active]
  }
}

private enum StoreError: String, Error, LocalizedError {
  case invalidProduct, unavailable, unverified
  var errorDescription: String? {
    switch self {
    case .invalidProduct: return "This purchase is not a DailyVial Plus product."
    case .unavailable: return "Apple could not load this plan. Please try again later."
    case .unverified: return "Apple could not verify this purchase. Plus has not been unlocked."
    }
  }
}
