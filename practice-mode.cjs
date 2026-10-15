const PracticeMode=(()=>{
 function create(original){const copy=structuredClone(original);Object.assign(copy,{medications:[{id:'walkthrough-product',name:'Practice entry',kind:'Peptide',amount:'',route:'Not specified',approvedSites:[],plannedSite:'',date:''}],doses:[],siteEvents:[],siteTrash:[],reminders:[],weights:[],meals:[],posts:[],likes:[],workouts:[],water:0,protein:0,fiber:0,mood:null,visitNote:'',careDrops:{balance:150,streak:0,lastCheckin:null,events:[],themes:[],plusUntil:0}});return copy}
 function finish(original,latest,completed){const restored=structuredClone(latest||original);restored.onboarding={...restored.onboarding,offered:true,liveVersion:2,liveCompleted:!!completed};return restored}
 return {create,finish};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=PracticeMode;
