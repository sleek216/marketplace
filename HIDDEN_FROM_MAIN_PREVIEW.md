## Hidden sections from main preview

This document lists all UI sections that have been **intentionally hidden** from the main user-facing views, plus how to re‑enable them if needed.

---

### 1. Newsletter / “Join Us! Subscribe to our weekly newsletter…”

- **Page / Area**: Footer (all pages)
- **What was hidden**: Top newsletter strip (`FooterTop`) that showed “Join Us!” and subscription content.
- **How it’s hidden**:
  - File: `src/components/footer/index.js`
  - Change: The `<FooterTop landingPageData={landingPageData} />` line is commented out.
- **How to re‑enable**:
  - Uncomment the `FooterTop` line in `footer/index.js`.

---

### 2. Seller app download banner (“Start Selling with Gift Marketplace Seller”)

- **Page / Area**: Landing Page (`/`) – seller app download block
- **What was hidden**: Card that promotes the seller/vendor app with QR code and app buttons.
- **How it’s hidden**:
  - File: `src/components/landing-page/index.js`
  - Change: The block that renders `<Registration … />` inside the `seller_app_download_section` check is commented out.
- **How to re‑enable**:
  - Uncomment the `Registration` block in `landing-page/index.js`.

---

### 3. Delivery man app download banner (“Deliver More. Earn More.”)

- **Page / Area**: Landing Page (`/`) – delivery partner app section
- **What was hidden**: Card inviting delivery partners to join and download the driver app.
- **How it’s hidden**:
  - File: `src/components/landing-page/index.js`
  - Change: The block that renders `<DeliveryManAppDownload … />` inside the `deliveryman_app_download_section` check is commented out.
- **How to re‑enable**:
  - Uncomment the `DeliveryManAppDownload` block in `landing-page/index.js`.

---

### 4. Popular clients section (“Our Popular Clients / Trusted by leading brands…”)

- **Page / Area**: Landing Page (`/`) – popular clients carousel
- **What was hidden**: Section showing “Our Popular Clients” with brand logos.
- **How it’s hidden**:
  - File: `src/components/landing-page/index.js`
  - Change: The block that renders `<ClientSection popular_client_section={landingPageData?.popular_client_section} />` is commented out.
- **How to re‑enable**:
  - Uncomment the `ClientSection` block in `landing-page/index.js`.

---

### 5. Highlight banner (“Ride Anytime, Anywhere”)

- **Page / Area**: Landing Page (`/`) – highlight banner above FAQ
- **What was hidden**: Gradient banner with title “Ride Anytime, Anywhere” and rental marketing copy.
- **How it’s hidden**:
  - File: `src/components/landing-page/index.js`
  - Change: The block that renders `<ImageTitleSection highlight_section={landingPageData?.highlight_section} />` is commented out.
- **How to re‑enable**:
  - Uncomment the `ImageTitleSection` block in `landing-page/index.js`.

---

### 6. Rental home CTA (“Ride Anytime, Anywhere” – rental module)

- **Page / Area**: Rental module home (`/home` when module type = `rental`)
- **What was hidden**: Rental download / registration CTA section that promotes rental app and seller registration.
- **How it’s hidden**:
  1. **Usage removed from rental home**  
     - File: `src/components/home/module-wise-components/rental/Rental.js`  
     - Change: `<DownloadSection landingPageData={landingPageData} />` is commented out.
  2. **Component made no‑op (extra safety)**  
     - File: `src/components/home/module-wise-components/rental/components/home/DownloadSection.js`  
     - Change: `DownloadSection` now returns `null` immediately.
- **How to re‑enable**:
  - Restore the original `return (…);` JSX inside `DownloadSection`, and
  - Uncomment the `DownloadSection` usage in `Rental.js`.

---

### 7. Top navbar phone number

- **Page / Area**: Header top navbar (desktop)
- **What was hidden**: Admin/support phone number in the top-right utility row.
- **How it’s hidden**:
  - File: `src/components/header/top-navbar/TopNavBar.js`
  - Change: The conditional render `{configData?.phone && (<CallToAdmin configData={configData} />)}` is commented out.
- **How to re-enable**:
  - Uncomment the `CallToAdmin` line in `TopNavBar.js`.

---

### 8. FAQ contact helper text (“Still have questions?”)

- **Page / Area**: Landing Page (`/`) – FAQ section contact box
- **What was hidden**: The entire FAQ contact box (icon, helper text, and Contact Us button).
- **How it’s hidden**:
  - File: `src/components/landing-page/FaqTabSection.tsx`
  - Change: The full FAQ contact `<Stack>` block is commented out.
- **Spacing adjustment after hiding**:
  - Files: `src/components/landing-page/FaqTabSection.tsx`, `src/components/landing-page/index.js`, `src/components/footer/index.js`
  - Change: Reduced FAQ bottom padding, removed the extra spacer below FAQ, and lowered landing-page footer top margin on mobile so no blank gap remains.
- **How to re-enable**:
  - Uncomment the FAQ contact `<Stack>` block in `FaqTabSection.tsx`.

---

### 9. Hero search bar filter badge chips ("All", "Fresh", "Popular", "Offers" etc.)

- **Page / Area**: Home page (`/home`) – hero section, below the search bar
- **What was hidden**: Row of decorative filter chips shown below the search input (labels like "All", "Fresh", "Popular", "Offers" for Grocery; "Best Seller", "New Arrival", "Trending" for E-commerce, etc.). They were purely cosmetic — they did not trigger any filtering logic — so they were removed as useless clutter.
- **How it's hidden**:
  - File: `src/components/home/SearchWithTitle.js`
  - Change: The `{showLeftAlignedHero && (<Stack>…Chip map…</Stack>)}` block is replaced with a comment.
- **How to re-enable**:
  - Restore the `{showLeftAlignedHero && (<Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>{(filterChips[moduleType] || ["All"])?.map(…Chip…)}</Stack>)}` block in `SearchWithTitle.js`.



---

### 10. Home module hero strip (TopBanner + in-hero search)

- **Page / Area**: Main module preview on `/home`
- **What was hidden**:
  - Top hero banner strip (`TopBanner`)
  - Overlay hero search/title block (`SearchWithTitle`)
- **How it's hidden**:
  - File: `src/components/home/HomePageComponents.js`
  - Change: Removed the top hero wrapper that rendered `<TopBanner />` and the overlaid `<SearchWithTitle ... />`.
- **Replacement behavior**:
  - The same search functionality is moved to the desktop navbar via `ManageSearch`.
  - File: `src/components/header/second-navbar/SecondNavbar.js`
  - Change: Added `<ManageSearch ... />` beside nav links for non-parcel/non-rental modules.
- **How to re-enable old hero section**:
  - Restore the removed hero wrapper block in `HomePageComponents.js` and remove the navbar `ManageSearch` insertion from `SecondNavbar.js`.
