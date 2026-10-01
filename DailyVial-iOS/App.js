import React, { useCallback, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';

// The web app remains the single source of DailyVial's tracker UI and data logic.
// Native purchases, ads, notifications, and privacy controls are added around this
// screen in later integration steps.
const DAILY_VIAL_URL = 'https://chrisatplaydev.github.io/DailyVial/';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setLoading(false);
    setFailed(true);
  }, []);

  if (failed) {
    return (
      <SafeAreaView style={styles.messageScreen}>
        <Text style={styles.title}>DailyVial needs an internet connection</Text>
        <Text style={styles.copy}>Please reconnect and reopen the app.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <WebView
        source={{ uri: DAILY_VIAL_URL }}
        onLoadEnd={() => setLoading(false)}
        onError={handleError}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        startInLoadingState={false}
        style={styles.webview}
      />
      {loading && (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator size="large" color="#2c6e49" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  webview: { flex: 1, backgroundColor: '#ffffff' },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  messageScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#ffffff'
  },
  title: { fontSize: 21, fontWeight: '700', textAlign: 'center', color: '#18251d' },
  copy: { marginTop: 10, fontSize: 16, textAlign: 'center', color: '#4d5d51' }
});
