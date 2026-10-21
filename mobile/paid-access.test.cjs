const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {PRODUCTS,activeAccess,entitlementScript,PAID_WEB_BRIDGE}=require('./paid-access.cjs');
test('only currently active known Apple Plus entitlements unlock access',()=>{
 const now=1000,valid={active:true,items:[{productID:PRODUCTS.month,expiresAt:2000}]};
 assert(activeAccess(valid,now));assert(!activeAccess(valid,2000));assert(!activeAccess({...valid,active:false},now));assert(!activeAccess({active:true,items:[{productID:'DailyVial_adfree_monthly',expiresAt:2000}]},now));assert(!activeAccess({active:true,items:[{productID:PRODUCTS.month,expiresAt:'forever'}]},now));
});
test('iPhone runtime removes preview bypasses and routes purchase and restore to native Apple billing',()=>{
 const messages=[],context={previewPlus:true,liveWalk:null,DailyGuide:{TOPICS:[{id:'billing'}]},careDayActive:()=>true,openDrops(){},render(){},toast(){},action:a=>a,window:{ReactNativeWebView:{postMessage:s=>messages.push(JSON.parse(s))}},Date,Number};
 vm.createContext(context);vm.runInContext(PAID_WEB_BRIDGE,context);
 assert.equal(context.previewPlus,false);let entered=false;context.requirePlus(()=>{entered=true;});assert(!entered);assert.equal(messages.at(-1).method,'open');
 context.action('previewplus');assert.equal(context.previewPlus,false);context.action('restore');assert.equal(messages.at(-1).method,'restore');
 vm.runInContext(entitlementScript({active:true,items:[{productID:PRODUCTS.year,expiresAt:Date.now()+10000}]}),context);
 context.requirePlus(()=>{entered=true;});assert(entered);
 entered=false;vm.runInContext(entitlementScript({active:false,items:[]}),context);context.requirePlus(()=>{entered=true;});assert(!entered);
 assert(!PAID_WEB_BRIDGE.includes('localStorage'));
});
