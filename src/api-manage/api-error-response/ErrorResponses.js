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

  if (data?.errors?.length > 0) {
    // Standard GiftMarketplace errors array format
    data.errors.forEach((item) => {
      handleTokenExpire(item, status);
    });
  } else if (
    data?.errors &&
    typeof data.errors === "object" &&
    !Array.isArray(data.errors)
  ) {
    // Laravel validation object (no top-level message)
    const messages = flattenLaravelValidationErrors(data.errors);
    if (messages.length > 0) {
      messages.forEach((msg) => {
        if (status === 401) {
          handleTokenExpire({ message: msg }, 401);
        } else {
          toast.error(formatErrorMessage(msg), { id: "error" });
        }
      });
    } else if (data?.message) {
      if (status === 401) {
        handleTokenExpire({ message: data.message }, 401);
      } else {
        toast.error(formatErrorMessage(data.message), { id: "error" });
      }
    }
  } else if (data?.message) {
    // Laravel generic error with a message field
    if (status === 401) {
      handleTokenExpire({ message: data.message }, 401);
    } else {
      toast.error(formatErrorMessage(data.message), { id: "error" });
    }
  } else if (status === 403) {
    toast.error(
      t("Access denied. Please check your account settings or contact support."),
      { id: "error" }
    );
  } else if (status === 404) {
    toast.error(t("The requested resource was not found."), { id: "error" });
  } else if (status === 500) {
    toast.error(t("Server error. Please try again later."), { id: "error" });
  } else if (status) {
    toast.error(t("Something went wrong. Please try again."), { id: "error" });
  }
};
export const onSingleErrorResponse = (error) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const msg =
    data?.message ||
    flattenLaravelValidationErrors(data?.errors)[0] ||
    error?.message;

  // Expired session: redirect + single toast (do not also show API message)
  if (status === 401 && typeof window !== "undefined" && window.localStorage.getItem("token")) {
    handleTokenExpire({ message: msg }, 401);
    return;
  }
  if (msg) {
    toast.error(formatErrorMessage(msg), {
      id: "error",
    });
    return;
  }
  if (status === 401) {
    handleTokenExpire({ message: null }, 401);
  }
};
