import "../src/styles/globals.css";
import "../src/styles/nprogress.css";
import { CacheProvider, ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import { Provider as ReduxProvider } from "react-redux";
import createEmotionCache from "../src/utils/create-emotion-cache";
import { store } from "redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "theme";
import dynamic from "next/dynamic";

import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import { RTL } from "components/rtl";
import AppToaster from "../src/components/AppToaster";
import { getServerSideProps } from "./index";
import { SettingsConsumer, SettingsProvider } from "contexts/settings-context";
import { ChatUnreadBadgeProvider } from "contexts/ChatUnreadBadgeContext";
import "../src/language/i18n";
import i18n, { loadLanguageBundle } from "../src/language/i18n";
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
import RouteTransition from "../src/components/page-skeleton/RouteTransition";

const GlobalPushNotificationListener = dynamic(
  () => import("components/GlobalPushNotificationListener"),
  { ssr: false }
);

const AnalyticsScripts = dynamic(
  () => import("../src/components/AnalyticsScripts"),
  { ssr: false }
);

const SocialAuthScripts = dynamic(
  () => import("../src/components/SocialAuthScripts"),
  { ssr: false }
);

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);


export const currentVersion = process.env.NEXT_PUBLIC_SITE_VERSION;
const clientSideEmotionCache = createEmotionCache();
const persistor = persistStore(store);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 15, // 15 minutes cache memory
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data
      refetchOnWindowFocus: false, // Prevents tab-switch lag
      refetchOnMount: false, // Instant cached rendering on mount
      retry: 1, // Minimize network retry latency
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

  // Version check + lazy-load stored language bundle
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedLanguage = JSON.parse(
        localStorage.getItem("language-setting") || "null"
      );
      if (storedLanguage && storedLanguage !== "en") {
        loadLanguageBundle(storedLanguage).then((lng) => {
          if (lng && lng !== i18n.language) {
            i18n.changeLanguage(lng);
          }
        });
      }
    } catch {
      // ignore invalid localStorage
    }

    if (currentVersion) {
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
      <AnalyticsScripts />
      <SocialAuthScripts />
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
                                <RouteTransition>
                                  {getLayout(<Component {...pageProps} />)}
                                </RouteTransition>
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
