const APP_BASE='https://chrisatplaydev.github.io/DailyVial/';
function navigationTarget(raw){
 if(typeof raw!=='string')return 'block';
 if(raw==='about:blank')return 'app';
 try{const u=new URL(raw);if(u.origin===new URL(APP_BASE).origin&&u.pathname==='/DailyVial/privacy.html')return 'privacy';if(u.origin===new URL(APP_BASE).origin&&['/DailyVial/','/DailyVial/DailyVial.html'].includes(u.pathname))return 'app';if(['https:','mailto:','tel:'].includes(u.protocol))return 'external';}catch{}
 return 'block';
}
function safeExport(message){
 if(!message||message.type!=='dailyvial-export'||typeof message.data!=='string'||message.data.length>16000000||typeof message.name!=='string')throw Error('Invalid export');
 const match=message.data.match(/^data:([^;,]*)(?:;charset=[^;,]*)?;base64,([A-Za-z0-9+/]*={0,2})$/);
 if(!match)throw Error('Invalid export encoding');
 const mime=match[1]||'application/octet-stream';
 if(!['application/json','text/csv','text/calendar','text/html','application/octet-stream'].includes(mime.toLowerCase()))throw Error('Unsupported export type');
 const name=message.name.replace(/[^a-zA-Z0-9._-]/g,'_').slice(0,140);
 if(!/^DailyVial[-_.]/i.test(name))throw Error('Invalid export filename');
 return {name,mime,data:match[2]};
}
module.exports={APP_BASE,navigationTarget,safeExport};
