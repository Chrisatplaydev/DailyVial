import SwiftUI

@main
struct DailyVialApp: App {
    var body: some Scene {
        WindowGroup { DailyDashboardView() }
    }
}

struct DailyDashboardView: View {
    @State private var calorieGoal = 2_000
    @State private var meals: [Meal] = []
    @State private var supplements: [Supplement] = []
    @State private var personalLogs: [PersonalLog] = []
    @State private var sheet: Sheet?

    enum Sheet: Identifiable { case meal, supplement, personal; var id: Int { hashValue } }
    var caloriesLogged: Int { meals.reduce(0) { $0 + $1.calories } }
    var caloriesRemaining: Int { max(calorieGoal - caloriesLogged, 0) }

    var body: some View {
        NavigationStack {
            List {
                Section("Today") {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Daily calories").font(.headline)
                        ProgressView(value: Double(caloriesLogged), total: Double(max(calorieGoal, 1)))
                            .tint(.indigo)
                        HStack {
                            Label("\(caloriesLogged) logged", systemImage: "flame")
                            Spacer()
                            Text("\(caloriesRemaining) remaining").foregroundStyle(.secondary)
                        }
                        Stepper("Goal: \(calorieGoal) cal", value: $calorieGoal, in: 500...6000, step: 50)
                    }.padding(.vertical, 4)
                }
                Section("Calories") {
                    if meals.isEmpty { empty("No calories logged", icon: "fork.knife") }
                    ForEach(meals) { meal in LabeledContent(meal.name, value: "\(meal.calories) cal") }
                        .onDelete { meals.remove(atOffsets: $0) }
                    Button("Add calories", systemImage: "plus") { sheet = .meal }
                }
                Section("Supplements") {
                    if supplements.isEmpty { empty("No supplements logged", icon: "pills") }
                    ForEach(supplements) { item in
                        VStack(alignment: .leading) {
                            Text(item.name)
                            Text("\(item.amount) · \(item.time.formatted(date: .omitted, time: .shortened))")
                                .font(.caption).foregroundStyle(.secondary)
                        }
                    }.onDelete { supplements.remove(atOffsets: $0) }
                    Button("Add supplement", systemImage: "plus") { sheet = .supplement }
                }
                Section("Personal logs") {
                    Text("Personal recordkeeping only. DailyVial does not provide medical or dosage advice.")
                        .font(.footnote).foregroundStyle(.secondary)
                    if personalLogs.isEmpty { empty("No personal entries logged", icon: "note.text") }
                    ForEach(personalLogs) { item in
                        VStack(alignment: .leading) {
                            Text(item.name)
                            Text(item.time.formatted(date: .omitted, time: .shortened)).font(.caption).foregroundStyle(.secondary)
                            if !item.notes.isEmpty { Text(item.notes).font(.caption) }
                        }
                    }.onDelete { personalLogs.remove(atOffsets: $0) }
                    Button("Add personal entry", systemImage: "plus") { sheet = .personal }
                }
            }
            .navigationTitle("DailyVial")
            .sheet(item: $sheet) { item in
                switch item {
                case .meal: MealForm { meals.append($0) }
                case .supplement: SupplementForm { supplements.append($0) }
                case .personal: PersonalLogForm { personalLogs.append($0) }
                }
            }
        }
    }

    @ViewBuilder func empty(_ text: String, icon: String) -> some View {
        Label(text, systemImage: icon).foregroundStyle(.secondary)
    }
}

struct Meal: Identifiable { let id = UUID(); let name: String; let calories: Int }
struct Supplement: Identifiable { let id = UUID(); let name: String; let amount: String; let time: Date }
struct PersonalLog: Identifiable { let id = UUID(); let name: String; let time: Date; let notes: String }

struct MealForm: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var calories = 0
    let save: (Meal) -> Void
    var body: some View {
        NavigationStack { Form {
            TextField("Meal or snack", text: $name)
            Stepper("Calories: \(calories)", value: $calories, in: 0...5000, step: 10)
        }.navigationTitle("Add calories").toolbar {
            Button("Save") { save(Meal(name: name.isEmpty ? "Untitled" : name, calories: calories)); dismiss() }
        }}
    }
}

struct SupplementForm: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var amount = ""
    @State private var time = Date()
    let save: (Supplement) -> Void
    var body: some View {
        NavigationStack { Form {
            TextField("Name", text: $name)
            TextField("Amount", text: $amount)
            DatePicker("Time", selection: $time, displayedComponents: .hourAndMinute)
        }.navigationTitle("Add supplement").toolbar {
            Button("Save") { save(Supplement(name: name.isEmpty ? "Untitled" : name, amount: amount.isEmpty ? "No amount" : amount, time: time)); dismiss() }
        }}
    }
}

struct PersonalLogForm: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var time = Date()
    @State private var notes = ""
    let save: (PersonalLog) -> Void
    var body: some View {
        NavigationStack { Form {
            TextField("Name", text: $name)
            DatePicker("Time", selection: $time, displayedComponents: .hourAndMinute)
            TextField("Notes", text: $notes, axis: .vertical)
        }.navigationTitle("Add personal entry").toolbar {
            Button("Save") { save(PersonalLog(name: name.isEmpty ? "Untitled" : name, time: time, notes: notes)); dismiss() }
        }}
    }
}
