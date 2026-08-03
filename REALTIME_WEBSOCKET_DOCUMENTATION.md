# 🚀 GIFT Marketplace — Real-Time WebSockets & System Architecture Report

This document provides an exhaustive, professional technical reference regarding the **Real-Time WebSocket Architecture** and recent **UI/UX Modernization Upgrades** implemented within the GIFT Marketplace frontend application.

---

## 📋 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [WebSocket Protocol & Technology Stack](#2-websocket-protocol--technology-stack)
3. [Where WebSockets Are Used in the Codebase](#3-where-websockets-are-used-in-the-codebase)
4. [Real-Time Order Tracking Workflow](#4-real-time-order-tracking-workflow)
5. [Configuration & Environment Setup](#5-configuration--environment-setup)
6. [Secondary Real-Time System: Firebase FCM](#6-secondary-real-time-system-firebase-fcm)
7. [Recent UI/UX & E-Commerce Enhancements](#7-recent-uiux--e-commerce-enhancements)

---

## 1. Executive Summary

The GIFT Marketplace frontend is built on **Next.js** and integrates a high-performance **Real-Time WebSocket Broadcasting System** powered by **Laravel Reverb** (using the Pusher WebSocket protocol). This enables instantaneous, bidirectional communication between the backend API, store owners, delivery riders, and customers without relying on inefficient HTTP polling.

---

## 2. WebSocket Protocol & Technology Stack

The application uses standard JavaScript broadcasting libraries to communicate with the Reverb real-time server:

* **`laravel-echo`**: The core event-broadcasting client that listens to named channels and events.
* **`pusher-js`**: The underlying WebSocket protocol driver and connection manager.
* **Transport Mechanisms**: Configured to use secure **`wss://` (WebSocket Secure)** over Port `443` by default, with fallback support for standard `ws://` over Port `80`.

### Key Dependencies in `package.json`:
```json
{
  "dependencies": {
    "laravel-echo": "^1.15.3",
    "pusher-js": "^8.3.0"
  }
}
```

---

## 3. Where WebSockets Are Used in the Codebase

WebSockets are deployed in the most mission-critical area of the e-commerce lifecycle: **Live Order Tracking and Status Synchronization**.

### 📍 Core Implementation File:
* **Path**: `src/components/my-orders/order-details/index.js`
* **Utility Driver**: `src/utils/reverbEcho.js`

Whenever a customer navigates to their **Order Details / Live Tracking Page** (`/my-orders/[id]` or `/track-order`), the frontend automatically initializes a persistent WebSocket connection specifically scoped to that order.

---

## 4. Real-Time Order Tracking Workflow

### Step-by-Step Connection Lifecycle:

1. **Instance Initialization (`src/utils/reverbEcho.js`)**:
   When the Order Details component mounts, it checks for an existing Echo instance via `getReverbEchoInstance()`. If none exists, `createReverbEcho(configData)` builds a new connection using the credentials supplied by the backend API.

2. **Channel Subscription (`src/components/my-orders/order-details/index.js`)**:
   The client subscribes to the order-specific broadcasting channel:
   * **Private Channel**: `private-orders.${id}` (Requires JWT/Bearer token authentication via `/broadcasting/auth`).
   * **Public Channel Fallback**: `orders.${id}` (Ensures uninterrupted tracking if authentication headers expire during a live trip).

3. **Event Listeners**:
   The application listens for three primary backend dispatch events:
   * `OrderStatusUpdated` — Fired when an order transitions state (e.g., *Pending ➔ Confirmed ➔ Cooking ➔ Out for Delivery ➔ Delivered*).
   * `OrderUpdated` — Fired when order metadata or items are modified.
   * `StatusUpdated` — Fired when rider GPS location or delivery milestones change.
   * **Global Event Binder**: Utilizes `subscription.bind_global(...)` as a catch-all for custom or unmapped real-time broadcasts.

4. **Instant UI Synchronization (Zero Page Refresh)**:
   When an event is received over the socket:
   ```javascript
   const handleUpdate = (e) => {
     console.log("WebSocket event received:", e);
     refetch();            // React Query: Refetches order summary & items
     refetchTrackOrder();  // React Query: Refetches rider GPS coordinates & status
   };
   ```
   **Result**: The customer sees the delivery rider moving on the live map and order badges updating instantly without ever pressing F5 or refreshing the browser.

---

## 5. Configuration & Environment Setup

The WebSocket system is dynamically controlled by the backend administrative configuration (`GET /api/v1/config`), meaning no manual `.env` edits are required when changing socket servers:

| Config Key | Description | Example Value |
| :--- | :--- | :--- |
| `websocket_status` | Master switch to enable/disable real-time sockets | `1` (Enabled) / `0` (Disabled) |
| `websocket_url` | Hostname or IP address of the Reverb/Pusher server | `api.giftmarketplace.com` |
| `websocket_port` | Secure WebSocket connection port | `443` |
| `websocket_key` | Public broadcasting authentication key | `reverb_app_key_12345` |

---

## 6. Secondary Real-Time System: Firebase FCM (Chat & Notifications)

In addition to Laravel Reverb WebSockets for live order tracking, the application integrates **Firebase Cloud Messaging (FCM)** for real-time **Chat Messaging** and **System Push Notifications**:

* **Core Files**: `src/firebase.js`, `src/components/PushNotificationLayout.js`, & `src/hooks/useChatUnreadBadge.js`
* **How Chat & Notifications Work**:
  * Unlike Order Tracking (which streams over WebSocket channels), **Chat Messaging and General Notifications do NOT use WebSockets**.
  * Instead, when a vendor or admin sends a chat message or notification, Firebase sends an instant **FCM Push Notification Event (`PUSH_NOTIFICATION_EVENT`)**.
  * The frontend (`useChatUnreadBadge.js`) intercepts this Firebase push event, instantly increments the unread chat badge count, and triggers **`refetchChannelList()`** / **`refetch()`** to pull the newest messages from the API.
  * Additionally, the system listens for window focus (`focus`) and tab visibility changes (`visibilitychange`) to automatically sync messages whenever the user returns to the tab.

### Summary of Real-Time Division of Labor:
| Feature Area | Real-Time Technology | Core Protocol / Driver | Why This Technology? |
| :--- | :--- | :--- | :--- |
| **Live Order Tracking (`/my-orders/[id]`)** | **Laravel Reverb WebSockets** | Pusher (`laravel-echo` + `pusher-js`) | Provides continuous, sub-second GPS tracking and status streaming during live deliveries. |
| **Chat Messaging & Inbox** | **Firebase FCM + API Refetching** | Push Notifications (`firebase.js`) + React Query | Delivers instant alerts even when backgrounded/locked, triggering immediate inbox synchronization. |
| **System Alerts & Status Banners** | **Firebase FCM** | Push Notifications (`firebase.js`) | Reaches users across desktop and mobile OS notification centers. |

---

## 7. Recent UI/UX & E-Commerce Enhancements

Alongside real-time backend integrations, the frontend design system was upgraded to follow premium **Alibaba E-Commerce Standards**:

1. **Alibaba-Style Special Offer Showcase (`SpecialCard.js`)**:
   * **100% Uniform Card Heights**: Removed irregular slider heights (`variableHeight: false`) and applied flex-stretch alignments. All product cards now maintain identical vertical boundaries regardless of title length or discount tags.
   * **Precision Image Aspect Ratio (`objectFit: "contain"`)**: Replaced cropping behaviors with centered contain boxes (`height: 190px`) on clean white/dark backgrounds. Laptops, fashion items, and accessories fit perfectly without clipping or distortion.
   * **Aligned Typography & Price Grids**: Enforced strict minimum heights on title containers (`minHeight: "38px"`) and pricing footers (`minHeight: "44px"`), guaranteeing horizontal grid alignment across every card in the carousel.

2. **Crisp E-Commerce Corner Aesthetics**:
   * Transitioned from overly rounded circular borders (`16px`/`23px`) to sharp, modern rectangular edges:
     * **Product Cards**: Reduced border radius to **`8px`**.
     * **Image Boxes & Badges**: Reduced border radius to **`6px`**.
     * **Section & Footer Containers**: Reduced border radius to **`6px`** and **`12px`**.
   * **Footer Policy Links Alignment (`FooterBottom.js` & `FooterBottomItems.jsx`)**: Grouped *Terms & Conditions*, *Privacy Policy*, and *Refund Policy* into a clean, right-aligned horizontal stack (`justifyContent: "flex-end"`), matching enterprise e-commerce footer layouts.

---
*Report generated automatically by Antigravity IDE for GIFT Marketplace.*
