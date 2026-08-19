import { AppBarStyle } from "./NavBar.style";
import { useEffect, useRef, useState } from "react";

import {
  Card,
  NoSsr,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import SecondNavBar from "./second-navbar/SecondNavbar";
import TopNavBar from "./top-navbar/TopNavBar";
import {
  HEADER_SESSION_SYNC_EVENT,
} from "helper-functions/headerSessionSync";

const HeaderComponent = () => {
  const { configData } = useSelector((state) => state.configData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  /** Matches TopNavBar utility-bar breakpoint (desktop only hides top strip) */
  const isDesktopHeader = useMediaQuery("(min-width:1181px)");
  const scrolling = useScrollTrigger({ threshold: 8 });
  const topNavRef = useRef(null);
  const [topNavHeight, setTopNavHeight] = useState(0);
  const [headerSession, setHeaderSession] = useState({
    location: undefined,
    token: undefined,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncHeaderSession = () => {
      const nextLocation = localStorage.getItem("location");
      const nextToken = localStorage.getItem("token");

      setHeaderSession((prev) => {
        if (prev.location === nextLocation && prev.token === nextToken) {
          return prev;
        }
        return { location: nextLocation, token: nextToken };
      });
    };

    syncHeaderSession();
    window.addEventListener("storage", syncHeaderSession);
    window.addEventListener(HEADER_SESSION_SYNC_EVENT, syncHeaderSession);

    return () => {
      window.removeEventListener("storage", syncHeaderSession);
      window.removeEventListener(HEADER_SESSION_SYNC_EVENT, syncHeaderSession);
    };
  }, []);

  useEffect(() => {
    const el = topNavRef.current;
    if (!el || !isDesktopHeader) {
      setTopNavHeight(0);
      return;
    }

    const updateHeight = () => {
      setTopNavHeight(Math.ceil(el.getBoundingClientRect().height) || 0);
    };

    updateHeight();
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateHeight)
      : null;
    ro?.observe(el);
    window.addEventListener("resize", updateHeight);

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isDesktopHeader, headerSession.location]);

  return (
    <AppBarStyle
      scrolling={scrolling}
      isMobile={isMobile}
      isTablet={isTablet}
      topNavHeight={isDesktopHeader ? topNavHeight : 0}
    >
      <Box>
        <NoSsr>
          <Card
            sx={{
              boxShadow: "none",
              overflow: "visible",
              backgroundImage: "none",
            }}
          >
            <Box ref={topNavRef}>
              <TopNavBar
                configData={configData}
                location={headerSession.location}
              />
            </Box>
          </Card>
          <SecondNavBar
            configData={configData}
            location={headerSession.location}
          />
        </NoSsr>
      </Box>
    </AppBarStyle>
  );
};

export default HeaderComponent;
