# GIFT MARKETPLACE WEB
## User Manual and Procedures Guide
### Customer Edition

**Web Application**  
**Product Version:** 3.7  
**Draft for Team Review**  
**Prepared:** 29 July 2026  

---

## Document Control

| Document Field | Value |
| :--- | :--- |
| **Document Title** | GIFT Marketplace Web User Manual |
| **Role Edition** | Customer / End-User Edition |
| **Product and Platform** | Version 3.7 - Web Application (`http://localhost:3000`) |
| **Document Status** | Draft for Team Review |
| **Document Owner** | Product Documentation Team |
| **Approver** | Team Lead / Product Owner |
| **Classification** | Internal Draft until Approved |
| **Official Support Contact** | `support@giftmarketplace.com` |

---

## Revision History

| Version | Date | Change Summary | By |
| :--- | :--- | :--- | :--- |
| **0.1** | 29 July 2026 | Initial customer web application draft based on supplied screenshots | Documentation Team |
| **0.2** | 31 July 2026 | Added tested sign-in, account creation, and password recovery workflows | Documentation Team |
| **0.3** | 12 August 2026 | Implemented homepage visual UI mapping, 6 modules, checkout flow, parcel, rental, tracking, and support | Documentation Team |
| **0.4** | 12 August 2026 | Updated Sign In (Welcome Back) and Create Account modals with exact field specifications, icons, and buttons | Documentation Team |
| **0.5** | 12 August 2026 | Added complete Terms and Conditions page mapping (12 legal sections & Effective Date) | Documentation Team |
| **0.6** | 12 August 2026 | Added About Us page, Help & Support page (3 contact cards), and Track Your Order Status page mapping | Documentation Team |

> 📌 **Review Required:** Confirm official product owner, release date, supported web browsers, support hotline, order cancellation rules, refund policies, and legal/privacy wording before final publication.

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose of this manual
   - 1.2 Intended audience
   - 1.3 Document conventions
   - 1.4 About Us Page Reference (`/about-us`)
2. [Product Overview and Requirements](#2-product-overview-and-requirements)
   - 2.1 What is GIFT Marketplace Web?
   - 2.2 Operating context
   - 2.3 System & Web Requirements
3. [Getting Started & User Account Setup](#3-getting-started--user-account-setup)
   - 3.1 Register a Customer Account (Create Account Modal)
     - 3.1.1 Create Account Modal UI Reference
     - 3.1.2 Registration Step-by-Step Procedure
   - 3.2 Sign In and Recover Password
     - 3.2.1 Sign In to GIFT Marketplace Web (Welcome Back Modal UI Reference & Procedure)
     - 3.2.2 Reset a Forgotten Password
   - 3.3 Navigate the Web Application (Homepage Layout & UI Mapping)
4. [Browsing, Modules & Shopping Procedures](#4-browsing-modules--shopping-procedures)
   - 4.1 Set Delivery Location Procedure
   - 4.2 Explore Featured Categories & Banners
   - 4.3 Explore the 4 Main Shopping Modules (Grocery, Food, Pharmacy, E-Commerce)
   - 4.4 Search Products, Stores & Categories
   - 4.5 Manage Wishlist & Shopping Cart
5. [Ordering and Checkout Procedures](#5-ordering-and-checkout-procedures)
   - 5.1 Review Cart & Proceed to Checkout
   - 5.2 Select Delivery Address
   - 5.3 Apply Promo Codes & Discount Coupons
   - 5.4 Choose Payment Method
   - 5.5 Confirm & Place Order
6. [Order Tracking and Order Management](#6-order-tracking-and-order-management)
   - 6.1 Real-Time Order Tracking Procedure & Track Order Page UI Reference (`/track-order`)
   - 6.2 Order Status Progression
   - 6.3 Order History & Reordering
   - 6.4 Order Cancellation Procedure
7. [Special Services Procedures](#7-special-services-procedures)
   - 7.1 Book a Parcel Pickup & Delivery
   - 7.2 Book a Rental Ride or Vehicle
8. [Wallet, Loyalty Points & Discounts](#8-wallet-loyalty-points--discounts)
   - 8.1 GIFT Wallet Management
   - 8.2 Loyalty Points & Discount Redemption
9. [Partner Onboarding Links](#9-partner-onboarding-links)
   - 9.1 Become a Seller (Store Registration)
   - 9.2 Become a Rider (Deliveryman Registration)
10. [Interface and Status Reference](#10-interface-and-status-reference)
    - 10.1 Primary Web Controls
    - 10.2 Important Statuses
11. [Security, Legal & Data Handling](#11-security-legal--data-handling)
    - 11.1 General Data Protection & Account Safety
    - 11.2 Terms and Conditions Page Reference (12 Structural Legal Sections)
12. [Troubleshooting and Support](#12-troubleshooting-and-support)
    - 12.1 Diagnostic Checklist
    - 12.2 Common Issues & Solutions
    - 12.3 Official Help & Support Page UI Reference (`/help-and-support`)
- [Appendix A. Glossary](#appendix-a-glossary)
- [Appendix B. Pre-publication Review Checklist](#appendix-b-pre-publication-review-checklist)

---

## 1. Introduction

### 1.1 Purpose of this manual
This manual explains how customers use the **GIFT Marketplace Web Application (v3.7)** to browse products, set delivery locations, create accounts, place orders across 6 core modules (Grocery, Food, Pharmacy, E-Commerce, Parcel, Rental), track live deliveries, manage digital wallets, and contact customer support.

### 1.2 Intended audience
This edition is written in **easy, accessible English** specifically for end-user customers and shoppers. It does not document internal administrator, vendor dashboard, or rider execution mechanics except where customers interact with onboarding links.

### 1.3 Document conventions
- **Bold text** identifies an interface label, button, dropdown, tab, or status.
- A **Note** provides helpful context or tips.
- A **Caution** identifies an action that affects money, order placement, or account privacy.
- A **Review Required** notice identifies information that must be confirmed by project leaders before final publication.

---

### 1.4 About Us Page Reference (`/about-us`)

**Accessing the Page:** Click **About Us** in the top utility bar or in the website footer.

**Page Title:** `About us`

**Official Platform Mission Statement:**
> *"GIFT Marketplace is a comprehensive online platform offering seamless solutions for parcel delivery, ecommerce, food, and grocery services. Our mission is to simplify the way businesses and consumers interact by providing a reliable, secure, and user-friendly experience. Whether you're looking to send a parcel, shop for groceries, or expand your online store, GIFT Marketplace is your trusted partner in navigating the digital marketplace."*

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [📍 Select location]       [Help & Support] [About Us] [Track Order]... │
├─────────────────────────────────────────────────────────────────────────┤
│ [🛍️ GIFT Marketplace Logo] [Home] [Categories ▾] [Stores ▾] [🔍 Search] │
├─────────────────────────────────────────────────────────────────────────┤
│                                 About us                                │
│                                                                         │
│ GIFT Marketplace is a comprehensive online platform offering seamless   │
│ solutions for parcel delivery, ecommerce, food, and grocery services... │
├─────────────────────────────────────────────────────────────────────────┤
│ [ Join Us Newsletter Subscription Bar ]                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Product Overview and Requirements

### 2.1 What is GIFT Marketplace Web?
GIFT Marketplace Web is an all-in-one e-commerce super-app platform operating via web browser. It connects customers with local grocery stores, restaurants, pharmacies, retail merchants, parcel couriers, and rental vehicle operators in one unified platform.

### 2.2 Operating context
- Customers land on the website (`http://localhost:3000`), set their delivery location, and browse stores available in their area.
- Customers can create an account using phone number or email to enable checkout, live tracking, wallet features, and loyalty points.
- Main navigation areas include **Home**, **Categories**, **Stores**, **Parcel**, **Cart**, and **Profile**.

### 2.3 System & Web Requirements

| Requirement | Currently Known | Review Required |
| :--- | :--- | :--- |
| **Supported Devices** | Desktop computers, laptops, tablets, and smartphones | Verify minimum screen resolution limits |
| **Web Browsers** | Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari | Confirm minimum browser version support |
| **Network** | Active Internet connection required | Document offline notification behavior |
| **Account** | Customer account required for checkout & tracking | Confirm session timeout and password rules |
| **Permissions** | Location/GPS access permitted for precise delivery pin | Confirm map tile provider credentials |

---

## 3. Getting Started & User Account Setup

### 3.1 Register a Customer Account (Create Account Modal)

**Goal:** Submit a customer registration request using the **Create Account 🥳** modal to create a new GIFT Marketplace account.  
**Prerequisites:** A valid username, email address, mobile phone number, password, and internet connection.

#### 3.1.1 Create Account Modal UI Reference

The **Create Account 🥳** dialog contains the following form fields, buttons, and control elements:

| Interface Element | Field Type | Icon / Prefix / Suffix | Label / Placeholder | Requirement | Functional Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Modal Header Logo** | Image / Header | GIFT Marketplace Logo | N/A | Mandatory Display | Identifies official platform modal header. |
| **Modal Title** | Heading | 🥳 Emoji | `Create Account 🥳` | N/A | Title text introducing sign up popup. |
| **Modal Subtitle** | Subheading | N/A | `Sign up to get started` | N/A | Explanatory instruction for new users. |
| **Close Button** | Button Icon | `✕` top-right | N/A | Optional Action | Closes the registration dialog without saving. |
| **User Name *** | Text Input | 👤 User Icon | `Enter user name` | **Required** | User's full name or preferred username. |
| **Refer Code (Optional)** | Text Input | 🎟️ Tag Icon | `Refer Code` | Optional | Referral code for promotional bonuses. |
| **Email *** | Email Input | ✉️ Mail Icon | `Email` | **Required** | Valid email address for order receipts and login. |
| **Phone *** | Phone Input | 🇵🇰 Country Flag / Dropdown | `+92` | **Required** | Mobile phone number with country code selection (`+92`). |
| **Password *** | Password Input | 🔒 Lock Icon / 👁️ Toggle | `Minimum 8 characters` | **Required** | Password must contain at least 8 characters. Eye icon toggles password visibility. |
| **Confirm Password *** | Password Input | 🔒 Lock Icon / 👁️ Toggle | `Re-enter your password` | **Required** | Re-enter matching password for verification. Eye icon toggles visibility. |
| **Terms Checkbox** | Checkbox | Checkbox Control | `You must accept the terms and conditions` | **Required** | Must be checked to enable registration. Clicking **terms and conditions** link opens full legal terms page (`/terms-and-conditions`). |
| **Sign Up Button** | Action Button | Full-Width Button | `Sign Up` | Action Control | Submits registration data when all mandatory fields are valid. |
| **Sign In Link** | Navigation Link | Text Link | `Already have an account? Sign In` | Link Control | Switches modal view directly to **Welcome Back (Sign In)** dialog. |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           [ GIFT Marketplace Logo ]                 [✕] │
│                               Create Account 🥳                         │
│                             Sign up to get started                      │
├─────────────────────────────────────────────────────────────────────────┤
│ [👤 User Name *            ]  |  [🎟️ Refer Code (Optional)          ] │
├─────────────────────────────────────────────────────────────────────────┤
│ [✉️ Email *                                                           ] │
├─────────────────────────────────────────────────────────────────────────┤
│ [🇵🇰 ▾  +92                                                            ] │
├─────────────────────────────────────────────────────────────────────────┤
│ [🔒 Password *           👁️]  |  [🔒 Confirm Password *          👁️] │
├─────────────────────────────────────────────────────────────────────────┤
│ [☑] You must accept the terms and conditions                            │
├─────────────────────────────────────────────────────────────────────────┤
│                              [ Sign Up ]                                │
├─────────────────────────────────────────────────────────────────────────┤
│                     Already have an account? Sign In                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

#### 3.1.2 Registration Step-by-Step Procedure

##### Procedure
1. Open the GIFT Marketplace website (`http://localhost:3000`).
2. Click **🔑 Sign In** at the top-right corner of the header.
3. In the modal footer, click **Sign Up** (or switch to Create Account).
4. Enter your full name in **User Name *** (`Enter user name`).
5. (Optional) Enter a referral voucher code in **Refer Code (Optional)**.
6. Enter your valid email address in **Email *** (`Email`).
7. Select your country code (default `+92`) and enter your mobile phone number in **Phone ***.
8. Type a secure password containing at least 8 characters in **Password *** (`Minimum 8 characters`).
9. Re-type the exact same password in **Confirm Password *** (`Re-enter your password`). Use the 👁️ eye icon to verify character entry if needed.
10. Click the checkbox **"You must accept the terms and conditions"**.
11. Click the **Sign Up** button.
12. Enter the 6-digit SMS OTP code sent to your phone and click **Verify**.

**Expected outcome:** The registration modal completes, an account created notification appears, and the user is logged into the platform.

**If unsuccessful:**
- If **Sign Up** button remains disabled, confirm that all required fields (`*`) are filled and the terms checkbox is checked.
- If *"Password does not match"* appears, re-type both password fields to match exactly.
- If *"Phone or Email already registered"* appears, click **Already have an account? Sign In** to log in or reset password.

---

### 3.2 Sign In and Recover Password

#### 3.2.1 Sign In to GIFT Marketplace Web (Welcome Back Modal UI Reference & Procedure)

**Goal:** Open the customer dashboard using an existing registered phone number or email and password.  
**Prerequisites:** A registered GIFT Marketplace account, password, and active internet connection.

##### Welcome Back Modal UI Reference

The **Welcome Back 👋** sign-in dialog contains the following controls:

| Interface Element | Field Type | Icon / Prefix / Suffix | Label / Placeholder | Requirement | Functional Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Modal Header Logo** | Image / Header | GIFT Marketplace Logo | N/A | Mandatory Display | Official branding badge at top of sign in modal. |
| **Modal Title** | Heading | 👋 Wave Emoji | `Welcome Back 👋` | N/A | Heading welcoming existing users. |
| **Modal Subtitle** | Subheading | N/A | `Sign in to your account to continue` | N/A | Explanatory instruction. |
| **Close Button** | Button Icon | `✕` top-right | N/A | Optional Action | Dismisses sign in dialog. |
| **Email/Phone *** | Text Input | 📞/✉️ Phone/Mail Icon | `Email/Phone` | **Required** | Registered email address or phone number. |
| **Password *** | Password Input | 🔒 Lock Icon / 👁️ Toggle | `Minimum 8 characters` | **Required** | Account password. 👁️ Eye icon toggles visibility. |
| **Remember Me** | Checkbox | Checkbox | `Remember me` | Optional | Keeps user logged in on trusted private devices. |
| **Forgot Password?** | Text Link | Text Link | `Forgot password?` | Optional | Opens password recovery OTP flow (Section 3.2.2). |
| **Sign In Button** | Action Button | Dark Blue Button | `Sign In` | Action Control | Validates credentials and logs customer into account. |
| **Terms Notice** | Notice Text | Small Text | `* By login I Agree with all the Terms & Conditions` | Informational | Platform terms agreement statement. |
| **Google Login** | Social Button | 🌐 Google Icon | `Continue with Google` | Social Auth | One-click login using verified Google Account. |
| **Sign Up Link** | Navigation Link | Text Link | `Don't have an account? Sign Up` | Link Control | Opens **Create Account 🥳** modal for new registration. |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           [ GIFT Marketplace Logo ]                 [✕] │
│                               Welcome Back 👋                           │
│                     Sign in to your account to continue                 │
├─────────────────────────────────────────────────────────────────────────┤
│ [📞 Email/Phone *                                                     ] │
├─────────────────────────────────────────────────────────────────────────┤
│ [🔒 Password *                                                       👁️] │
├─────────────────────────────────────────────────────────────────────────┤
│ [☐] Remember me                                      Forgot password?   │
├─────────────────────────────────────────────────────────────────────────┤
│                              [ Sign In ]                                │
├─────────────────────────────────────────────────────────────────────────┤
│          * By login I Agree with all the Terms & Conditions             │
│ -------------------------- or continue with --------------------------- │
│                     [ G  Continue with Google ]                         │
├─────────────────────────────────────────────────────────────────────────┤
│                     Don't have an account? Sign Up                      │
└─────────────────────────────────────────────────────────────────────────┘
```

##### Procedure
1. Open GIFT Marketplace (`http://localhost:3000`).
2. Click **🔑 Sign In** at top-right of navigation bar.
3. On the **Welcome Back 👋** screen, enter your registered email address or phone number in **Email/Phone *** (`Email/Phone`).
4. Enter your account password in **Password *** (`Minimum 8 characters`).
5. (Optional) Check **Remember me** if using a private, trusted device.
6. Click **Sign In**.
7. Alternatively, click **Continue with Google** for 1-click social sign-in.

**Expected outcome:** The modal closes, your profile avatar appears in the top navigation strip, and saved addresses/wallet balance become accessible.

**If unsuccessful:**
- If the screen displays *"Incorrect credentials please try again"*, re-check your email/phone number and password spelling.
- If you forgot your password, click **Forgot password?** to start SMS recovery.

---

#### 3.2.2 Reset a Forgotten Password
**Goal:** Regain account access by verifying your registered mobile number and setting a new password.  
**Prerequisites:** Access to your registered mobile phone to receive SMS OTP.

##### Procedure
1. On the **Welcome Back 👋** modal, click **Forgot password?**.
2. Enter your registered mobile number and click **Next**.
3. Retrieve the 6-digit OTP sent to your mobile phone and enter it in the verification field.
4. Click **Verify**.
5. On the Reset Password screen, enter a new **Password** (min 8 characters) and re-type it in **Confirm Password**.
6. Click **Done** and log in with your new password.

**Expected outcome:** Password is updated successfully and customer can sign in immediately.

---

### 3.3 Navigate the Web Application (Homepage Layout & UI Mapping)

Below is the complete visual mapping of the GIFT Marketplace Homepage based on live interface screenshots:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [📍 Select location]                       [Help & Support] [About Us] [Track Order] [Become a Seller]        │
│                                            [Become a Rider] [📱 App QR] [🇺🇸 EN/USD ▾]                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [🛍️ GIFT Marketplace Logo] [Home] [Categories ▾] [Stores ▾] [🔍 Search...]   [📦 Parcel]  [🛒 Cart]  [🔑 Sign In]  │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [Featured Categories Icons: Fast Food | Italian | Pan Asian | Electronics | Desi Food | Fashion | Sports...]      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ HERO PROMOTIONAL BANNERS: FAST FOOD - FIND YOUR MEAL | GROCERY OFFERS ]                                       │
│  🛡️ Verified Sellers   |   🚚 Fast Delivery   |   💳 Secure Payment   |   🎧 24/7 Support                      │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Marketplace Services & Modules:  🛒 Grocery  |  🍔 Food  |  💊 Pharmacy  |  🛍️ Ecommerce ]                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Why Shop On Our Marketplace? (6 Feature Cards: Doorstep Delivery | 100% Quality | Daily Deals | 24/7 Support...) ]│
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Spotlight Banner: Groceries Delivery at your doorstep ]                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ How Ordering Works: (1) Select Location  ➔  (2) Choose Store  ➔  (3) Fast Delivery ]                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Download Our App Card ]                   |                   [ Become a Seller Card ]                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ Join Us Newsletter Subscription Bar ]                                                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [ FOOTER: Social Media | Email Support | Contact Phone | Address | Terms & Privacy ]                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Complete Interface Component Breakdown

| Section Name | Key UI Elements | Purpose & Functional Description |
| :--- | :--- | :--- |
| **Top Utility Bar** | `📍 Select location`, `Help & Support`, `About Us`, `Track Order`, `Become a Seller`, `Become a Rider`, `📱 App QR`, `🇺🇸 Language/Currency` | Provides secondary utility navigation, store/rider partner registration links, language selection, and location control. |
| **Main Header Bar** | `GIFT Marketplace Logo`, `Home`, `Categories ▾`, `Stores ▾`, `🔍 Search for grocery or store...`, `📦 Parcel`, `🛒 Cart`, `🔑 Sign In` | Primary branding strip with live search bar. Clicking Logo returns to home. Provides category dropdowns, cart drawer, and login button. |
| **Featured Categories Bar** | Round icon circles (`Fast Food`, `Italian`, `Pan Asian`, `Electronics`, `Fashion`, etc.) with `< >` arrows | Scrollable category menu for instant filtering of top product types across all modules. |
| **Hero Banners** | Main banner slider ("FAST FOOD - Find Your Meal"), side promo banners, and 4 trust badges | Displays active promotional campaigns, discounts, and core platform service guarantees. |
| **Marketplace Services & Modules** | 🛒 **Grocery** (`Explore Grocery ->`), 🍔 **Food** (`Order Food ->`), 💊 **Pharmacy** (`Get Medicines ->`), 🛍️ **Ecommerce** (`Shop Ecommerce ->`) | Primary service grid allowing users to launch specific shopping modules with dedicated store listings. |
| **Why Shop On Our Marketplace?** | 6 Value Cards: *Doorstep Delivery*, *100% Quality*, *Daily Deals*, *24/7 Support*, *Verified Stores*, *Hassle-Free Returns* | Outlines customer guarantees, speed of delivery, return security, and helpline reliability. |
| **Spotlight Banner** | "Groceries Delivery at your doorstep" banner with `Shop Now >` button and "Same Day Delivery" badge | Direct shortcut banner promoting fresh grocery orders. |
| **How Ordering Works** | 3 Step Cards: `01 Select Location & Module` ➔ `02 Choose Store & Products` ➔ `03 Fast Express Delivery` | Clear 3-step visual workflow explaining how simple it is to place an order. |
| **App & Seller Cards** | `Download Our App` (Google Play & App Store links) & `Become a Seller` (`Join Now ->`) | Downloads mobile application or launches shop vendor registration. |
| **Newsletter Bar** | Email input box + `Subscribe` button | Subscribes customers to weekly discount coupons and deal alerts. |
| **Footer Section** | Social icons, Email (`admin@admin.com`), Phone (`+92 320 7120953`), Address (`GIFT University, Gujranwala`), Terms & Privacy links | Contact information, support details, and legal documentation links. |

---

## 4. Browsing, Modules & Shopping Procedures

### 4.1 Set Delivery Location Procedure
**Goal:** Set or update your active delivery address so the platform displays available local stores.  
**Prerequisites:** Access to web browser location permissions or street address knowledge.

#### Procedure
1. Click **📍 Select location** at the top-left of the top utility bar.
2. In the location popup modal, select one of three methods:
   - **Method A (GPS Auto-Detect):** Click **Use Current Location** and click **Allow** on browser prompt.
   - **Method B (Address Search):** Type your street, neighborhood, or city name in the search box.
   - **Method C (Map Pin):** Click **Pick from Map** and drag the pin directly onto your house/building.
3. Click **Confirm Location**.

**Expected outcome:** The website reloads store listings filtered specifically for your delivery zone.

---

### 4.2 Explore Featured Categories & Banners
- Click any circular category icon (e.g., *Fast Food*, *Electronics*) under the main header to immediately filter products.
- Click **`<`** or **`>`** arrows on the category bar to scroll through all active categories.
- Click any promotional **Hero Banner** to jump directly to active discount campaigns.

---

### 4.3 Explore the 4 Main Shopping Modules
From the homepage section **"Marketplace Services & Modules"**:

1. **🛒 Grocery Module:** Click **`Explore Grocery ->`** to purchase fresh vegetables, fruits, dairy, ration, and cleaning products.
2. **🍔 Food Module:** Click **`Order Food ->`** to browse neighborhood restaurants, fast food burgers, biryani, pizzas, and desserts.
3. **💊 Pharmacy Module:** Click **`Get Medicines ->`** to order healthcare supplements, OTC drugs, baby care items, and hygiene essentials.
4. **🛍️ Ecommerce Module:** Click **`Shop Ecommerce ->`** to buy clothing, footwear, electronic accessories, and home appliances.

---

### 4.4 Search Products, Stores & Categories
1. Click the **🔍 Search Bar** (`Search for grocery or store...`) in the main header.
2. Type the item name (e.g., *"Milk"*, *"Chicken Burger"*, *"Panadol"*, *"Shirt"*) or store name.
3. Press **Enter**.
4. Use filter options on the results page to sort by **Price (Low to High)**, **Rating**, or **Distance**.

---

### 4.5 Manage Wishlist & Shopping Cart

#### A. Saving Items to Wishlist
- On any item card, click the **Heart Icon (❤️)**.
- View saved items anytime under **My Profile ➔ Wishlist**.

#### B. Adding Items to Shopping Cart
1. Click on a product card to open full details.
2. Choose size, weight, or variation options (if applicable).
3. Select quantity (`1`, `2`, `3`).
4. Click **Add to Cart**.

#### C. Cart Review
- Click the **🛒 Cart Icon** at the top-right header to open the slide-over cart drawer.
- Adjust item quantities using **`+`** or **`-`**, or remove items using **`🗑️`**.

---

## 5. Ordering and Checkout Procedures

```
[Open Cart Drawer] ➔ [Click Proceed to Checkout] ➔ [Select Delivery Address] ➔ [Apply Coupon] ➔ [Select Payment] ➔ [Place Order]
```

### 5.1 Review Cart & Proceed to Checkout
1. Click the **🛒 Cart Icon** in the header.
2. Review selected items and subtotal price.
3. Click **Proceed to Checkout**.

---

### 5.2 Select Delivery Address
1. On the checkout page, choose a saved delivery address (e.g., *Home*, *Office*).
2. OR click **Add New Address**, pin your exact location on the map, enter house/street details, and click **Save Address**.

---

### 5.3 Apply Promo Codes & Discount Coupons
1. Locate the **Apply Coupon** field on the checkout summary pane.
2. Type your promo code (e.g., `GIFT50`).
3. Click **Apply**. Verify that the discount amount is subtracted from your total bill.

---

### 5.4 Choose Payment Method
Select your preferred payment option:
- 💵 **Cash on Delivery (COD):** Pay cash to the delivery rider upon parcel arrival.
- 💳 **Digital Card Payment:** Enter Debit/Credit card details securely.
- 👛 **GIFT Wallet:** Pay instantly using your prepaid GIFT account wallet balance.

---

### 5.5 Confirm & Place Order
1. Review final item total, delivery fee, taxes, and final bill amount.
2. Click **Place Order**.
3. **Expected outcome:** The website displays an **Order Confirmation Screen** with your unique **Order ID** (e.g., `#100482`).

---

## 6. Order Tracking and Order Management

### 6.1 Real-Time Order Tracking Procedure & Track Order Page UI Reference (`/track-order`)

**Goal:** Track real-time status updates and courier location for an active order using the **Track Your Order Status** page.  
**Prerequisites:** An active or completed Order ID and registered phone number.

#### Track Order Page UI Reference

**Accessing the Page:** Click **Track Order** in the top utility bar (`/track-order`).

**Page Title:** `Track Your Order Status`  
**Page Subtitle:** `Enter your order ID and phone number below to get real-time delivery updates and courier status.`

| Form Element | Element Type | Icon / Prefix | Placeholder / Label | Requirement | Functional Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Order ID *** | Text Input | N/A | `e.g. 151515615616516` | **Required** | Type your numeric or alphanumeric Order ID. |
| **Phone** | Phone Input | 🇵🇰 Flag / Dropdown | `+92` | **Required** | Type registered 10-digit mobile phone number. |
| **Search Order Button** | Action Button | 🔍 Search Icon | `Search Order` | Action Control | Submits order lookup query to retrieve status bar & map pin. |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Track Your Order Status                          │
│     Enter your order ID and phone number below to get real-time         │
│                     delivery updates and courier status.                │
├─────────────────────────────────────────────────────────────────────────┤
│ [ Order ID *                     ]  |  [ Phone                         ]│
│ [ e.g. 151515615616516           ]  |  [ 🇵🇰 ▾  +92                    ]│
├─────────────────────────────────────────────────────────────────────────┤
│                         [ 🔍 Search Order ]                             │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Procedure
1. Click **Track Order** in the top utility bar (`/track-order`).
2. Type your order tracking number in **Order ID *** (`e.g. 151515615616516`).
3. Enter your phone number in **Phone** (`+92`).
4. Click **🔍 Search Order**.

**Expected outcome:** The website displays the active order progression status bar and rider map location.

---

### 6.2 Order Status Progression

```
🟡 Order Placed ➔ 🔵 Store Accepted ➔ 🟣 Preparing Items ➔ 🚴 Out for Delivery ➔ 🟢 Delivered
```

| Order Status | Meaning & Visual Representation | Customer Action |
| :--- | :--- | :--- |
| **Order Placed** | Order successfully sent to store. | Wait for store confirmation. |
| **Store Accepted** | Merchant confirmed item availability. | Order is being processed. |
| **Preparing Items** | Food is cooking or grocery is packing. | Order preparation stage. |
| **Out for Delivery** | Delivery rider picked up order and is traveling. | View rider name, phone number & live map pin. |
| **Delivered** | Order successfully handed over to customer. | Confirm receipt & rate order. |

---

### 6.3 Order History & Reordering
- Access past purchases under **My Profile ➔ Order History**.
- Click **Reorder** on any past order to instantly re-add all items into your cart.

---

### 6.4 Order Cancellation Procedure
- Customers can cancel an order from **My Orders** screen *only before* the store status changes to **Preparing Items**.
- If cancellation button is unavailable, contact Customer Support via helpline.

---

## 7. Special Services Procedures

### 7.1 Book a Parcel Pickup & Delivery
**Goal:** Send packages, keys, or documents across town via delivery rider.

#### Procedure
1. Click **📦 Parcel** in the header navigation (or **Parcel Module** on home).
2. Select package type (*Document*, *Electronics*, *Clothing*, *Food Package*, *Small Box*).
3. Enter **Pick-up Details** (Sender Name, Phone Number, Pickup Address).
4. Enter **Drop-off Details** (Receiver Name, Phone Number, Destination Address).
5. Select estimated package weight.
6. Choose payment option (**Paid by Sender** or **COD by Receiver**).
7. Click **Confirm Parcel Booking**.

---

### 7.2 Book a Rental Ride or Vehicle
**Goal:** Rent a vehicle or transport ride for personal travel or cargo.

#### Procedure
1. Click **🚗 Rental** on the homepage.
2. Select vehicle type (*Car*, *SUV*, *Bike*, *Pickup Truck*).
3. Enter **Pick-up Address** and **Drop-off Destination**.
4. Select **Pick-up Date & Time** and **Return Date & Time**.
5. Review estimated fare and click **Book Ride**.

---

## 8. Wallet, Loyalty Points & Discounts

### 8.1 GIFT Wallet Management
- View wallet balance under **My Profile ➔ Wallet**.
- Top up balance via card payment or bank transfer.
- Use wallet balance for instant 1-click order checkout.

---

### 8.2 Loyalty Points & Discount Redemption
- Earn reward points automatically on every completed purchase.
- Convert accumulated points into wallet cash under **My Profile ➔ Loyalty Points** to apply instant discounts on future orders.

---

## 9. Partner Onboarding Links

### 9.1 Become a Seller (Store Registration)
- Click **Become a Seller** in top utility bar (`/store-registration`).
- Enter shop name, merchant contact info, address, and business registration details.
- Upload shop logo and CNIC/business documents and submit for admin approval.

---

### 9.2 Become a Rider (Deliveryman Registration)
- Click **Become a Rider** in top utility bar (`/deliveryman-registration`).
- Enter personal details, vehicle type (Freelance or Salary-Based), and zone.
- Upload CNIC photos (Front/Back) and Driving License and submit for admin review.

---

## 10. Interface and Status Reference

### 10.1 Primary Web Controls

| Control / Element | Primary Purpose | Usage Condition |
| :--- | :--- | :--- |
| **📍 Select Location** | Opens location search and map pin modal | Required before browsing local stores. |
| **🔍 Search Input** | Searches items, categories, and stores | Use anytime to locate specific products. |
| **🛒 Cart Drawer** | Displays selected items, quantity controls & subtotal | Open to review order before checkout. |
| **Apply Coupon** | Subtracts promo discount from total bill | Enter valid coupon code before payment. |
| **Track Order** | Opens live delivery tracking status bar and map | Available after placing an active order. |

---

### 10.2 Important Statuses

| Status Tag | System Definition | Customer Meaning |
| :--- | :--- | :--- |
| **Pending / Placed** | Order submitted to system | Store notification pending. |
| **Processing / Preparing** | Store confirmed & packing items | Order is being prepared. |
| **Out for Delivery** | Rider assigned and carrying parcel | Live map tracking active. |
| **Delivered** | Order completed successfully | Handover complete. |
| **Cancelled** | Order terminated before preparation | Payment refunded if digital. |

---

## 11. Security, Legal & Data Handling

### 11.1 General Data Protection & Account Safety
- Keep your customer login password and SMS OTP verification codes private.
- Never share OTP codes with delivery riders or telephone callers.
- Always verify order total and bill amount before handing cash to delivery riders for Cash on Delivery (COD) orders.
- Ensure browser connection is secure (`https://`) when entering credit/debit card details.

---

### 11.2 Terms and Conditions Page Reference

**Accessing the Page:** Click **Terms & Conditions** in the website footer or click **terms and conditions** in the **Create Account** signup modal (`/terms-and-conditions`).

**Page Title:** `Terms And Conditions`  
**Effective Date:** `05/03/2026`

Below is the complete mapping of the 12 legal sections as displayed on the live platform:

| Clause # | Section Title | Legal Summary & Customer Operational Impact |
| :--- | :--- | :--- |
| **1** | **Introduction** | Welcomes users to GIFT Marketplace. Using the website or app constitutes full agreement to comply with these terms. |
| **2** | **Services** | GIFT Marketplace provides online platforms for parcel delivery, ecommerce, food, and grocery services. Platform reserves the right to update or modify services at any time without prior notice. |
| **3** | **Account Registration** | Users must register an account to access checkout and tracking. Users agree to provide accurate, complete information and maintain account security. |
| **4** | **Usage of the Platform** | Platform must be used for lawful purposes only. Users shall not engage in activities that disrupt or harm platform functionality. |
| **5** | **Payment Terms** | All services and packages are charged according to listed prices. Full payment must be completed at purchase time via accepted payment methods (COD, Card, Wallet). |
| **6** | **Cookies and Privacy** | Cookies are used to enhance customer browsing experience. Using the site implies consent to cookie usage according to the Cookie Policy. |
| **7** | **Intellectual Property** | All text, graphics, logos, and software content are owned by GIFT Marketplace and protected by copyright laws. Unauthorized reproduction is prohibited. |
| **8** | **Limitation of Liability** | GIFT Marketplace is not liable for damages resulting from service usage, data loss, or service interruption, nor does it guarantee uninterrupted or error-free access at all times. |
| **9** | **Termination** | Platform reserves the right to suspend or terminate user access at its sole discretion if Terms and Conditions are violated. |
| **10** | **Governing Law** | Governed by the laws of Pakistan. Any legal disputes shall be resolved exclusively in the appropriate courts of Pakistan. |
| **11** | **Changes to Terms** | Terms may be updated periodically. Updates are posted directly on the page with an updated effective date (`05/03/2026`). |
| **12** | **Contact Information** | For legal or policy inquiries regarding these Terms and Conditions, users can contact `GIFT.EDU.PK` or official support. |

---

## 12. Troubleshooting and Support

### 12.1 Diagnostic Checklist
- Verify your computer or mobile device has an active Internet connection.
- Ensure browser location permissions are set to **Allow** for automatic GPS location detection.
- Check that your mobile number is entered correctly with country code (`+92`) during OTP registration.

---

### 12.2 Common Issues & Solutions

| Issue | Possible Cause | Recommended Solution |
| :--- | :--- | :--- |
| **No stores showing on homepage** | Delivery location not set or no stores in area | Click **Select Location** and choose a valid city/area. |
| **OTP SMS code not arriving** | Network delay or invalid mobile number | Wait for countdown timer and click **Resend OTP**. |
| **Promo code rejected** | Code expired, typo, or subtotal minimum not met | Check coupon terms and re-type promo code. |
| **Payment card declined** | Insufficient funds or bank authorization issue | Retry card or select **Cash on Delivery (COD)**. |

---

### 12.3 Official Help & Support Page UI Reference (`/help-and-support`)

**Accessing the Page:** Click **Help & Support** in the top utility bar or in the website footer (`/help-and-support`).

**Page Title:** `Need Any help?`  
**Page Subtitle:** `Communicate with our support team to get proper guidance to your quaternaries.`  
**Header Graphic:** Support Operator Vector Illustration with 24/7 badge and 5-Star rating.

Below is the complete UI mapping of the 3 official contact support cards:

| Card Title | Icon | Displayed Details & Address | Operational Usage |
| :--- | :--- | :--- | :--- |
| **VISIT US** | 🏢 Building Icon | `GIFT University, Lohian Wala, Gujranwala, Pakistan` | Physical campus address for official in-person inquiries. |
| **EMAIL US** | ✉️ Envelope Icon | `admin@admin.com` | Official support email for complaint tickets & queries. |
| **CALL US** | 📞 Phone Operator Icon | `3207120953` | Direct customer helpline phone number. |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             Need Any help?                              │
│       Communicate with our support team to get proper guidance to       │
│                            your quaternaries.                           │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────┐ │
│  │       🏢 VISIT US     │ │      ✉️ EMAIL US      │ │   📞 CALL US   │ │
│  │ GIFT University,      │ │   admin@admin.com     │ │   3207120953   │ │
│  │ Lohian Wala,          │ │                       │ │                │ │
│  │ Gujranwala, Pakistan  │ │                       │ │                │ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Appendix A. Glossary

| Term | Operational Meaning |
| :--- | :--- |
| **COD** | Cash on Delivery. Customer pays cash to the rider upon parcel delivery. |
| **Module** | A dedicated shopping department (Grocery, Food, Pharmacy, E-Commerce, Parcel, Rental). |
| **OTP** | One-Time Password. A 6-digit security code sent via SMS for account verification. |
| **Cart Drawer** | A slide-over window showing items added to shopping bag. |
| **GIFT Wallet** | In-app prepaid digital wallet balance for instant order payments. |

---

## Appendix B. Pre-publication Review Checklist

- [x] Structure strictly aligned with Master Document Template.
- [x] Document Control & Revision History tables complete.
- [x] System requirements, browser specifications, and permissions documented.
- [x] Sign-up (Create Account) & Sign-in (Welcome Back) UI tables & step-by-step procedures updated with exact field names, icons, and buttons from screenshots.
- [x] Complete UI mapping for Homepage Screenshot (Image 1) included.
- [x] Terms and Conditions page mapping (12 legal clauses & Effective Date 05/03/2026) added.
- [x] About Us page mapping (`/about-us`) added.
- [x] Track Your Order Status page mapping (`/track-order`) added with exact fields (`Order ID *`, `Phone`, `🔍 Search Order`).
- [x] Help & Support page mapping (`/help-and-support`) added with 3 contact cards (**VISIT US**, **EMAIL US**, **CALL US**).
- [x] All 6 core modules, search, cart, checkout, parcel, rental, tracking, wallet, and onboarding links mapped.
- [x] Written in simple, accessible English suitable for general customers.
- [ ] Confirm official release date, approver signatures, legal privacy policy text, and helpline operating hours before publication.

---

*GIFT MARKETPLACE WEB User Manual and Procedures Guide - Version 3.7 (Draft for Team Review)*  
