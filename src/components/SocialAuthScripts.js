import Script from "next/script";

/** Social login SDKs — lazy load so they don't block initial page render. */
export default function SocialAuthScripts() {
  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
      />
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="lazyOnload"
      />
    </>
  );
}
