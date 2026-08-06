import { useEffect } from "react";

const ANALYTICS_HEADERS = {
  "X-software-id": "33571750",
  "X-server": "server",
  origin:
    process.env.NEXT_CLIENT_HOST_URL ||
    process.env.NEXT_PUBLIC_CLIENT_HOST_URL ||
    "http://localhost:3000",
};

function appendScript(html) {
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const node = template.content.firstChild;
  if (node) document.head.appendChild(node);
}

function injectAnalyticsScripts(analyticsConfig) {
  if (analyticsConfig.google_tag_manager) {
    appendScript(`
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${analyticsConfig.google_tag_manager}');
    `);
  }

  if (analyticsConfig.google_analytics) {
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.google_analytics}`;
    document.head.appendChild(ga);
    appendScript(`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config','${analyticsConfig.google_analytics}');
    `);
  }

  if (analyticsConfig.facebook_pixel) {
    appendScript(`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${analyticsConfig.facebook_pixel}');
      fbq('track','PageView');
    `);
  }
}

/** Loads analytics after first paint — avoids blocking document SSR. */
export default function AnalyticsScripts() {
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/v1/config/get-analytic-scripts", {
          headers: ANALYTICS_HEADERS,
        });
        if (!res.ok || cancelled) return;

        const data = await res.json();
        if (!Array.isArray(data) || cancelled) return;

        const analyticsConfig = {};
        data.forEach((item) => {
          if (item.type && item.script_id) {
            analyticsConfig[item.type] = item.script_id;
          }
        });

        if (Object.keys(analyticsConfig).length > 0) {
          injectAnalyticsScripts(analyticsConfig);
        }
      } catch {
        // Non-critical — skip silently
      }
    };

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback
        : (cb) => window.setTimeout(cb, 2500);

    const idleId = schedule(load);

    return () => {
      cancelled = true;
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);

  return null;
}
