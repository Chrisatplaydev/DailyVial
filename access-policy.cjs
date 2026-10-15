// Server-side domain rules for the future live scan service.
// Store each account ledger in transactional durable storage. Never trust browser state.
const DAILY_REWARD_CAP=4;
const PLAN_PRICES={week:299,month:999,year:4999,lifetime:7999};
function isPremium(entitlement,now=Date.now()){
  if(!entitlement||entitlement.verified!==true||entitlement.revoked===true)return false;
  if(entitlement.plan==='lifetime')return true;
  return ['week','month','year'].includes(entitlement.plan)&&Number.isFinite(entitlement.expiresAt)&&entitlement.expiresAt>now;
}
function utcDay(now){return new Date(now).toISOString().slice(0,10)}
function newLedger(accountId,now=Date.now()){return {accountId,day:utcDay(now),rewardIds:[],credits:0,reservations:{}}}
function dayLedger(ledger,now){return ledger.day===utcDay(now)?structuredClone(ledger):newLedger(ledger.accountId,now)}
function grantVerifiedReward(ledger,event,now=Date.now()){
  // Caller must validate provider signature and replay-protect transaction IDs durably.
  if(event.verified!==true||!event.id||event.accountId!==ledger.accountId)throw Error('Unverified reward');
  const next=dayLedger(ledger,now);
  if(next.rewardIds.includes(event.id))return next;
  if(next.rewardIds.length>=DAILY_REWARD_CAP)throw Error('Daily rewarded scan cap reached');
  next.rewardIds.push(event.id);next.credits++;return next;
}
function reserveScan(ledger,scanId,entitlement,now=Date.now()){
  const next=dayLedger(ledger,now);
  if(!scanId)throw Error('Missing scan ID');
  if(next.reservations[scanId])return next;
  const premium=isPremium(entitlement,now);
  if(!premium&&next.credits<1)throw Error('A scan unlock is required');
  // Premium AI usage must additionally pass a published server-side fair-use quota.
  if(!premium)next.credits--;
  next.reservations[scanId]={status:'reserved',paidWith:premium?'premium':'reward'};return next;
}
function finishScan(ledger,scanId,success){
  const next=structuredClone(ledger),reservation=next.reservations[scanId];
  if(!reservation||reservation.status!=='reserved')return next;
  reservation.status=success?'completed':'failed';
  if(!success&&reservation.paidWith==='reward')next.credits++;
  return next;
}
module.exports={DAILY_REWARD_CAP,PLAN_PRICES,isPremium,newLedger,grantVerifiedReward,reserveScan,finishScan};
