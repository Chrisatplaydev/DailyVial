import React,{useEffect,useRef,useState} from 'react';
import {AppState,Alert,Image,Linking,Modal,Pressable,SafeAreaView,ScrollView,StyleSheet,Text,View} from 'react-native';
import passArtwork from './dailyvial-pass-artwork';
import {requireOptionalNativeModule} from 'expo';
const {activeAccess,entitlementScript,PRODUCTS}=require('./paid-access.cjs');
const Store=requireOptionalNativeModule('DailyVialStore');
const EMPTY={active:false,items:[]};
const TERMS='https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const PRIVACY='https://chrisatplaydev.github.io/DailyVial/privacy.html';

export function useBilling(web){
 const [visible,setVisible]=useState(false),[products,setProducts]=useState([]),[access,setAccess]=useState(EMPTY),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const snapshot=useRef(EMPTY),operation=useRef(false);
 const apply=value=>{snapshot.current=value;setAccess(value);web.current?.injectJavaScript(entitlementScript(value));};
 const refresh=async()=>{
  if(!Store){apply(EMPTY);setError('Purchases require the updated iPhone build.');return;}
  try{apply(await Store.entitlements());setError('');}catch{apply(EMPTY);setError('Apple purchase status could not be checked. Try Restore Purchases.');}
 };
 const load=async()=>{
  await refresh();if(!Store)return;
  try{setProducts(await Store.products());}catch{setProducts([]);setError('Apple could not load the plans. Check your connection and try again.');}
 };
 useEffect(()=>{
  refresh();
  const update=Store?.addListener('entitlementsChanged',value=>apply(value));
  const foreground=AppState.addEventListener('change',state=>{if(state==='active')refresh();});
  const timer=setInterval(()=>{if(snapshot.current.active&&!activeAccess(snapshot.current)){apply(EMPTY);refresh();}},15000);
  return()=>{update?.remove();foreground.remove();clearInterval(timer);};
 },[]);
 const open=()=>{setVisible(true);load();};
 const restore=async()=>{
  if(!Store){open();return;}if(operation.current)return;operation.current=true;setBusy(true);setError('');
  try{const result=await Store.restore();apply(result);Alert.alert('Restore Purchases',activeAccess(result)?'Your DailyVial Plus access is restored.':'No active DailyVial Plus subscription was found for this Apple Account.');}
  catch{setError('Purchases could not be restored. Please try again.');}
  finally{operation.current=false;setBusy(false);}
 };
 const purchase=async product=>{
  if(!Store||operation.current||!Object.values(PRODUCTS).includes(product.id))return;
  operation.current=true;setBusy(true);setError('');
  try{const result=await Store.purchase(product.id);
   if(result.status==='purchased'){apply(result.entitlements);if(activeAccess(result.entitlements)){setVisible(false);Alert.alert('Welcome to Plus','Your verified Apple subscription is active.');}else setError('Apple has not confirmed active Plus access. Try Restore Purchases.');}
   else if(result.status==='pending')setError('This purchase is awaiting Apple approval. Plus will unlock after Apple confirms payment.');
  }catch{setError('Apple could not complete or verify this purchase. Plus has not been unlocked. Please try again or restore purchases.');}
  finally{operation.current=false;setBusy(false);}
 };
 const handle=message=>{
  if(message.type!=='dailyvial-billing')return false;
  if(message.method==='open')open();else if(message.method==='restore'){setVisible(true);restore();}else if(message.method==='refresh')refresh();
  return true;
 };
 const sync=()=>web.current?.injectJavaScript(entitlementScript(snapshot.current));
 const modal=<Modal visible={visible} animationType="slide" onRequestClose={()=>{if(!busy)setVisible(false);}}>
  <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
   <View style={styles.header}><Text style={styles.brand}>DailyVial Plus</Text><Pressable accessibilityRole="button" disabled={busy} onPress={()=>setVisible(false)}><Text style={styles.link}>Done</Text></Pressable></View>
   <Text style={styles.title}>A little more insight.</Text><Text style={styles.body}>Personal goals, recorded-data insights and private journal exports.</Text>
   {['Set your own calorie, protein, fiber and water goals.','Review your recorded weight change, dose counts and site history.','Export your journal and appointment-ready summaries.'].map(t=><Text key={t} style={styles.benefit}>• {t}</Text>)}
   <Text style={styles.notice}>AI meal-photo estimates and live AI chat are coming soon. They are unavailable in this version and are not required to use Plus.</Text>
   {activeAccess(access)&&<Text style={styles.success}>Your Apple subscription is active.</Text>}
   {products.map(p=><Pressable key={p.id} accessibilityRole="button" disabled={busy||activeAccess(access)} style={[styles.plan,(busy||activeAccess(access))&&styles.disabled]} onPress={()=>purchase(p)}><Image source={{uri:passArtwork[p.plan]}} accessible={false} resizeMode="contain" style={{width:'100%',aspectRatio:1,borderRadius:12}}/><Text style={styles.planTitle}>{p.plan==='year'?'Annual':'Monthly'}</Text><Text style={styles.price}>{p.price} / {p.period}</Text><Text style={styles.planDetail}>Auto-renewing subscription · all available Plus features</Text><Text style={styles.planCTA}>Continue with Apple</Text></Pressable>)}
   {!products.length&&<Text style={styles.body}>Plans are temporarily unavailable. No payment has been started.</Text>}
   {!!error&&<Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
   <Pressable disabled={busy} onPress={load} accessibilityRole="button"><Text style={styles.link}>Refresh plans and status</Text></Pressable>
   <Pressable disabled={busy} onPress={restore} accessibilityRole="button"><Text style={styles.link}>{busy?'Working with Apple…':'Restore Purchases'}</Text></Pressable>
   <Pressable accessibilityRole="link" onPress={()=>Linking.openURL('https://apps.apple.com/account/subscriptions')}><Text style={styles.link}>Manage or cancel Apple subscription</Text></Pressable>
   <Text style={styles.legal}>Payment is charged to your Apple Account after you confirm. Your subscription renews automatically unless cancelled at least 24 hours before the current period ends. Apple charges renewal within 24 hours before that period ends. Manage or cancel in your Apple Account settings. Cancelling stops future renewals; access continues through the paid period.</Text>
   <View style={styles.links}><Pressable accessibilityRole="link" onPress={()=>Linking.openURL(PRIVACY)}><Text style={styles.link}>Privacy Policy</Text></Pressable><Pressable accessibilityRole="link" onPress={()=>Linking.openURL(TERMS)}><Text style={styles.link}>Terms of Use</Text></Pressable></View>
  </ScrollView></SafeAreaView>
 </Modal>;
 return {handle,sync,modal};
}
const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#14142c'},content:{padding:24,gap:18},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},brand:{fontSize:20,fontWeight:'800',color:'#e9e1ff'},title:{fontSize:30,fontWeight:'700',color:'#fff'},body:{fontSize:16,lineHeight:24,color:'#d8d0e8'},benefit:{fontSize:16,lineHeight:24,color:'#e9e1ff'},notice:{fontSize:14,lineHeight:22,color:'#bfb5d1'},success:{fontSize:16,color:'#98e0b9'},plan:{borderWidth:1,borderColor:'#927ac5',borderRadius:20,padding:20,gap:10,backgroundColor:'#27203d'},planTitle:{fontSize:18,fontWeight:'700',color:'#f3ecff'},price:{fontSize:26,fontWeight:'800',color:'#fff'},planDetail:{fontSize:14,color:'#c5bbd6'},planCTA:{fontSize:16,fontWeight:'700',color:'#c9b5fa'},link:{fontSize:16,color:'#c2a9f6',paddingVertical:8},error:{fontSize:15,lineHeight:22,color:'#ffc2bf'},legal:{fontSize:13,lineHeight:21,color:'#bbb1cc'},links:{flexDirection:'row',flexWrap:'wrap',gap:24},disabled:{opacity:.55}});
