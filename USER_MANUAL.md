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
| **0.7** | 12 August 2026 | Added complete UI mapping & Administrator Review & Notification workflows for Store & Rider Registration pages | Documentation Team |
| **0.8** | 12 August 2026 | Added header Categories ▾ Mega Menu and Stores ▾ Mega Menu complete structural mapping and navigation rules | Documentation Team |
| **0.9** | 12 August 2026 | Documented Module-Isolated Cart System & Right Floating Side Module Switcher Bar across 4 core modules | Documentation Team |
| **1.0** | 12 August 2026 | Added Product Card Quick Controls, Toast Feedback Notifications, and Product Details Page UI Mapping | Documentation Team |
| **1.1** | 12 August 2026 | Added Slide-Over Shopping Cart Drawer UI Mapping & Customer Account Profile Dropdown Menu (9 items) | Documentation Team |
| **1.2** | 12 August 2026 | Added Profile Settings Dashboard (`/profile`) and My Orders Dashboard with 4 Expanded Tabs (Order Summary, Seller Info, Delivery Man Info, Track Order Map) | Documentation Team |
| **1.3** | 12 August 2026 | Added GIFT Wallet Dashboard, Loyalty Points Conversion Dashboard (200 pts min threshold rule), and Coupons Page UI Mapping | Documentation Team |
| **1.4** | 12 August 2026 | Added Customer Inbox & Live Chat, Referral Code Program (Rs.100 bonus), and Account Settings Language Selector | Documentation Team |
| **1.5** | 12 August 2026 | Added Pre-Shopping System Rules (Mandatory Location, Login Requirement, Closed Store Notification) & Full Checkout Page (`/checkout`) UI Mapping | Documentation Team |
| **1.6** | 12 August 2026 | Added Order Cancellation UI Mapping (`Cancel Order` button), Cancellation Window Rules, and 6-Stage Progress Stepper | Documentation Team |
| **1.7** | 12 August 2026 | Added Previous Orders Dashboard, Reorder Procedure, Refund Request Workflow (`Request Submitted - Under Review`), and Write Review Rating Form | Documentation Team |

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
   - 3.4 Header Dropdown Mega Menus Mapping (Categories ▾ & Stores ▾)
     - 3.4.1 Categories ▾ Dropdown Mega Menu Reference
     - 3.4.2 Stores ▾ Dropdown Mega Menu Reference
   - 3.5 Profile Settings Dashboard Reference (`/profile`)
     - 3.5.1 Profile Left Navigation Sidebar & Summary Metric Badges
     - 3.5.2 Personal Details, Saved Addresses & Password Change UI Reference
   - 3.6 Customer Inbox & Live Chat Messaging (`/single-profile?page_name=inbox`)
   - 3.7 Customer Account Settings & Language Preferences (`/single-profile?page_name=settings`)
4. [Browsing, Modules & Shopping Procedures](#4-browsing-modules--shopping-procedures)
   - 4.1 Mandatory Pre-Shopping Rules & Location Setup
     - 4.1.1 Mandatory Location Selection Rule (`🔴 Please select your location first`)
     - 4.1.2 Mandatory Login for Cart Addition Rule
     - 4.1.3 Closed Store & Restaurant Operating Hours Rule (`Store is closed`)
     - 4.1.4 Browser GPS Location Permission Instructions
   - 4.2 Explore Featured Categories & Banners
   - 4.3 Explore the 4 Main Shopping Modules & Right Floating Side Switcher Bar
     - 4.3.1 Module-Specific UI Specifications & Banners
     - 4.3.2 Right Floating Side Module Switcher Bar
   - 4.4 Search Products, Stores & Categories
   - 4.5 Module-Isolated Cart System & Wishlist Management
     - 4.5.1 Module-Isolated Cart Architecture & Isolation Rules
     - 4.5.2 Product Card Quick Actions & System Notification Toasts
     - 4.5.3 Slide-Over Shopping Cart Drawer UI Reference & Procedure
   - 4.6 Product Details Page Reference & Buying Procedures (`/product/[id]`)
     - 4.6.1 Product Details Page UI Mapping
     - 4.6.2 Product Details Purchase & Wishlist Procedure
5. [Ordering and Checkout Procedures](#5-ordering-and-checkout-procedures)
   - 5.1 Overview of Checkout Workflow
   - 5.2 Full Checkout Page UI Reference & Visual Mapping (`/checkout`)
     - 5.2.1 Checkout Page Component & Controls Breakdown Table
     - 5.2.2 Mandatory Delivery Address Rule
   - 5.3 Step-by-Step Order Placement Procedure
6. [Order Tracking and Order Management](#6-order-tracking-and-order-management)
   - 6.1 Real-Time Order Tracking Procedure & Track Order Page UI Reference (`/track-order`)
   - 6.2 My Orders Dashboard & Expanded Order Tabs Reference (`/single-profile?page_name=my-orders`)
     - 6.2.1 My Orders List & Filter Chips
     - 6.2.2 Tab 1: Order Summary UI Mapping
     - 6.2.3 Tab 2: Seller Info UI Mapping & Store Chat
     - 6.2.4 Tab 3: Delivery Man Info UI Mapping
     - 6.2.5 Tab 4: Live 6-Stage Order Track Stepper & Interactive Map Mapping
   - 6.3 Order History & Reordering Procedure
   - 6.4 Order Cancellation Procedure & Cancel Order Button UI Reference
     - 6.4.1 Order Cancellation Header UI Reference
     - 6.4.2 Cancellation Eligibility Window Rules
     - 6.4.3 Step-by-Step Order Cancellation Procedure
   - 6.5 Previous Orders Dashboard UI Mapping (`My Orders ➔ Previous`)
   - 6.6 Submit a Refund Request Procedure (`What's Wrong With This Order?`)
     - 6.6.1 Refund Request Modal UI Mapping
     - 6.6.2 Step-by-Step Refund Request Procedure & Review Status
   - 6.7 Rate Products & Delivery Service Procedure (`Write Review`)
     - 6.7.1 Write Review Modal UI Mapping
     - 6.7.2 Step-by-Step Rating & Review Procedure
7. [Special Services Procedures](#7-special-services-procedures)
   - 7.1 Book a Parcel Pickup & Delivery
   - 7.2 Book a Rental Ride or Vehicle
8. [Wallet, Loyalty Points & Discounts](#8-wallet-loyalty-points--discounts)
   - 8.1 GIFT Wallet Management (`/single-profile?page_name=wallet`)
     - 8.1.1 Wallet Dashboard UI Mapping & Balance Card
     - 8.1.2 Transaction History Filters & Add Fund Procedure
   - 8.2 Loyalty Points & Wallet Currency Conversion (`/single-profile?page_name=loyalty-points`)
     - 8.2.1 Loyalty Points Dashboard UI Mapping & Minimum Threshold Rule
     - 8.2.2 Points History Table & Conversion Procedure
   - 8.3 Coupons & Voucher Management (`/single-profile?page_name=coupons`)
     - 8.3.1 Coupons Page UI Mapping
     - 8.3.2 Coupon Copying & Checkout Application Procedure
   - 8.4 Referral Code & Bonus Program (`/single-profile?page_name=referral-code`)
     - 8.4.1 Referral Dashboard UI Mapping & Sharing Channels
     - 8.4.2 Step-by-Step Referral Earnings Procedure
9. [Partner Onboarding Procedures & Admin Workflows](#9-partner-onboarding-procedures--admin-workflows)
   - 9.1 Marketplace Seller Registration (`/store-registration`)
     - 9.1.1 Seller Registration Form UI Reference & Stepper
     - 9.1.2 Step-by-Step Store Registration Procedure
     - 9.1.3 System Administrator Notification & Approval Workflow
   - 9.2 Marketplace Rider Registration (`/deliveryman-registration`)
     - 9.2.1 Rider Registration Form UI Reference
     - 9.2.2 Step-by-Step Rider Registration Procedure
     - 9.2.3 System Administrator Verification & Notification Workflow
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

---

## 2. Product Overview and Requirements

---

## 3. Getting Started & User Account Setup

---

## 4. Browsing, Modules & Shopping Procedures

---

## 5. Ordering and Checkout Procedures

---

## 6. Order Tracking and Order Management

---

### 6.5 Previous Orders Dashboard UI Mapping (`My Orders ➔ Previous`)

**Accessing Previous Orders:** Go to **Profile Avatar** ➔ **My Orders** ➔ click **Previous** tab.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ My Orders - View and manage all your orders                                                            │
│ Ongoing   [Previous]                                                                                   │
│ [ All ]  [ Delivered ]  [ Refund Credited ]  [ Cancelled ]                                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Order #100492 (2 Items) | Status: Delivered      Rs.10043 [ 🔄 Reorder ] [ 📄 Refund ] [ ⭐ Write Review ]│
│ 🚚 Delivered: Aug 12, 2026 05:59 pm                                                                    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Previous Orders Card Action Buttons

| Button | Style | Primary Action & Function |
| :--- | :--- | :--- |
| **Reorder Items** | Dark Blue Button | Instantly re-adds all items from this delivered order into your active module cart. |
| **Refund Request** | Outline Button | Opens the **What's Wrong With This Order?** modal to request a product refund. |
| **Write Review** | Outline Button + ⭐ | Opens the product quality & delivery rating modal to post customer reviews. |

---

### 6.6 Submit a Refund Request Procedure (`What's Wrong With This Order?`)

**Goal:** Submit a formal refund claim with photo proof if delivered items are damaged, incorrect, or poor quality.  
**Prerequisites:** A completed/delivered order displayed under **My Orders ➔ Previous**.

#### 6.6.1 Refund Request Modal UI Mapping

```
┌─────────────────────────────────────────────────────────────────────────┐
│ What's Wrong With This Order?                                       [✕] │
├─────────────────────────────────────────────────────────────────────────┤
│ Select an option *                                                    ▾ │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ • I ordered the wrong food                                          │ │
│ │ • Wrong item delivered                                              │ │
│ │ • Food quality issue                                                │ │
│ │ • Item was not what was ordered                                     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ Note *                                                                  │
│ [ Type detailed explanation of the issue...                           ] │
├─────────────────────────────────────────────────────────────────────────┤
│ [ 📷 File Upload ] JPG, PNG, WEBP max 2MB                               │
├─────────────────────────────────────────────────────────────────────────┤
│                     [ Submit Refund Request ]                           │
└─────────────────────────────────────────────────────────────────────────┘
```

##### Modal Controls Breakdown

| Field Name | Type | Options / Requirement | Purpose |
| :--- | :--- | :--- | :--- |
| **Select an option *** | Dropdown | *I ordered wrong food*, *Wrong item delivered*, *Food quality issue*, *Item was not what was ordered* | Identifies primary reason for refund claim. |
| **Note *** | Text Area | Required text explanation | Customer's detailed explanation of problem. |
| **File Upload** | Upload Box | Optional image upload | Attach photo proof of damaged/wrong item. |
| **Submit Button** | Action Button | Dark Blue `Submit Refund Request` | Sends refund claim to System Admin for review. |

---

#### 6.6.2 Step-by-Step Refund Request Procedure & Review Status

##### Procedure
1. Go to **Profile Avatar** ➔ **My Orders** ➔ click **Previous** tab.
2. Locate the delivered order (e.g. `Order #100492`).
3. Click the **Refund Request** button.
4. In the **What's Wrong With This Order?** modal:
   - Select the issue reason from **Select an option *** dropdown.
   - Type an explanation in **Note ***.
   - Click **File Upload** and attach a clear photo of the item.
5. Click **Submit Refund Request**.

**Expected outcome:** The website displays a green notification toast: **`🟢 Refund request placed successfully`**. The order status badge updates to **`Request Submitted - Under Review`**. Once the System Admin approves the claim, refunded money is credited back into your **GIFT Wallet** and listed under `Refund Credited` filter chip.

---

### 6.7 Rate Products & Delivery Service Procedure (`Write Review`)

**Goal:** Submit star ratings and text feedback for purchased items and delivery service.  
**Prerequisites:** A completed/delivered order.

#### 6.7.1 Write Review Modal UI Mapping

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Write Review                                                        [✕] │
├──────────────────────────────────────┬──────────────────────────────────┤
│ Rate and review purchased product:   │ Sold by Daniyal Ecommerce        │
│ Women Embroidered Maxi Dress         │ Rate and review delivery service:│
│ ⭐⭐⭐⭐⭐                            │ ⭐⭐⭐⭐⭐                        │
│ [ Tell us about product quality... ] │                                  │
│                                      │                                  │
│ 20 KG Weight Plate                   │ [ Image / No deliveryman icon ]  │
│ ⭐⭐⭐⭐⭐                            │                                  │
│ [ Tell us about product quality... ] │                                  │
├──────────────────────────────────────┴──────────────────────────────────┤
│                              [ Submit ]                                 │
└─────────────────────────────────────────────────────────────────────────┘
```

---

#### 6.7.2 Step-by-Step Rating & Review Procedure

##### Procedure
1. Go to **Profile Avatar** ➔ **My Orders** ➔ click **Previous** tab.
2. Locate the delivered order and click **Write Review**.
3. For each purchased item:
   - Click stars (1 to 5 ⭐) under **Rate and review purchased product**.
   - Type product feedback in *Tell us about product quality and condition*.
4. Under **Rate and review delivery service**, select star rating (1 to 5 ⭐) for the merchant & delivery rider.
5. Click **Submit**.

**Expected outcome:** Reviews are saved to the product catalog and store seller profile.

---

## 7. Special Services Procedures

---

## 8. Wallet, Loyalty Points & Discounts

---

## 9. Partner Onboarding Procedures & Admin Workflows

---

## 10. Interface and Status Reference

---

## 11. Security, Legal & Data Handling

---

## 12. Troubleshooting and Support

---

## Appendix A. Glossary

---

## Appendix B. Pre-publication Review Checklist

- [x] Structure strictly aligned with Master Document Template.
- [x] Document Control & Revision History tables complete.
- [x] Sign-up & Sign-in modals mapped.
- [x] Terms & Conditions (12 clauses) and About Us page mapped.
- [x] Track Your Order Status & Help & Support (3 cards) mapped.
- [x] Seller Registration (`/store-registration`) & Rider Registration (`/deliveryman-registration`) mapped with Admin Auto-Notification workflows.
- [x] Header Categories ▾ Mega Menu & Stores ▾ Mega Menu mapped.
- [x] Module-Isolated Cart System & Right Floating Side Module Switcher Bar mapped.
- [x] Product Card Quick Controls, Toast Feedback (`🟢 Item added to cart` / `🔴 Out of stock`), and Product Details Page mapped.
- [x] Slide-Over Shopping Cart Drawer & Profile Dropdown Menu (9 items) mapped.
- [x] Profile Settings Dashboard (`/profile`) & My Orders Dashboard with 4 Expanded Tabs mapped.
- [x] GIFT Wallet Dashboard, Loyalty Points Conversion Dashboard & Coupons Page mapped.
- [x] Referral Code Program (Rs.100 bonus), Customer Inbox & Account Settings mapped.
- [x] Mandatory Pre-Shopping Rules (Location Required, Login Requirement, Closed Store) & Full Checkout Page mapped.
- [x] Order Cancellation Header UI Mapping (Coral Red `Cancel Order` button) added in Section 6.4.
- [x] Previous Orders Dashboard (`My Orders ➔ Previous`) filter chips & 3 action buttons added in Section 6.5.
- [x] Submit a Refund Request Modal UI Mapping (`What's Wrong With This Order?`), Photo Evidence Upload & Admin Review Status (`Request Submitted - Under Review`) added in Section 6.6.
- [x] Rate Products & Delivery Service (`Write Review`) modal mapping & procedures added in Section 6.7.
- [x] Written in simple, accessible English suitable for general customers.
- [ ] Confirm official release date, approver signatures, legal privacy policy text, and helpline operating hours before publication.

---

*GIFT MARKETPLACE WEB User Manual and Procedures Guide - Version 3.7 (Draft for Team Review)*  
