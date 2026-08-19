import toast from "react-hot-toast";
import { t } from "i18next";
import Router from "next/router";
import { clearUserSessionData } from "helper-functions/headerSessionSync";

// Format error messages: round off "X.XXXXXX Seconds" to whole seconds
const formatErrorMessage = (message) => {
  if (!message) return message;
  // Replace decimal seconds like "17.725816 Seconds" with rounded "18 seconds"
  return message.replace(
    /(\d+\.\d+)\s*[Ss]econds?/g,
    (_, secs) => `${Math.ceil(parseFloat(secs))} seconds`
  );
};

/** Laravel validation: { field: ["msg1", "msg2"] } → flat list of strings */
const flattenLaravelValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object" || Array.isArray(errors)) return [];
  return Object.values(errors)
    .flat()
    .filter((m) => typeof m === "string" && m.length > 0);
};

export const getApiErrorMessage = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const payload = data && typeof data === "object" && !Array.isArray(data) ? data : null;

  const fromArray =
    Array.isArray(payload?.errors) && payload.errors.length > 0
      ? payload.errors
          .map((item) =>
            typeof item === "string" ? item : item?.message || item?.error
          )
          .find((m) => typeof m === "string" && m.trim())
      : null;
  const fromObject = flattenLaravelValidationErrors(payload?.errors)[0];
  const fromMessage =
    typeof payload?.message === "string" && payload.message.trim()
      ? payload.message
      : typeof data === "string" && data.trim() && !data.trim().startsWith("<")
        ? data.trim()
        : null;

  const msg = fromArray || fromObject || fromMessage;
  if (msg) return formatErrorMessage(msg);

  if (status === 403) {
    return t("Please check the highlighted fields and try again.");
  }
  if (status === 401) {
    return t("You are not allowed to complete this action. Please try again.");
  }
  if (status === 422) {
    return t("Please check the form details and try again.");
  }
  if (status === 404) {
    return t("The requested resource was not found.");
  }
  if (status >= 500) {
    return t("Server error. Please try again later.");
  }
  if (error?.message && !String(error.message).startsWith("Request failed")) {
    return formatErrorMessage(error.message);
  }
  return t("Something went wrong. Please try again.");
};

export const handleTokenExpire = (item, status) => {
  if (status === 401) {
    if (typeof window !== "undefined" && window.localStorage.getItem("token")) {
      toast.error(t("Your account is inactive or Your token has been expired"));
      clearUserSessionData();
      Router.push("/home", undefined, { shallow: true });
    } else if (item?.message) {
      // Sign-in / guest: show API message (e.g. invalid credentials)
      toast.error(formatErrorMessage(item.message), {
        id: "error",
      });
    }
  } else {
    toast.error(formatErrorMessage(item?.message), {
      id: "error",
    });
  }
};

export const onErrorResponse = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = getApiErrorMessage(error);

  if (status === 401 && typeof window !== "undefined" && window.localStorage.getItem("token")) {
    handleTokenExpire({ message }, 401);
    return;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    let shown = false;
    data.errors.forEach((item, index) => {
      const text =
        typeof item === "string"
          ? item
          : item?.message || item?.error;
      if (typeof text === "string" && text.trim()) {
        shown = true;
        toast.error(formatErrorMessage(text), {
          id: `error-${item?.code || index}-${text.slice(0, 24)}`,
        });
      }
    });
    if (shown) return;
  }

  toast.error(message, { id: "error" });
};
export const onSingleErrorResponse = (error) => {
  const status = error?.response?.status;
  const msg = getApiErrorMessage(error);

  if (status === 401 && typeof window !== "undefined" && window.localStorage.getItem("token")) {
    handleTokenExpire({ message: msg }, 401);
    return;
  }
  toast.error(msg, { id: "error" });
};
