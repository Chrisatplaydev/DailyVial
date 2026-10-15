const Preferences=(()=>{
 const UNITS=['mg','mcg','g','mL','IU','syringe units','capsules','tablets','drops'];
 function parseAmount(value,defaultUnit=''){const text=String(value||'').trim();const match=text.match(/^(\d+(?:\.\d+)?|\.\d+)\s*(mg|mcg|µg|μg|g|ml|iu|syringe units|capsules|tablets|drops)$/i);if(match){let unit=match[2].toLowerCase();unit=unit==='ml'?'mL':unit==='iu'?'IU':['µg','μg'].includes(unit)?'mcg':unit;return {value:match[1],unit}}if(!text)return {value:'',unit:UNITS.includes(defaultUnit)?defaultUnit:''};if(/^\d*\.?\d+$/.test(text))return {value:text,unit:UNITS.includes(defaultUnit)?defaultUnit:''};return {value:text,unit:'custom'}}
 function formatAmount(value,unit,required=false){const text=String(value||'').trim();if(!text){if(required)throw Error('Enter the prescribed amount.');return ''}if(unit==='custom'){if(text.length>50)throw Error('Use 50 characters or fewer.');return text}if(!UNITS.includes(unit))throw Error('Choose a dose unit.');if(!/^\d*\.?\d+$/.test(text)||!Number.isFinite(Number(text))||Number(text)<=0)throw Error('Enter an amount greater than zero.');return text+' '+unit}
 function normalize(value){const p=value||{};return {mode:['dark','light'].includes(p.mode)?p.mode:'dark',name:String(p.name||'').slice(0,40),defaultUnit:UNITS.includes(p.defaultUnit)?p.defaultUnit:'',reduceMotion:p.reduceMotion===true}}
 return {UNITS,parseAmount,formatAmount,normalize};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=Preferences;
