// Shared domain rules. Production callers must supply server time and verified events.
const CareDrops=(()=>{
 const DAY=86400000,PRICES={plusDay:120,sunrise:60,starlight:100},BONUSES={week:15,month:50,year:150,lifetime:250};
 const day=n=>new Date(n).toISOString().slice(0,10);
 function wallet(){return {balance:0,streak:0,lastCheckin:null,events:[],themes:[],plusUntil:0}}
 function normalize(w){return {...wallet(),...structuredClone(w||{})}}
 function checkIn(w,now){const n=normalize(w),today=day(now);if(n.lastCheckin&&today<=n.lastCheckin)return {wallet:n,earned:0};n.streak=n.lastCheckin===day(now-DAY)?n.streak+1:1;const amount=5+(n.streak%7===0?10:0);n.balance+=amount;n.lastCheckin=today;n.events.push({id:'daily:'+today,type:'checkin',amount,date:new Date(now).toISOString(),label:'Daily check-in'+(amount>5?' + 7-day bonus':'')});return {wallet:n,earned:amount}}
 function purchase(w,event,now){if(!event||event.verified!==true||!event.id||!BONUSES[event.plan])throw Error('Verified purchase required');const n=normalize(w),id='purchase:'+event.id;if(n.events.some(e=>e.id===id||e.id==='refund:'+event.id))return n;const amount=BONUSES[event.plan];n.balance+=amount;n.events.push({id,type:'purchase',amount,date:new Date(now).toISOString(),label:'Verified '+event.plan+' purchase bonus'});return n}
 function refund(w,event,now){if(!event||event.verified!==true||!event.id)throw Error('Verified refund required');const n=normalize(w),id='refund:'+event.id,original=n.events.find(e=>e.id==='purchase:'+event.id);if(n.events.some(e=>e.id===id))return n;const amount=original?.amount||0;n.balance-=amount;n.events.push({id,type:'refund',amount:-amount,date:new Date(now).toISOString(),label:'Purchase bonus reversed'});return n}
 function redeem(w,reward,now,paidPremium=false){const n=normalize(w),cost=PRICES[reward];if(!cost)throw Error('Unknown reward');if(n.balance<cost)throw Error('Not enough Care Drops');if(reward==='plusDay'&&(paidPremium||n.plusUntil>now))throw Error('Use your current Plus access first');if(reward!=='plusDay'&&n.themes.includes(reward))throw Error('Theme already unlocked');n.balance-=cost;if(reward==='plusDay')n.plusUntil=now+DAY;else n.themes.push(reward);n.events.push({id:'redeem:'+now+':'+reward,type:'redeem',amount:-cost,date:new Date(now).toISOString(),label:reward==='plusDay'?'24-hour Plus preview':reward+' theme'});return n}
 return {DAY,PRICES,BONUSES,day,wallet,normalize,checkIn,purchase,refund,redeem};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=CareDrops;
