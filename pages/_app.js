import "../src/styles/globals.css";
import "../src/styles/nprogress.css";
import { CacheProvider, ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { Provider as ReduxProvider } from "react-redux";
import createEmotionCache from "../src/utils/create-emotion-cache";
import { store } from "redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "theme";

import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { RTL } from "components/rtl";
import AppToaster from "../src/components/AppToaster";
import { getServerSideProps } from "./index";
import { SettingsConsumer, SettingsProvider } from "contexts/settings-context";
import { ChatUnreadBadgeProvider } from "contexts/ChatUnreadBadgeContext";
import GlobalPushNotificationListener from "components/GlobalPushNotificationListener";
import "../src/language/i18n";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import nProgress from "nprogress";
import Router from "next/router";
import { persistStore } from "redux-persist";
import { useTranslation } from "react-i18next";
import useScrollToTop from "../src/api-manage/hooks/custom-hooks/useScrollToTop";
import PullToRefresh from "../src/components/pull-to-refresh/PullToRefresh";
import ErrorBoundary from "../src/components/error-boundary/ErrorBoundary";
import React, { useEffect } from "react";

// Universal React Hook Shield: In React 19, if a legacy library or hook returns a non-function (like a Promise, Object, null, or boolean) from useEffect/useLayoutEffect,
// React stores it as effect.destroy and crashes with 'destroy is not a function' during commitHookEffectListUnmount.
// We intercept all effect callbacks so they NEVER return a non-function!
if (typeof React !== "undefined") {
  const origUseEffect = React.useEffect;
  const origUseLayoutEffect = React.useLayoutEffect;
  const wrapEffect = (orig) => {
    if (!orig || orig._isWrapped) return orig;
    const wrapped = function (callback, deps) {
      return orig(() => {
        const res = callback();
        return typeof res === "function" ? res : undefined;
      }, deps);
    };
    wrapped._isWrapped = true;
    return wrapped;
  };
  React.useEffect = wrapEffect(origUseEffect);
  React.useLayoutEffect = wrapEffect(origUseLayoutEffect);
}

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

// Bulletproof Shield: Prevent React 19 / Fast Refresh unmount conflicts where legacy libraries set `.destroy = null` and call it again
if (typeof window !== "undefined") {
  const noop = function () {};
  const shieldProperty = (target, prop) => {
    try {
      Object.defineProperty(target, prop, {
        get() {
          return noop;
        },
        set(val) {
          try {
            let currentVal = typeof val === "function" ? val : noop;
            Object.defineProperty(this, prop, {
              get() {
                return typeof currentVal === "function" ? currentVal : noop;
              },
              set(newVal) {
                if (typeof newVal === "function") {
                  currentVal = newVal;
                } else {
                  currentVal = noop;
                }
              },
              configurable: true,
              enumerable: false,
            });
          } catch (e) {}
        },
        configurable: true,
        enumerable: false,
      });
    } catch (e) {}
  };
  ["destroy", "dispose", "cleanup"].forEach((prop) => {
    shieldProperty(Object.prototype, prop);
    shieldProperty(window, prop);
  });
}

export const currentVersion = process.env.NEXT_PUBLIC_SITE_VERSION;
const clientSideEmotionCache = createEmotionCache();
const persistor = persistStore(store);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

function MyApp(props) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const { t } = useTranslation();

  // Version check
  useEffect(() => {
    if (currentVersion && typeof window !== "undefined") {
      const storedVersion = localStorage.getItem("appVersion");
      if (storedVersion && storedVersion !== currentVersion) {
        const token = localStorage.getItem("token");
        const guestId = localStorage.getItem("guest_id");
        const zoneId = localStorage.getItem("zoneid");
        const lang = localStorage.getItem("language-setting");

        localStorage.clear();

        if (token) localStorage.setItem("token", token);
        if (guestId) localStorage.setItem("guest_id", guestId);
        if (zoneId) localStorage.setItem("zoneid", zoneId);
        if (lang) localStorage.setItem("language-setting", lang);
        localStorage.setItem("appVersion", currentVersion);
      } else if (!storedVersion) {
        localStorage.setItem("appVersion", currentVersion);
      }
    }
  }, [currentVersion]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {useScrollToTop()}
      <CacheProvider value={emotionCache}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={store}>
            <SettingsProvider>
              <SettingsConsumer>
                {(value) => {
                  const theme = createTheme({
                    direction: value?.settings?.direction,
                    responsiveFontSizes: value?.settings?.responsiveFontSizes,
                    mode: value?.settings?.theme,
                  });
                  return (
                    <ThemeProvider theme={theme}>
                      <EmotionThemeProvider theme={theme}>
                        <RTL direction={value?.settings?.direction}>
                          <CssBaseline />
                          <AppToaster />
                          <ChatUnreadBadgeProvider>
                            <GlobalPushNotificationListener />
                            <PullToRefresh>
                              <ErrorBoundary>
                                {getLayout(<Component {...pageProps} />)}
                              </ErrorBoundary>
                            </PullToRefresh>
                          </ChatUnreadBadgeProvider>
                        </RTL>
                      </EmotionThemeProvider>
                    </ThemeProvider>
                  );
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </ReduxProvider>
          {process.env.NODE_ENV === "development" ? (
            <ReactQueryDevtools
              initialIsOpen={false}
              position="bottom-right"
            />
          ) : null}
        </QueryClientProvider>
      </CacheProvider>
    </>
  );
}

export default MyApp;
export { getServerSideProps };
