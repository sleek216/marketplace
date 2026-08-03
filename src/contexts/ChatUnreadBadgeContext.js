import React, { createContext, useContext, useEffect, useState } from "react";
import useChatUnreadBadge from "hooks/useChatUnreadBadge";
import useCustomerProfileSync from "hooks/useCustomerProfileSync";
import { HEADER_SESSION_SYNC_EVENT } from "helper-functions/headerSessionSync";
import { hasValidAuthToken } from "helper-functions/getToken";

const ChatUnreadBadgeContext = createContext(null);

export function ChatUnreadBadgeProvider({ children }) {
  const [token, setToken] = useState(null);
  useCustomerProfileSync();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      const stored = localStorage.getItem("token");
      setToken(hasValidAuthToken(stored) ? stored : null);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(HEADER_SESSION_SYNC_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(HEADER_SESSION_SYNC_EVENT, sync);
    };
  }, []);

  const value = useChatUnreadBadge(token);

  return (
    <ChatUnreadBadgeContext.Provider value={value}>
      {children}
    </ChatUnreadBadgeContext.Provider>
  );
}

export function useChatUnreadBadgeContext() {
  return useContext(ChatUnreadBadgeContext);
}
