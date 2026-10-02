import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';

// The web app remains the single source of DailyVial's tracker UI and data logic.
// The web app remains the source of the tracker UI and data logic. This wrapper
// supplies the native-only pieces that a browser WebView cannot: edge-to-edge
// rendering and on-device local notifications.
const DAILY_VIAL_URL = 'https://chrisatplaydev.github.io/DailyVial/';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const bridge = `
(() => {
  const send = (id, ok, value) => window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'dailyvial-notification-response', id, ok, value
  }));
  const call = (method, args) => new Promise((resolve, reject) => {
    const id = 'dv_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const timer = setTimeout(() => reject(new Error('Native reminder request timed out')), 12000);
    const listener = event => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'dailyvial-notification-response' || data.id !== id) return;
        clearTimeout(timer);
        window.removeEventListener('message', listener);
        document.removeEventListener('message', listener);
        data.ok ? resolve(data.value) : reject(new Error(data.value || 'Native reminder request failed'));
      } catch (_) {}
    };
    window.addEventListener('message', listener);
    document.addEventListener('message', listener);
    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'dailyvial-notification', id, method, args }));
  });
  window.Capacitor = window.Capacitor || {};
  window.Capacitor.Plugins = window.Capacitor.Plugins || {};
  window.Capacitor.Plugins.LocalNotifications = {
    checkPermissions: () => call('checkPermissions'),
    requestPermissions: () => call('requestPermissions'),
    schedule: args => call('schedule', args),
    cancel: args => call('cancel', args),
    getPending: () => call('getPending')
  };
})(); true;
`;

function dateFromSchedule(schedule) {
  if (schedule?.at) return new Date(schedule.at);
  if (schedule?.on) {
    const now = new Date();
    const date = new Date(now);
    date.setHours(schedule.on.hour || 0, schedule.on.minute || 0, 0, 0);
    // Expo weekday: Sunday=1. Move to the next requested weekday.
    if (schedule.on.weekday) {
      const target = schedule.on.weekday - 1;
      const offset = (target - date.getDay() + 7) % 7 || (date <= now ? 7 : 0);
      date.setDate(date.getDate() + offset);
    } else if (date <= now) date.setDate(date.getDate() + 1);
    return date;
  }
  return new Date(Date.now() + 5000);
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const webViewRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('dailyvial-reminders', {
        name: 'DailyVial reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
  }, []);

  const reply = useCallback((id, ok, value) => {
    webViewRef.current?.injectJavaScript(
      `window.dispatchEvent(new MessageEvent('message',{data:${JSON.stringify(JSON.stringify({
        type: 'dailyvial-notification-response', id, ok, value,
      }))}}));true;`,
    );
  }, []);

  const handleMessage = useCallback(async event => {
    let message;
    try { message = JSON.parse(event.nativeEvent.data); } catch (_) { return; }
    if (message.type !== 'dailyvial-notification') return;
    try {
      if (message.method === 'checkPermissions' || message.method === 'requestPermissions') {
        const status = message.method === 'requestPermissions'
          ? await Notifications.requestPermissionsAsync()
          : await Notifications.getPermissionsAsync();
        reply(message.id, true, { display: status.granted ? 'granted' : 'denied' });
      } else if (message.method === 'schedule') {
        const notifications = message.args?.notifications || [];
        await Promise.all(notifications.map(note => Notifications.scheduleNotificationAsync({
          identifier: String(note.id),
          content: { title: note.title, body: note.body, data: note.extra || {}, sound: 'default' },
          trigger: dateFromSchedule(note.schedule),
        })));
        reply(message.id, true, {});
      } else if (message.method === 'cancel') {
        await Promise.all((message.args?.notifications || []).map(note =>
          Notifications.cancelScheduledNotificationAsync(String(note.id)),
        ));
        reply(message.id, true, {});
      } else if (message.method === 'getPending') {
        const pending = await Notifications.getAllScheduledNotificationsAsync();
        reply(message.id, true, { notifications: pending.map(item => ({ id: Number(item.identifier) })) });
      } else {
        reply(message.id, false, 'Unsupported native reminder request');
      }
    } catch (error) {
      reply(message.id, false, error instanceof Error ? error.message : String(error));
    }
  }, [reply]);

  const handleError = useCallback(() => {
    setLoading(false);
    setFailed(true);
  }, []);

  if (failed) {
    return (
      <View style={styles.messageScreen}>
        <Text style={styles.title}>DailyVial needs an internet connection</Text>
        <Text style={styles.copy}>Please reconnect and reopen the app.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" translucent backgroundColor="#0C1210" />
      <WebView
        ref={webViewRef}
        source={{ uri: DAILY_VIAL_URL }}
        onLoadEnd={() => setLoading(false)}
        onError={handleError}
        javaScriptEnabled
        domStorageEnabled
        allowsInlineMediaPlayback
        injectedJavaScriptBeforeContentLoaded={bridge}
        onMessage={handleMessage}
        contentInsetAdjustmentBehavior="never"
        startInLoadingState={false}
        style={styles.webview}
      />
      {loading && (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator size="large" color="#2c6e49" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0C1210' },
  webview: { flex: 1, backgroundColor: '#0C1210' },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0C1210'
  },
  messageScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#0C1210'
  },
  title: { fontSize: 21, fontWeight: '700', textAlign: 'center', color: '#f4f7f5' },
  copy: { marginTop: 10, fontSize: 16, textAlign: 'center', color: '#b7c4bc' }
});
