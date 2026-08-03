importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// Initialize the Firebase app in the service worker.
// NOTE: Service workers cannot access process.env — values must be hardcoded here.
const firebaseConfig = {
  apiKey: 'AIzaSyCXH11laLVudrNrq9gB-gqw8y1G-EACBRw',
  appId: '1:1068451343336:web:49812716e589a8ec8cd25d',
  messagingSenderId: '1068451343336',
  projectId: 'gift-market-place',
  authDomain: 'gift-market-place.firebaseapp.com',
  storageBucket: 'gift-market-place.firebasestorage.app',
  measurementId: 'G-2CHLHVE387',
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const n = payload.notification || {};
  const d = payload.data || {};
  const notificationTitle =
    n.title || d.title || d.subject || "Notification";
  const notificationBody =
    n.body || d.body || d.message || d.description || "";
  const notificationOptions = {
    body: notificationBody,
    data: d,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});