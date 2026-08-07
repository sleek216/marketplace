import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageBootLoader from "../PageBootLoader";

const ZoneGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    try {
      // Simply allow the page to render regardless of location state.
      // The header "Select Location" prompt will guide the user to set their location.
      setChecked(true);
    } catch {
      setChecked(true);
    }
  }, [router.isReady]);

  if (!checked) {
    return <PageBootLoader message="Loading..." />;
  }

  return <>{children}</>;
};

export default ZoneGuard;
