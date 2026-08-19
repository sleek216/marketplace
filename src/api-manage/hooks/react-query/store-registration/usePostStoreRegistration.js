import { useMutation } from "react-query";
import { store_registration } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import dayjs from "dayjs";
import { formatPhoneNumberForApi } from "utils/CustomFunctions";
import { resolveStoreLatLng } from "components/store-resgistration/helper";
import {
  deserializeStoreRegistrationDraft,
  loadStoreRegistrationDraft,
  storedToFile,
} from "helper-functions/storeRegistrationDraft";

const toFile = (value) => {
  const file = storedToFile(value);
  return file instanceof Blob ? file : null;
};

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const firstFilled = (obj) => {
  if (!isPlainObject(obj)) return "";
  const en = String(obj.en || "").trim();
  if (en) return en;
  const found = Object.values(obj).find((v) => String(v || "").trim());
  return found ? String(found).trim() : "";
};

const buildTranslations = (storeData) => {
  const names = isPlainObject(storeData?.restaurant_name)
    ? storeData.restaurant_name
    : {};
  const addresses = isPlainObject(storeData?.restaurant_address)
    ? storeData.restaurant_address
    : {};
  const fallbackName = firstFilled(names);
  const fallbackAddress = firstFilled(addresses);
  const locales = new Set(["en", ...Object.keys(names), ...Object.keys(addresses)]);
  const translationsR = [];

  locales.forEach((locale) => {
    const name =
      String(names[locale] || "").trim() || (locale === "en" ? fallbackName : "");
    const address =
      String(addresses[locale] || "").trim() ||
      (locale === "en" ? fallbackAddress : "");
    if (name) {
      translationsR.push({ id: null, locale, key: "name", value: name });
    }
    if (address) {
      translationsR.push({ id: null, locale, key: "address", value: address });
      translationsR.push({
        id: null,
        locale,
        key: "description",
        value: address,
      });
    }
  });

  return JSON.stringify(translationsR);
};

const appendFormValue = (formData, key, value) => {
  if (value === undefined || value === null || value === "") return;
  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value, value.name || key);
    return;
  }
  formData.append(key, String(value));
};

const normalizeDeliveryTimeType = (value) => {
  const raw = String(value || "").toLowerCase();
  if (raw === "hour" || raw === "hours") return "hour";
  if (raw === "day" || raw === "days") return "day";
  return "minute";
};

const throwValidation = (errors) => {
  const error = new Error(errors[0]?.message || "Validation failed");
  error.response = {
    status: 403,
    data: { errors },
  };
  throw error;
};

const mergeWithDraft = async (storeData) => {
  let restored = null;
  try {
    restored = deserializeStoreRegistrationDraft(
      await loadStoreRegistrationDraft()
    );
  } catch {
    restored = null;
  }
  if (!restored) return storeData || {};
  return {
    ...restored,
    ...storeData,
    logo: toFile(storeData?.logo) || toFile(restored.logo) || storeData?.logo,
    cover_photo:
      toFile(storeData?.cover_photo) ||
      toFile(restored.cover_photo) ||
      storeData?.cover_photo,
    tin_certificate_image:
      toFile(storeData?.tin_certificate_image) ||
      toFile(restored.tin_certificate_image) ||
      storeData?.tin_certificate_image,
    restaurant_name: firstFilled(storeData?.restaurant_name)
      ? storeData.restaurant_name
      : restored.restaurant_name,
    restaurant_address: firstFilled(storeData?.restaurant_address)
      ? storeData.restaurant_address
      : restored.restaurant_address,
  };
};

const postData = async (storeData) => {
  const data = await mergeWithDraft(storeData);
  const plan = data?.value?.business_plan || data?.business_plan;
  const packageId = data?.value?.package_id ?? data?.package_id;
  const logo = toFile(data?.logo);
  const coverPhoto = toFile(data?.cover_photo);
  const tinCertificate = toFile(data?.tin_certificate_image);
  const translations = buildTranslations(data);
  const fName = String(data?.f_name || "").trim();
  const phone = formatPhoneNumberForApi(data?.phone);
  const email = String(data?.email || "").trim();
  const password = data?.password;
  const rawZoneId = data?.zoneId ?? data?.zone_id;
  const zoneId =
    rawZoneId == null || String(rawZoneId) === "null" || rawZoneId === ""
      ? ""
      : rawZoneId;
  const moduleId = data?.module_id;
  const { lat: latitude, lng: longitude } = resolveStoreLatLng(
    data?.lat ?? data?.latitude,
    data?.lng ?? data?.longitude
  );
  const englishName = firstFilled(data?.restaurant_name);
  const englishAddress = firstFilled(data?.restaurant_address);

  const missing = [];
  if (!logo) {
    missing.push({ code: "logo", message: "The logo field is required." });
  }
  if (!coverPhoto) {
    missing.push({
      code: "cover_photo",
      message: "The cover photo field is required.",
    });
  }
  if (!fName) missing.push({ code: "f_name", message: "The f_name field is required." });
  if (!phone) missing.push({ code: "phone", message: "The phone field is required." });
  if (!email) missing.push({ code: "email", message: "The email field is required." });
  if (!password) {
    missing.push({ code: "password", message: "The password field is required." });
  }
  if (zoneId == null || zoneId === "") {
    missing.push({ code: "zone_id", message: "The zone_id field is required." });
  }
  if (moduleId == null || moduleId === "") {
    missing.push({ code: "module_id", message: "The module_id field is required." });
  }
  if (latitude == null || latitude === "") {
    missing.push({ code: "latitude", message: "The latitude field is required." });
  }
  if (longitude == null || longitude === "") {
    missing.push({ code: "longitude", message: "The longitude field is required." });
  }
  if (!englishName) {
    missing.push({
      code: "translations",
      message: "English store name is required.",
    });
  }
  if (!englishAddress) {
    missing.push({
      code: "translations",
      message: "English store address/description is required.",
    });
  }
  if (missing.length > 0) throwValidation(missing);

  const formData = new FormData();
  formData.append("translations", translations);
  appendFormValue(formData, "name", englishName);
  appendFormValue(formData, "address", englishAddress);
  appendFormValue(formData, "minimum_delivery_time", data?.min_delivery_time || "15");
  appendFormValue(formData, "maximum_delivery_time", data?.max_delivery_time || "45");
  appendFormValue(formData, "latitude", latitude);
  appendFormValue(formData, "longitude", longitude);
  appendFormValue(formData, "f_name", fName);
  appendFormValue(formData, "l_name", data?.l_name);
  appendFormValue(formData, "phone", phone);
  appendFormValue(formData, "email", email);
  appendFormValue(formData, "password", password);
  appendFormValue(formData, "zone_id", zoneId);
  appendFormValue(formData, "module_id", moduleId);
  appendFormValue(
    formData,
    "delivery_time_type",
    normalizeDeliveryTimeType(data?.delivery_time_type)
  );
  appendFormValue(formData, "business_plan", plan);
  if (plan === "subscription" && packageId != null && packageId !== "") {
    appendFormValue(formData, "package_id", packageId);
  }
  formData.append("logo", logo, logo.name || "logo.png");
  formData.append("cover_photo", coverPhoto, coverPhoto.name || "cover.png");

  if (Array.isArray(data?.pickup_zone_id) && data.pickup_zone_id.length > 0) {
    appendFormValue(
      formData,
      "pickup_zone_id",
      JSON.stringify(data.pickup_zone_id.map(String))
    );
  }

  if (data?.tin) appendFormValue(formData, "tin", data.tin);
  if (data?.tin_expire_date) {
    appendFormValue(
      formData,
      "tin_expire_date",
      dayjs(data.tin_expire_date).format("YYYY-MM-DD")
    );
  }
  if (tinCertificate) {
    formData.append(
      "tin_certificate_image",
      tinCertificate,
      tinCertificate.name || "tin-certificate"
    );
  }

  const { data: responseData } = await MainApi.post(
    `${store_registration}`,
    formData,
    {
      omitAuth: true,
      omitGeo: false,
      moduleIdOverride: moduleId,
      zoneIdOverride: zoneId,
      latLngOverride: {
        lat: latitude,
        lng: longitude,
      },
    }
  );
  return responseData;
};

export const usePostStoreRegistration = () => {
  return useMutation("store-reg", postData);
};
