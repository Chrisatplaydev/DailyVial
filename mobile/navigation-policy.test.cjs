const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {APP_BASE,navigationTarget,safeExport}=require('./navigation-policy.cjs');
const {NATIVE_BRIDGE}=require('./native-bridge.cjs');
test('local app navigation and private export stay inside the intended boundaries',()=>{
 assert.equal(navigationTarget(APP_BASE),'app');assert.equal(navigationTarget(APP_BASE+'DailyVial.html?v=1'),'app');assert.equal(navigationTarget(APP_BASE+'privacy.html'),'privacy');assert.equal(navigationTarget('https://example.org/menu'),'external');
 for(const url of ['javascript:alert(1)','data:text/html,hello','file:///etc/passwd','http://example.org','intent://foo'])assert.equal(navigationTarget(url),'block');
 const e=safeExport({type:'dailyvial-export',name:'DailyVial-local-backup.json',data:'data:application/json;base64,e30='});assert.equal(e.data,'e30=');
 assert.throws(()=>safeExport({type:'dailyvial-export',name:'../../private.json',data:'data:application/json;base64,e30='}));
 assert.throws(()=>safeExport({type:'dailyvial-export',name:'DailyVial-photo.png',data:'data:image/png;base64,e30='}));
 new vm.Script(NATIVE_BRIDGE);
});
test('iPhone package contains the saved manual release with no Firebase connection',()=>{
 const config=require('./app.json').expo,manifest=require('./bundle-manifest.json');
 assert.equal(config.ios.bundleIdentifier,'com.chrisatplay.dailyvial');assert.equal(config.version,'1.2.1');assert.equal(config.ios.buildNumber,'6');assert.equal(config.extra.eas.projectId,'11df7771-bbd8-400b-be92-eb310f2c88a3');
 const bundle=fs.readFileSync(__dirname+'/dailyvial-bundle.js','utf8');
 assert(bundle.includes('Photo calories · Coming soon'));assert(bundle.includes('dailyvial-native-layout'));assert(bundle.includes('dailyvial-demo-v1'));
 assert(!bundle.includes('gstatic.com/firebasejs/'));assert(!bundle.includes('cloudfunctions.net/dailyvialAI'));
 assert.equal(manifest.sourceSha256,require('node:crypto').createHash('sha256').update(fs.readFileSync(__dirname+'/../DailyVial.html')).digest('hex'));
});
