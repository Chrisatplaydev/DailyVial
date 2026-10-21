const PRODUCTS=Object.freeze({month:'DailyVial_premium_monthly',year:'DailyVial_premium_annual'});
function activeAccess(snapshot,now=Date.now()){
 if(!snapshot||snapshot.active!==true||!Array.isArray(snapshot.items))return false;
 return snapshot.items.some(t=>Object.values(PRODUCTS).includes(t.productID)&&Number.isFinite(t.expiresAt)&&t.expiresAt>now);
}
function entitlementScript(snapshot){
 const safe={active:activeAccess(snapshot),items:Array.isArray(snapshot?.items)?snapshot.items.filter(t=>Object.values(PRODUCTS).includes(t.productID)&&Number.isFinite(t.expiresAt)).map(t=>({productID:t.productID,expiresAt:t.expiresAt})):[]};
 return 'window.dailyvialApplyNativeEntitlements?.('+JSON.stringify(safe)+'); true;';
}
// Applied only to the bundled iPhone build. No entitlement is read from localStorage.
const PAID_WEB_BRIDGE=`\n(() => {
 let entitlement={active:false,items:[]};
 const send=method=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'dailyvial-billing',method}));
 const paid=()=>entitlement.active&&entitlement.items.some(t=>['DailyVial_premium_monthly','DailyVial_premium_annual'].includes(t.productID)&&Number.isFinite(t.expiresAt)&&t.expiresAt>Date.now());
 window.dailyvialApplyNativeEntitlements=s=>{entitlement=s&&Array.isArray(s.items)?s:{active:false,items:[]};previewPlus=false;if(!liveWalk)render();};
 previewPlus=false;
 careDayActive=()=>false;
 const beforeDrops=openDrops;openDrops=()=>{beforeDrops();sheet.querySelectorAll('.reward-card').forEach(card=>{if(card.querySelector('b')?.textContent==='A day of Plus')card.remove();});sheet.querySelectorAll('h3').forEach(h=>{if(h.textContent==='A day among the stars')h.remove();});};
 requirePlus=next=>{if(paid())return next();send('open');};
 openPlans=()=>send('open');
 openSubscriptionSettings=()=>send('open');
 const beforeBilling=action;
 action=a=>{
  if(liveWalk&&['premium','reviewplan','restore','subscription-settings','previewplus','endpreview','stop-settings-preview'].includes(a))return toast('Finish the walkthrough before opening purchases.');
  if(['premium','reviewplan','subscription-settings'].includes(a))return send('open');
  if(a==='restore')return send('restore');
  if(['reward:plusDay','redeem-stardust:plusDay'].includes(a))return send('open');
  if(['previewplus','endpreview','stop-settings-preview'].includes(a))return send('open');
  return beforeBilling(a);
 };
 const guide=DailyGuide.TOPICS.find(t=>t.id==='billing');
 if(guide)guide.answer='DailyVial Plus purchases and restores use your Apple Account. Open Profile → Subscription & cancellation to view plans, restore purchases or manage your Apple subscription. AI meal estimates and live AI remain coming soon and are not included as available paid features.';
 send('refresh');
})();\n`;
module.exports={PRODUCTS,activeAccess,entitlementScript,PAID_WEB_BRIDGE};
