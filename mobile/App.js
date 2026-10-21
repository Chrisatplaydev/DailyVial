import React,{useCallback,useRef,useState} from 'react';
import {useBilling} from './Billing';
import {Alert,Linking,Modal,Pressable,SafeAreaView,StatusBar,StyleSheet,Text,View} from 'react-native';
import {WebView} from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import {APP_HTML,PRIVACY_HTML} from './dailyvial-bundle';
const {APP_BASE,navigationTarget,safeExport}=require('./navigation-policy.cjs');
const {NATIVE_BRIDGE}=require('./native-bridge.cjs');

export default function App(){
 const web=useRef(null),exportBusy=useRef(false);
 const billing=useBilling(web);
 const [privacy,setPrivacy]=useState(false),[failed,setFailed]=useState(false);
 const onMessage=useCallback(async event=>{
  let message;try{message=JSON.parse(event.nativeEvent.data);}catch{return;}
  if(billing.handle(message))return;
  if(message.type!=='dailyvial-export'||exportBusy.current)return;
  exportBusy.current=true;let uri;
  try{
   const file=safeExport(message);
   if(!await Sharing.isAvailableAsync())throw Error('Sharing is unavailable on this device.');
   uri=FileSystem.cacheDirectory+Date.now()+'-'+file.name;
   await FileSystem.writeAsStringAsync(uri,file.data,{encoding:FileSystem.EncodingType.Base64});
   await Sharing.shareAsync(uri,{mimeType:file.mime,dialogTitle:'Save your DailyVial export'});
  }catch(error){Alert.alert('Export unavailable',error.message||'Please try again.');}
  finally{if(uri)await FileSystem.deleteAsync(uri,{idempotent:true}).catch(()=>{});exportBusy.current=false;}
 },[billing.handle]);
 const onNavigation=useCallback(request=>{
  const target=navigationTarget(request.url);
  if(target==='app')return true;
  if(target==='privacy'){setPrivacy(true);return false;}
  if(target==='external')Linking.openURL(request.url).catch(()=>Alert.alert('Link unavailable','This link could not be opened.'));
  return false;
 },[]);
 return <SafeAreaView style={styles.safe}>
  <StatusBar barStyle="light-content" backgroundColor="#14142c"/>
  <View style={styles.content}>
   {failed?<View style={styles.error}><Text style={styles.heading}>Let’s try that again.</Text><Text style={styles.text}>DailyVial could not open. Reloading does not clear your saved journal.</Text><Pressable accessibilityRole="button" style={styles.button} onPress={()=>{setFailed(false);web.current?.reload();}}><Text style={styles.buttonText}>Reload DailyVial</Text></Pressable></View>:
    <WebView ref={web} style={styles.web} source={{html:APP_HTML,baseUrl:APP_BASE}} originWhitelist={['https://*','about:blank']} javaScriptEnabled domStorageEnabled sharedCookiesEnabled={false} thirdPartyCookiesEnabled={false} incognito={false} allowFileAccess={false} allowUniversalAccessFromFileURLs={false} mixedContentMode="never" setSupportMultipleWindows={false} allowsInlineMediaPlayback={false} onShouldStartLoadWithRequest={onNavigation} onMessage={onMessage} onLoadEnd={billing.sync} injectedJavaScriptBeforeContentLoaded={NATIVE_BRIDGE} onError={()=>setFailed(true)} onContentProcessDidTerminate={()=>web.current?.reload()}/>
   }
  </View>
  {billing.modal}
  <Modal visible={privacy} animationType="slide" onRequestClose={()=>setPrivacy(false)}>
   <SafeAreaView style={styles.safe}><View style={styles.toolbar}><Text style={styles.heading}>DailyVial privacy</Text><Pressable accessibilityRole="button" style={styles.button} onPress={()=>setPrivacy(false)}><Text style={styles.buttonText}>Done</Text></Pressable></View><WebView style={styles.web} source={{html:PRIVACY_HTML,baseUrl:APP_BASE}} onShouldStartLoadWithRequest={r=>{if(r.url==='about:blank'||r.url===APP_BASE)return true;if(navigationTarget(r.url)==='app'){setPrivacy(false);return false;}if(navigationTarget(r.url)==='external')Linking.openURL(r.url).catch(()=>{});return false;}}/></SafeAreaView>
  </Modal>
 </SafeAreaView>;
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#14142c'},content:{flex:1},web:{flex:1,backgroundColor:'#14142c'},error:{flex:1,justifyContent:'center',padding:28,gap:18},heading:{fontSize:20,fontWeight:'700',color:'#f1ecff'},text:{fontSize:16,lineHeight:24,color:'#dad4ee'},button:{paddingHorizontal:18,paddingVertical:13,borderRadius:14,backgroundColor:'#b8a5e8'},buttonText:{fontSize:15,fontWeight:'700',color:'#171229'},toolbar:{padding:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}});
