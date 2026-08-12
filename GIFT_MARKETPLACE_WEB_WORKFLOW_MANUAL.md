# GIFT MARKETPLACE WEB
## User Manual and Procedures Guide
### End-to-End User & Operations Workflows Edition

**Web Application**  
**Product Version:** 3.7  
**Draft for Team Review**  
**Prepared Date:** 29 July 2026  

---

## Document Purpose & Overview

This manual provides a **100% complete, step-by-step workflow guide** for using the **GIFT Marketplace Web Application (v3.7)**. Instead of high-level summaries, this guide details **every single action, button click, form input, modal transition, and procedure** required for customers, riders, and vendors to operate the platform smoothly.

---

## 📌 Master Table of Workflows

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ WORKFLOW 1: App Launch & Delivery Location Setup Flow                                           │
│ WORKFLOW 2: User Account Creation, Sign In & Security Flow                                       │
│ WORKFLOW 3: Product Browsing, Search & Multi-Module Filtering Flow                              │
│ WORKFLOW 4: Shopping Cart, Checkout & Order Placement Flow                                      │
│ WORKFLOW 5: Live Real-Time Order Tracking Flow                                                  │
│ WORKFLOW 6: City-Wide Parcel Delivery Booking Flow                                              │
│ WORKFLOW 7: Delivery Rider / Partner Registration Flow                                          │
│ WORKFLOW 8: Vendor / Store Registration Flow                                                    │
│ WORKFLOW 9: Profile, Wallet, Rewards & Support Desk Flow                                         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## WORKFLOW 1: App Launch & Delivery Location Setup Flow

### Step-by-Step Execution Sequence

```
[Open Website] ➔ [Click 'Select Location'] ➔ [Choose Detection Mode] ➔ [Confirm Location] ➔ [Homepage Loaded]
```

#### Step 1: Open Web Application
1. Open your web browser (Chrome, Edge, Safari, Firefox).
2. Enter URL: `http://localhost:3000` (or live production URL).
3. The main landing page will load displaying top navigation bars.

#### Step 2: Trigger Location Dialog
1. Locate the **"📍 Select location"** button at the top-left corner of the header.
2. Click **"📍 Select location"**.

#### Step 3: Choose Location Input Method
* **Option A — Use Current Location**:
  1. Click **"➕ Use Current Location"**.
  2. Click **"Allow"** when your browser requests location access.
  3. The system detects your latitude/longitude automatically.
* **Option B — Pick From Map**:
  1. Click **"Pick from map"**.
  2. Drag the location pin to your building or street address.
  3. Type specific street details if prompted.

#### Step 4: Confirm & Activate
1. Click **"Confirm Location"**.
2. The homepage refreshes to display stores, restaurants, and products available in your area.

---

## WORKFLOW 2: User Account Creation, Sign In & Security Flow

### Step-by-Step Execution Sequence

```
[Click Sign In Button] ➔ [Open Sign In Modal] ➔ [Choose Email/Phone or Google] ➔ [Enter Credentials] ➔ [Login / Verify OTP]
```

#### Step 1: Open Authentication Modal
1. Click the **"🔑 Sign In"** button located on the right side of the main brand header.
2. The **Welcome Back** modal pop-up appears on screen.

#### Step 2: Logging In (Existing Users)
1. Click the **"Email/Phone *"** field and type your registered email or mobile number.
2. Click the **"Password *"** field and type your password (minimum 8 characters).
3. *(Optional)* Check **"Remember me"** to stay logged in.
4. Click **"Sign In"**.

#### Step 3: Social Login (1-Click Google Sign-In)
1. Click **"G Continue with Google"**.
2. Select your Google Account from the browser popup to authenticate instantly.

#### Step 4: Account Registration (New Users)
1. In the Sign In modal, click **"Sign Up"** next to *"Don't have an account?"*.
2. Enter **Full Name**, **Email**, **Phone Number** (with country code +92), and **Password**.
3. Check **"I agree to the Terms & Conditions"**.
4. Click **"Sign Up"**.
5. Enter the **6-digit OTP code** sent via SMS to verify your account.

---

## WORKFLOW 3: Product Browsing, Search & Multi-Module Filtering Flow

#### Step 1: Select Desired Module
From the homepage, select one of the 4 core purchasing modules:
* 🛒 **Grocery**: Ration, fresh vegetables, dairy, house essentials.
* 🍔 **Food**: Fast food, pizza, biryani, desserts, drinks.
* 💊 **Pharmacy**: Medicines, health supplements, baby products.
* 🛍️ **Ecommerce**: Clothing, gadgets, home decor, cosmetics.

#### Step 2: Perform Direct Search
1. Click the central **Search Bar**: `[ 🔍 Search for grocery or store... ]`.
2. Type item name (e.g., *"Milk"*, *"Panadol"*, *"Pizza"*).
3. Press **Enter** to open the Search Results page.

#### Step 3: Apply Result Filters
On the Search Results page, use the left sidebar filters:
* **Sort By**: Price (Low to High), Rating (High to Low), Popularity.
* **Store Category**: Select specific store brands or categories.
* **Rating Filter**: Check boxes for 4★ & above.

#### Step 4: Inspect Product & Select Quantity
1. Click on a product card to open the **Product Detail Modal**.
2. Select size, variation, or add-ons (if applicable).
3. Use `+` / `-` buttons to set item quantity.
4. Click **"Add to Cart"**.

---

## WORKFLOW 4: Shopping Cart, Checkout & Order Placement Flow

### Step-by-Step Execution Sequence

```
[Click Cart Icon 🛒] ➔ [Review Items] ➔ [Click Checkout] ➔ [Set Address] ➔ [Apply Coupon] ➔ [Choose Payment] ➔ [Place Order]
```

#### Step 1: Open Shopping Cart Drawer
1. Click the **"🛒 Cart"** icon at the top-right header.
2. The Cart Drawer slides out from the right showing all added items.

#### Step 2: Review Cart Items
* Adjust quantities using `+` and `-` buttons.
* Click the trash icon to remove any unwanted item.
* Check the **Subtotal**, **Tax**, and **Estimated Delivery Fee**.

#### Step 3: Proceed to Checkout
Click **"Proceed to Checkout"** at the bottom of the cart drawer.

#### Step 4: Set Delivery Address
1. Select a saved address (e.g., *Home*, *Work*).
2. OR click **"+ Add New Address"**, drop a map pin, and enter House No., Street, and Landmark details.

#### Step 5: Apply Discount Coupon
1. Enter your promo code in the **"Apply Coupon"** field.
2. Click **"Apply"**. The bill total will update with the discount amount.

#### Step 6: Select Payment Method
Choose your payment mode:
* 💵 **Cash on Delivery (COD)**: Pay cash to the rider at delivery.
* 💳 **Digital Credit/Debit Card**: Enter card number, expiry, and CVV.
* 👛 **Marketplace Wallet**: Pay directly from your pre-loaded wallet.

#### Step 7: Place Order & Confirm
1. Click **"Place Order"**.
2. The screen displays the **Order Success Page** along with your unique **Order ID #** (e.g., `#100245`).

---

## WORKFLOW 5: Live Real-Time Order Tracking Flow

#### Step 1: Open Order Tracking Page
1. Click **"Track Order"** in the top navigation bar, OR navigate directly to `/track-order`.

#### Step 2: Input Order Credentials
1. Click **"Order ID *"** field and enter your Order Number (e.g., `151515615616516`).
2. Click **"Phone *"** field, select country flag (+92), and type your mobile number.
3. Click **"🔍 Search Order"**.

#### Step 3: Monitor Live Order Status
The tracking dashboard displays live progress:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 🟡 Pending / Placed   ➜   🔵 Accepted by Store   ➜   🟣 Item Preparing  │
│ 🚴 Out for Delivery (Rider Live GPS Map)         ➜   🟢 Delivered       │
└─────────────────────────────────────────────────────────────────────────┘
```

* **Rider Information**: View Rider Name, Vehicle Number, and tap **"Call Rider"** to communicate directly.

---

## WORKFLOW 6: City-Wide Parcel Delivery Booking Flow

#### Step 1: Access Parcel Page
1. Click the **🚚 Parcel** icon in the header or homepage module grid to open `/parcel-delivery-info`.

#### Step 2: Fill Sender Information (Column 1)
1. **Sender Name**: Enter full name of person sending package.
2. **Email**: Enter sender email address.
3. **Phone**: Enter mobile number with country code (+92).
4. **Address Pinning**: Click **"Set from map"** or search street in **"Search location here..."**.
5. **Detail Fields**: Enter **Street number**, **House no.**, and **Floor no.**.

#### Step 3: Fill Receiver Information (Column 2)
1. **Receiver Name**: Enter full name of recipient.
2. **Email**: Enter recipient email address.
3. **Phone**: Enter recipient mobile number (+92).
4. **Address Pinning**: Click **"Set from map"** or search address in **"Search location here..."**.
5. **Detail Fields**: Enter **Street number**, **House no.**, and **Floor no.**.

#### Step 4: Parcel Info & Checkout (Column 3)
1. Select parcel category (Document, Clothing, Food, Electronics).
2. Enter estimated weight (kg).
3. Click **"Proceed to Checkout"**.
4. Select payment (Paid by Sender or Paid by Receiver on COD) and confirm booking.

---

## WORKFLOW 7: Delivery Rider / Partner Registration Flow

#### Step 1: Access Rider Portal
Click **"Become a Rider"** in the top navigation bar (`/deliveryman-registration`).

#### Step 2: Fill User Information
1. Enter **First Name** and **Last Name**.
2. Enter **Email Address**.
3. Select **Deliveryman Type**: *Commission-Based* or *Salary-Based*.
4. Select **Delivery Zone**: Choose city/zone.
5. Select **Vehicle Type**: *Motorbike*, *Bicycle*, *Scooter*, *Car*, *Van*.
6. Upload **Profile Image** (JPG/PNG < 1MB).

#### Step 3: Account Info & Password
1. Enter **Phone Number** (+92).
2. Enter **Password** and **Confirm Password** (minimum 8 characters).

#### Step 4: Identity Document Verification
1. Select **Identity Type**: **CNIC**, **Passport**, or **Driving License**.
2. Enter **Identity Number** (Auto-formats as `xxxxx - xxxxxxx - x`).
3. Upload **Front Side** photo and **Back Side** photo of document (< 2MB).

#### Step 5: Submit Application
Check **"I agree to the Terms and Conditions"** and click **"Submit Information"**. Admin will verify documents and activate account within 24 hours.

---

## WORKFLOW 8: Vendor / Store Registration Flow

#### Step 1: Access Seller Portal
Click **"Become a Seller"** in the top navigation bar (`/store-registration`).

#### Step 2: Enter Store Details
1. Enter **Store Name**, **Store Address**, and **Delivery Zone**.
2. Select Store Module Type (Grocery, Food, Pharmacy, Ecommerce).
3. Upload **Store Logo** and **Cover Banner**.

#### Step 3: Owner Credentials & Tax Info
1. Enter Owner **First Name**, **Last Name**, **Email**, **Phone**, and **Password**.
2. Upload business license / tax registration document.
3. Click **"Submit Application"**.

---

## WORKFLOW 9: Profile, Wallet, Rewards & Support Desk Flow

#### Managing Wallet & Loyalty Points
1. Click **Profile Dropdown** (Top Right) ➔ Select **My Wallet**.
2. View current balance or click **"Add Fund"** to deposit money using card/online banking.
3. Select **Loyalty Points** tab to convert accumulated points into instant wallet cash.

#### Contacting Support Desk (`/help-and-support`)
* 🏢 **VISIT US**: *GIFT University, Lohian Wala, Gujranwala, Pakistan*
* ✉️ **EMAIL US**: *admin@admin.com*
* 📞 **CALL US**: *3207120953*

---

*GIFT MARKETPLACE WEB End-to-End Workflow Manual & Procedures Guide - Version 3.7 (Draft for Team Review)*
