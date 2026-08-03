import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXH11laLVudrNrq9gB-gqw8y1G-EACBRw",
  authDomain: "gift-market-place.firebaseapp.com",
  projectId: "gift-market-place",
  storageBucket: "gift-market-place.firebasestorage.app",
  messagingSenderId: "1068451343336",
  appId: "1:1068451343336:web:49812716e589a8ec8cd25d",
  measurementId: "G-2CHLHVE387"
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(firebaseApp);
const BLOCKED_NOTIFICATION_WARNING_KEY = "push_permission_blocked_warned";

// Correctly export a promise that resolves to messaging instance (or null)
export const getMessagingObject = async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    console.error("Messaging not supported:", err);
    return null;
  }
};

// fetchToken function
export const fetchToken = async (setTokenFound, setFcmToken) => {
  try {
    const messaging = await getMessagingObject();
    if (!messaging) {
      setTokenFound(false);
      return;
    }

    // Check if notification permission is granted
    if (typeof window !== "undefined" && "Notification" in window) {
      const permission = Notification.permission;

      if (permission === "denied" || permission === "blocked") {
        if (typeof window !== "undefined" && !sessionStorage.getItem(BLOCKED_NOTIFICATION_WARNING_KEY)) {
          sessionStorage.setItem(BLOCKED_NOTIFICATION_WARNING_KEY, "true");
          if (process.env.NODE_ENV !== "production") {
            console.warn("Notification permission is blocked. Push notifications will not work.");
          }
        }
        setTokenFound(false);
        setFcmToken();
        return;
      }

      // Request permission if not granted yet
      if (permission === "default") {
        try {
          const permissionResult = await Notification.requestPermission();
          if (permissionResult !== "granted") {
            console.warn("Notification permission was not granted.");
            setTokenFound(false);
            setFcmToken();
            return;
          }
        } catch (permissionError) {
          console.warn("Error requesting notification permission:", permissionError);
          setTokenFound(false);
          setFcmToken();
          return;
        }
      }
    }

    // Only try to get token if VAPID key is provided
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
    if (!vapidKey) {
      console.warn("VAPID key is not configured. Push notifications may not work.");
      setTokenFound(false);
      setFcmToken();
      return;
    }

    // --- Fix: wait for the service worker to be fully ACTIVE before subscribing ---
    // getToken() → PushManager.subscribe() requires an active SW.
    // On first load the SW is still "installing", causing "no active Service Worker".
    const tokenOptions = { vapidKey };
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      try {
        // Register (or get existing registration) for firebase-messaging-sw.js
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        // `navigator.serviceWorker.ready` resolves only once a SW is ACTIVATED.
        // This elegantly handles the race condition on first visit.
        const swRegistration = await navigator.serviceWorker.ready;
        tokenOptions.serviceWorkerRegistration = swRegistration;
      } catch (swError) {
        // If SW registration fails, let Firebase fall back to its own registration attempt.
        console.warn("Service worker not ready, falling back:", swError);
      }
    }

    const currentToken = await getToken(messaging, tokenOptions);

    if (currentToken) {
      setTokenFound(true);
      setFcmToken(currentToken);
    } else {
      setTokenFound(false);
      setFcmToken();
    }
  } catch (err) {
    // Handle specific Firebase messaging errors
    if (err.code === "messaging/permission-blocked" || err.code === "messaging/permission-default") {
      console.warn("Notification permission is not granted. Push notifications disabled.");
      setTokenFound(false);
      setFcmToken();
    } else if (err.code === "messaging/unsupported-browser") {
      console.warn("Browser does not support Firebase Cloud Messaging.");
      setTokenFound(false);
      setFcmToken();
    } else {
      console.error("Token fetch error:", err);
      setTokenFound(false);
      setFcmToken();
    }
  }
};

/**
 * Subscribe to Firebase foreground messages. Call once (e.g. in a layout effect).
 * Returns an unsubscribe function (promise). Each incoming message invokes onPayload.
 */
export const subscribeForegroundMessages = async (onPayload) => {
  const messaging = await getMessagingObject();
  if (!messaging) {
    return () => { };
  }
  if (typeof window !== "undefined" && "Notification" in window) {
    if (Notification.permission !== "granted") {
      return () => { };
    }
  }
  return onMessage(messaging, onPayload);
};

/** @deprecated Prefer subscribeForegroundMessages — one-shot Promise pattern drops subsequent messages */
export const onMessageListener = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const messaging = await getMessagingObject();
      if (!messaging) {
        reject(new Error("Messaging not available"));
        return;
      }

      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission !== "granted") {
          reject(new Error("Notification permission not granted"));
          return;
        }
      }

      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    } catch (err) {
      console.error("Message listener error:", err);
      reject(err);
    }
  });
