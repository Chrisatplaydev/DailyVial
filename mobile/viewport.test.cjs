const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const {VIEWPORT_META,VIEWPORT_LOCK}=require('./viewport.cjs');
test('viewport lock prevents pinch gestures while preserving normal scrolling and typing',()=>{
 const listeners={},meta={};let appended=0;
 const document={head:{appendChild(){appended++;}},querySelector:()=>meta,addEventListener:(type,handler)=>{listeners[type]=handler;}};
 const context={window:{},document};vm.createContext(context);vm.runInContext(VIEWPORT_LOCK,context);
 assert.equal(meta.content,VIEWPORT_META);assert.equal(appended,0);
 let stopped=0;
 const single={touches:[{}],cancelable:true,preventDefault(){stopped++;}};
 listeners.touchstart(single);listeners.touchmove(single);assert.equal(stopped,0);
 listeners.touchmove({...single,touches:[{},{}]});assert.equal(stopped,1);
 listeners.gesturestart(single);assert.equal(stopped,2);
 vm.runInContext(VIEWPORT_LOCK,context);assert.equal(stopped,2);
});
