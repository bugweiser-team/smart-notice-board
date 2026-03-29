importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js");

// Use exact Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyDubgab0N3D5LlJlLkhZ6JJE5gEqucNOZk",
  authDomain: "smart-notice-board-efd5e.firebaseapp.com",
  projectId: "smart-notice-board-efd5e",
  storageBucket: "smart-notice-board-efd5e.firebasestorage.app",
  messagingSenderId: "641192184798",
  appId: "1:641192184798:web:dedeb012cda2d3b4c92b4f"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/favicon.ico",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.log('Firebase messaging init error:', e);
}
