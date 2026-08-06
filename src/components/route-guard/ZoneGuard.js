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
      const zoneId = JSON.parse(localStorage.getItem("zoneid") || "null");
      const location = localStorage.getItem("location");
      if (zoneId?.length > 0 && location) {
        setChecked(true);
      } else {
        router.push("/", undefined, { shallow: true });
      }
    } catch {
      router.push("/", undefined, { shallow: true });
    }
  }, [router.isReady]);

  if (!checked) {
    return <PageBootLoader message="Checking your location..." />;
  }

  return <>{children}</>;
};

export default ZoneGuard;
