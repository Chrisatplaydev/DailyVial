// Intercept both ordinary clicks and programmatic downloads from local journal tools.
const NATIVE_BRIDGE=`(() => {
 if(window.__dailyvialNativeExport)return true;
 window.__dailyvialNativeExport=true;
 const originalClick=HTMLAnchorElement.prototype.click;
 const share=async a=>{
  try {
   const url=a.href;
   if(!/^(blob:|data:)/.test(url))throw Error('Unsupported export');
   const blob=await (await fetch(url)).blob();
   if(blob.size>11000000)throw Error('This export is too large to share.');
   const reader=new FileReader();
   reader.onload=()=>window.ReactNativeWebView.postMessage(JSON.stringify({type:'dailyvial-export',name:a.download||'DailyVial-export.json',data:reader.result}));
   reader.onerror=()=>alert('The export could not be read. Please try again.');
   reader.readAsDataURL(blob);
  }catch(e){alert(e.message||'The export could not be shared.');}
 };
 HTMLAnchorElement.prototype.click=function(){if(this.download&&/^(blob:|data:)/.test(this.href)){share(this);return;}return originalClick.call(this);};
 document.addEventListener('click',e=>{const a=e.target.closest?.('a[download]');if(a&&/^(blob:|data:)/.test(a.href)){e.preventDefault();share(a);}},true);
})(); true;`;
module.exports={NATIVE_BRIDGE};
