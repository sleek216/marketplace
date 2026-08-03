import { useEffect, useState } from "react";
import { HEADER_SESSION_SYNC_EVENT } from "./headerSessionSync";

export const readStoredLocation = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("location");
};

/**
 * Keeps header location in sync with localStorage + HEADER_SESSION_SYNC_EVENT.
 */
export default function useHeaderLocation(externalLocation) {
  const [location, setLocation] = useState(
    externalLocation ?? readStoredLocation()
  );

  useEffect(() => {
    const sync = () => {
      setLocation(readStoredLocation());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(HEADER_SESSION_SYNC_EVENT, sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(HEADER_SESSION_SYNC_EVENT, sync);
    };
  }, []);

  useEffect(() => {
    if (externalLocation !== undefined) {
      setLocation(externalLocation);
    }
  }, [externalLocation]);

  return location;
};
