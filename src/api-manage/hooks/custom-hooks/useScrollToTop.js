import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  disableBrowserScrollRestoration,
  instantScrollToTop,
} from "helper-functions/scrollToTop";

const useScrollToTop = () => {
  const router = useRouter();

  useEffect(() => {
    disableBrowserScrollRestoration();
    instantScrollToTop();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      instantScrollToTop();
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);
};

export default useScrollToTop;
