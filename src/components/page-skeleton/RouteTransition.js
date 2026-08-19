import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  disableBrowserScrollRestoration,
  instantScrollToTop,
} from "helper-functions/scrollToTop";

const RouteTransition = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    disableBrowserScrollRestoration();
    instantScrollToTop();

    const onStart = (_, { shallow } = {}) => {
      if (shallow) return;
      instantScrollToTop();
    };
    const onDone = () => {
      instantScrollToTop();
    };

    router.events.on("routeChangeStart", onStart);
    router.events.on("routeChangeComplete", onDone);
    router.events.on("routeChangeError", onDone);
    return () => {
      router.events.off("routeChangeStart", onStart);
      router.events.off("routeChangeComplete", onDone);
      router.events.off("routeChangeError", onDone);
    };
  }, [router.events]);

  return children;
};

export default RouteTransition;
