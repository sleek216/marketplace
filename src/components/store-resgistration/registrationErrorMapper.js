/** Backend API keys → Formik field names on General Information (step 0). */
const API_TO_FORMIK_FIELD = {
  logo: "logo",
  cover_photo: "cover_photo",
  email: "email",
  phone: "phone",
  f_name: "f_name",
  l_name: "l_name",
  password: "password",
  confirm_password: "confirm_password",
  zone_id: "zoneId",
  module_id: "module_id",
  minimum_delivery_time: "min_delivery_time",
  maximum_delivery_time: "max_delivery_time",
  delivery_time_type: "delivery_time_type",
  latitude: "lat",
  longitude: "lng",
  tin: "tin",
  tin_expire_date: "tin_expire_date",
  tin_certificate_image: "tin_certificate_image",
  pickup_zone_id: "pickup_zone_id",
  translations: "restaurant_name",
  name: "restaurant_name",
  address: "restaurant_address",
  restaurant_name: "restaurant_name",
  restaurant_address: "restaurant_address",
};

const STEP_0_FORMIK_FIELDS = new Set(Object.values(API_TO_FORMIK_FIELD));

const extractRawFieldErrors = (data) => {
  const errors = data?.errors;
  if (!errors) return {};

  if (Array.isArray(errors)) {
    const result = {};
    errors.forEach((item) => {
      const key = item?.code || item?.field || item?.key;
      const msg = item?.message;
      if (key && typeof msg === "string" && msg) {
        result[key] = msg;
      }
    });
    return result;
  }

  if (typeof errors === "object") {
    const result = {};
    Object.entries(errors).forEach(([key, val]) => {
      const msg = Array.isArray(val) ? val[0] : val;
      if (typeof msg === "string" && msg) {
        result[key] = msg;
      }
    });
    return result;
  }

  return {};
};

/**
 * Splits registration API validation errors into step-0 (inline) vs later-step (alert) buckets.
 */
export const parseRegistrationApiErrors = (error) => {
  const data = error?.response?.data;
  const raw = extractRawFieldErrors(data);
  const step0Errors = {};
  const otherErrors = {};

  Object.entries(raw).forEach(([apiKey, message]) => {
    const formKey = API_TO_FORMIK_FIELD[apiKey] || apiKey;
    if (STEP_0_FORMIK_FIELDS.has(formKey)) {
      step0Errors[formKey] = message;
    } else {
      otherErrors[formKey] = message;
    }
  });

  const firstOtherMessage =
    Object.values(otherErrors)[0] ||
    (typeof data?.message === "string" ? data.message : null);

  return { step0Errors, otherErrors, firstOtherMessage };
};

/** DOM id to scroll to when a step-0 field has an error. */
export const getScrollTargetForFieldErrors = (fieldErrors) => {
  if (!fieldErrors) return null;
  if (fieldErrors.logo) return "store-reg-logo";
  if (fieldErrors.cover_photo) return "store-reg-cover-photo";
  if (fieldErrors.email) return "seller-email";
  if (fieldErrors.restaurant_name || fieldErrors.restaurant_address) {
    return "store-reg-general-info";
  }
  return "store-reg-general-info";
};
