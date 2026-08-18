import React, { useEffect, useMemo, useRef, useState } from "react";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useVendorCheckContact } from "api-manage/hooks/react-query/store-registration/useVendorCheckContact";
import {
  CustomButton,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import {
  alpha,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomDivider from "components/CustomDivider";
import RestaurantDetailsForm, {
  checkTaxiModule,
} from "components/store-resgistration/RestaurantDetailsForm";
import ValidationSchemaForRestaurant from "components/store-resgistration/ValidationSchemaForRestaurant";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import MapForRestaurantJoin from "components/store-resgistration/MapForRestaurantJoin";
import ImageSection from "components/store-resgistration/ImageSection";
import OwnerForm from "components/store-resgistration/OwnerForm";
import AccountInfo from "components/store-resgistration/AccountInfo";
import { useQuery } from "react-query";
import { GoogleApi } from "api-manage/hooks/react-query/googleApi";
import { useDispatch, useSelector } from "react-redux";
import { getZoneWiseModule } from "components/store-resgistration/helper";
import {
  setAllData,
  setFieldErrors,
  setInZone,
} from "redux/slices/storeRegistrationData";
import { getScrollTargetForFieldErrors } from "components/store-resgistration/registrationErrorMapper";
import { SaveButton } from "components/profile/basic-information/Profile.style";
import { useRouter } from "next/router";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import { toast } from "react-hot-toast";
import {
  formatPhoneNumber,
  formatPhoneNumberForApi,
} from "utils/CustomFunctions";
import useGetZoneList from "api-manage/hooks/react-query/zone-list/zone-list";
import { ActonButtonsSection } from "components/deliveryman-registration/CustomStylesDeliveryman";
import BusinessTin from "components/store-resgistration/BusinessTin";
import { shadows } from "@mui/system";

/** Maps vendor check-contact API reasons to user-facing copy (vendor/store scoped). */
function getVendorContactReasonMessage(reason, kind, t) {
  const isEmail = kind === "email";
  switch (reason) {
    case "active_store":
      return isEmail
        ? t("This email is already registered with an active store.")
        : t("This phone number is already registered with an active store.");
    case "pending_store":
      return isEmail
        ? t("This email is linked to a store application awaiting review.")
        : t("This phone number is linked to a store application awaiting review.");
    case "denied":
      return isEmail
        ? t("This email is linked to a denied store application.")
        : t("This phone number is linked to a denied store application.");
    default:
      return isEmail
        ? t("This email is already in use.")
        : t("This phone number is already in use.");
  }
}

export const generateInitialValues = (languages, allData) => {
  const initialValues = {
    restaurant_name: {},
    restaurant_address: {},
    min_delivery_time: allData?.min_delivery_time || "15",
    max_delivery_time: allData?.max_delivery_time || "45",
    logo: allData?.logo ? allData?.logo : "",
    cover_photo: allData?.cover_photo ? allData?.cover_photo : "",
    f_name: allData?.f_name || "",
    l_name: allData?.l_name || "",
    phone: allData?.phone || "",
    email: allData?.email || "",
    password: allData?.password || "",
    confirm_password: allData?.confirm_password || "",
    lat: allData?.lat || "",
    lng: allData?.lng || "",
    zoneId: allData?.zoneId || "",
    module_id: allData?.module_id || "",
    delivery_time_type: allData?.delivery_time_type || "min",
    pickup_zone_id: allData?.pickup_zone_id || "",
    tin: allData?.tin || "",
    tin_expire_date: allData?.tin_expire_date || "",
    tin_certificate_image: allData?.tin_certificate_image || "",
    tandc: allData?.tandc || false,
  };

  // Set initial values for each language
  languages?.forEach((lang) => {
    initialValues.restaurant_name[lang.key] =
      allData?.restaurant_name?.[lang.key] || "";
    initialValues.restaurant_address[lang.key] =
      allData?.restaurant_address?.[lang.key] || "";
  });

  return initialValues;
};

const StoreRegistrationForm = ({
  setActiveStep,
  setFormValues,
  clearRegistrationError,
}) => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modules, configData } = useSelector((state) => state.configData);
  const [polygonPaths, setPolygonPaths] = useState([]);
  const [showZoneWarning, setShowZoneWarning] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedDates, setSelectedDates] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState("en");
  const [selectedZone, setSelectedZone] = React.useState(null);
  const [externalLocation, setExternalLocation] = useState(null);
  const lastResolvedAddressRef = useRef(null);
  const { allData, activeStep, inZone, fieldErrors } = useSelector(
    (state) => state.storeRegData
  );
  const { data, refetch } = useGetModule();
  const initialValues = generateInitialValues(configData?.language, allData);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const isBottomMenu = useMediaQuery("(max-width: 1180px)");
  const { mutateAsync: checkVendorContact, isLoading: isCheckingContact } =
    useVendorCheckContact();

  const RestaurantJoinFormik = useFormik({
    initialValues,
    validationSchema: ValidationSchemaForRestaurant(),
    validationOptions: {
      abortEarly: false, // ✅ THIS IS THE KEY
    },
    onSubmit: async (values, helpers) => {
      try {
        if (!values?.tandc) return;
        if (checkTaxiModule(values?.module_id, moduleOption)) {
          if (values?.pickup_zone_id?.length === 0) {
            toast.error(t("Please select a pick up zone"));
            return;
          }
        }
        helpers.setSubmitting(true);
        try {
          await formSubmitOnSuccess(values);
        } finally {
          helpers.setSubmitting(false);
        }
      } catch (err) { }
    },
  });

  // Apply API validation errors returned from a later step (e.g. logo required).
  useEffect(() => {
    if (!fieldErrors || Object.keys(fieldErrors).length === 0) return;

    const touched = Object.keys(fieldErrors).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    RestaurantJoinFormik.setErrors(fieldErrors);
    RestaurantJoinFormik.setTouched(touched, false);
    dispatch(setFieldErrors(null));

    const scrollTarget = getScrollTargetForFieldErrors(fieldErrors);
    if (scrollTarget && typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document
          .getElementById(scrollTarget)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldErrors]);

  // Rehydrate NTN certificate UI when returning from another step.
  // The selected file is stored in redux-backed form values, but local state resets on unmount.
  useEffect(() => {
    const tinValue = RestaurantJoinFormik?.values?.tin_certificate_image;
    if (!file && tinValue) {
      setFile(tinValue);
      if (typeof window !== "undefined" && tinValue?.type?.startsWith?.("image/")) {
        try {
          const nextUrl = URL.createObjectURL(tinValue);
          setPreview(nextUrl);
        } catch (_) {
          // ignore
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RestaurantJoinFormik?.values?.tin_certificate_image]);

  // Cleanup preview object URL (avoid memory leaks)
  useEffect(() => {
    return () => {
      if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(preview);
        } catch (_) {
          // ignore
        }
      }
    };
  }, [preview]);
  let currentLatLng = undefined;
  if (typeof window !== "undefined") {
    currentLatLng = JSON.parse(window.localStorage.getItem("currentLatLng"));
  }
  const {
    data: zoneList,
    isLoading: zoneListLoading,

    refetch: zoneListRefetch,
  } = useGetZoneList();
  useEffect(() => {
    zoneListRefetch(); // Fetches data when the component mounts
  }, []);
  useEffect(() => {
    if (RestaurantJoinFormik?.values?.zoneId) {
      const filterZone = zoneList?.find(
        (item) => item?.id === RestaurantJoinFormik?.values?.zoneId
      );
      function convertGeoJSONToCoordinates(geoJSON) {
        const coords = geoJSON?.coordinates[0];
        return coords?.map((coord) => ({
          lat: coord[1],
          lng: coord[0],
        }));
      }
      const format = convertGeoJSONToCoordinates(filterZone?.coordinates);
      setPolygonPaths(format);
    }
  }, [RestaurantJoinFormik?.values?.zoneId, activeStep]);
  const formSubmitOnSuccess = async (values) => {
    clearRegistrationError?.();
    try {
      const res = await checkVendorContact({
        email: (values.email || "").trim(),
        phone: formatPhoneNumberForApi(values.phone),
      });
      if (!res?.email_available) {
        toast.error(
          getVendorContactReasonMessage(res?.email_reason, "email", t)
        );
        return;
      }
      if (!res?.phone_available) {
        toast.error(
          getVendorContactReasonMessage(res?.phone_reason, "phone", t)
        );
        return;
      }
    } catch (e) {
      onErrorResponse(e);
      return;
    }

    setFormValues(values);

    dispatch(setActiveStep(1));
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    dispatch(setAllData(values));

    //formSubmit(values)
  };

  const fNameHandler = (value) => {
    const sanitizedValue = (value || "").replace(/[^A-Za-z\s]/g, "");
    RestaurantJoinFormik.setFieldValue("f_name", sanitizedValue);
  };
  const restaurantNameHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("restaurant_name", {
      ...RestaurantJoinFormik.values.restaurant_name,
      [selectedLanguage]: value,
    });
  };
  const restaurantVatHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("vat", value);
  };
  const restaurantAddressHandler = (value) => {
    const nextValue = value == null ? "" : value;
    const updated = {
      ...(RestaurantJoinFormik.values.restaurant_address || {}),
    };
    const languages = configData?.language;
    if (languages?.length > 0) {
      languages.forEach((lang) => {
        updated[lang.key] = nextValue;
      });
    } else {
      updated[selectedLanguage] = nextValue;
    }
    RestaurantJoinFormik.setFieldValue("restaurant_address", updated);
  };

  // Make manual "Business Address" input behave like the map search:
  // convert typed address -> place details -> lat/lng,
  // then let `MapForRestaurantJoin` run zone validation using those coords.
  const onBusinessAddressBlur = async (value) => {
    const addressText = value?.toString?.().trim();
    if (!addressText) return;
    if (lastResolvedAddressRef.current === addressText) return;

    lastResolvedAddressRef.current = addressText;
    try {
      const placesAutoCompleteRes = await GoogleApi.placeApiAutocomplete(
        addressText
      );
      const firstPlaceId =
        placesAutoCompleteRes?.suggestions?.[0]?.placePrediction?.placeId;
      if (!firstPlaceId) return;

      const placeDetailsRes = await GoogleApi.placeApiDetails(firstPlaceId);
      const lat = placeDetailsRes?.location?.latitude;
      const lng = placeDetailsRes?.location?.longitude;

      if (typeof lat === "number" && typeof lng === "number") {
        setExternalLocation({ lat, lng });
      }
    } catch (e) {
      toast.error(t("Please pick the business location from the map."));
    }
  };
  const minDeliveryTimeHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("min_delivery_time", value);
  };
  const maxDeliveryTimeHandler = (value) => {
    if (RestaurantJoinFormik?.values?.min_delivery_time < value) {
      RestaurantJoinFormik.setFieldValue("max_delivery_time", value);
    } else
      toast.error(
        "Please enter max delivery time greater than min delivery time"
      );
  };
  const handleTimeTypeChangeHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("delivery_time_type", value);
  };
  const lNameHandler = (value) => {
    const sanitizedValue = (value || "").replace(/[^A-Za-z\s]/g, "");
    RestaurantJoinFormik.setFieldValue("l_name", sanitizedValue);
  };
  const tinNumberHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("tin", value);
  };

  useEffect(() => {
    if (selectedDates && selectedDates[0]) {
      const tempSelectedDates = new Date(selectedDates[0]);
      RestaurantJoinFormik.setFieldValue("tin_expire_date", tempSelectedDates);
    }
  }, [selectedDates]);
  const phoneHandler = (values) => {
    RestaurantJoinFormik.setFieldValue("phone", formatPhoneNumber(values));
  };
  const emailHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("email", value);
  };
  const passwordHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("password", value);
  };
  const confirmPasswordHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("confirm_password", value);
  };
  const applyValidImageField = async (fieldName, file) => {
    await RestaurantJoinFormik.setFieldValue(fieldName, file, false);
    RestaurantJoinFormik.setFieldError(fieldName, undefined);
    RestaurantJoinFormik.setFieldTouched(fieldName, true, false);
    await RestaurantJoinFormik.validateField(fieldName);
  };
  const singleFileUploadHandlerForImage = (value) => {
    const file = value?.currentTarget?.files?.[0];
    if (!file) return;
    if (file.size > 2097152) {
      toast.error(t("Image size must be less than 2MB"));
      return;
    }
    applyValidImageField("logo", file);
  };
  const imageOnchangeHandlerForImage = (value) => {
    if (!value) return;
    if (value.size > 2097152) {
      toast.error(t("Image size must be less than 2MB"));
      return;
    }
    applyValidImageField("logo", value);
  };
  const singleFileUploadHandlerForCoverPhoto = (value) => {
    const file = value?.currentTarget?.files?.[0];
    if (!file) return;
    if (file.size > 2097152) {
      toast.error(t("Image size must be less than 2MB"));
      return;
    }
    applyValidImageField("cover_photo", file);
  };
  const singleFileUploadHandlerForTinFile = (value) => {
    // const file = e.currentTarget.files[0];
    RestaurantJoinFormik.setFieldValue("tin_certificate_image", value);
    RestaurantJoinFormik.setFieldTouched("tin_certificate_image", true);
  };
  const imageOnchangeHandlerForTinImage = (value) => {
    RestaurantJoinFormik.setFieldValue("tin_certificate_image", value);
  };
  const imageOnchangeHandlerForCoverPhoto = (value) => {
    if (!value) return;
    if (value.size > 2097152) {
      toast.error(t("Image size must be less than 2MB"));
      return;
    }
    applyValidImageField("cover_photo", value);
  };
  const zoneHandler = (value) => {
    const currentZoneId = RestaurantJoinFormik.values.zoneId;
    RestaurantJoinFormik.setFieldValue("zoneId", value);

    if (String(value ?? "") !== String(currentZoneId ?? "")) {
      RestaurantJoinFormik.setFieldValue("module_id", "");
    }
  };
  const moduleHandler = (value) => {
    RestaurantJoinFormik.setFieldValue("module_id", value);
  };

  const pickupZoneHandler = (value) => {
    const pickupZoneId = value?.map((item) => item.value);
    RestaurantJoinFormik.setFieldValue("pickup_zone_id", pickupZoneId);
  };
  const handleLocation = (value) => {
    RestaurantJoinFormik.setFieldValue("lng", value?.lat);
    RestaurantJoinFormik.setFieldValue("lat", value?.lng);
  };
  /**
   * Form fields are swapped vs map coords (see handleLocation).
   * Empty strings became Number("") → 0 and broke the map with 0,0.
   */
  const savedMapLocation = useMemo(() => {
    const rawLngField = RestaurantJoinFormik?.values?.lng;
    const rawLatField = RestaurantJoinFormik?.values?.lat;
    if (
      rawLngField === "" ||
      rawLatField === "" ||
      rawLngField == null ||
      rawLatField == null
    ) {
      return undefined;
    }
    const mapLat = Number(rawLngField);
    const mapLng = Number(rawLatField);
    if (!Number.isFinite(mapLat) || !Number.isFinite(mapLng)) return undefined;
    if (mapLat === 0 && mapLng === 0) return undefined;
    return { lat: mapLat, lng: mapLng };
  }, [RestaurantJoinFormik?.values?.lng, RestaurantJoinFormik?.values?.lat]);

  const mapSeedLocation = useMemo(() => {
    if (savedMapLocation) return savedMapLocation;
    if (typeof window === "undefined") return undefined;
    try {
      const raw = window.localStorage.getItem("currentLatLng");
      if (!raw) return undefined;
      const stored = JSON.parse(raw);
      const lat = Number(stored?.lat);
      const lng = Number(stored?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
      if (lat === 0 && lng === 0) return undefined;
      return { lat, lng };
    } catch {
      return undefined;
    }
  }, [savedMapLocation]);

  const { data: zoneData } = useQuery(
    ["zoneId"],
    async () =>
      GoogleApi.getZoneId(currentLatLng ?? configData?.default_location),
    {
      retry: 1,
    }
  );

  useEffect(() => {
    if (
      RestaurantJoinFormik?.values?.min_delivery_time &&
      RestaurantJoinFormik?.values?.max_delivery_time
    ) {
      const timeout = setTimeout(() => {
        if (
          RestaurantJoinFormik.values.min_delivery_time >
          RestaurantJoinFormik.values.max_delivery_time
        ) {
          toast.error(
            "Minimum delivery time should be less than maximum delivery time"
          );
        }
      }, 500); // delay in milliseconds (e.g., 1000ms = 1 second)

      return () => clearTimeout(timeout); // cleanup timeout when dependencies change
    }
  }, [
    RestaurantJoinFormik?.values?.max_delivery_time,
    RestaurantJoinFormik?.values?.min_delivery_time,
  ]);

  let zoneOption = [];
  zoneList?.forEach((zone) => {
    let obj = {
      value: zone.id,
      label: zone.name,
    };
    zoneOption.push(obj);
  });

  let moduleOption = [];
  const zoneWiseModules = getZoneWiseModule(
    data,
    RestaurantJoinFormik?.values?.zoneId
  );

  if (zoneWiseModules?.length > 0) {
    zoneWiseModules.forEach((module) => {
      if (module.module_type !== "parcel") {
        moduleOption.push({
          label: module.module_name,
          value: module.id,
          type: module.module_type,
        });
      }
    });
    // Check if moduleOption remains empty after filtering out "parcel"
    if (moduleOption.length === 0) {
      moduleOption.push({
        label: "No result found",
      });
    }
  } else {
    moduleOption.push({
      label: "No result found",
    });
  }

  let tabs = [];
  configData?.language?.forEach((lan) => {
    let obj = {
      name: lan?.key,
      value: lan?.value,
    };
    tabs?.push(obj);
  });
  const handleCurrentTab = (value, item) => {
    setSelectedLanguage(item?.name);
    setCurrentTab(value);
  };
  useEffect(() => {
    if (zoneData?.data?.zone_data && currentLatLng) {
      refetch();
    }
  }, [zoneData?.data?.zone_data]);
  useEffect(() => {
    if (!currentLatLng && zoneData?.data) {
      localStorage.setItem(
        "currentLatLng",
        JSON.stringify(configData?.default_location)
      );
      localStorage.setItem("zoneid", zoneData?.data?.zone_id);
    }
  }, [configData?.default_location, zoneData?.data]);

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    RestaurantJoinFormik.resetForm();
    setSelectedDates(null);
    dispatch(setInZone(null));
    // Clear TIN certificate image field
    RestaurantJoinFormik.setFieldValue("tin_certificate_image", "");
    RestaurantJoinFormik.setFieldTouched("tin_certificate_image", false);
  };
  useEffect(() => {
    if (showZoneWarning) {
      //toast.error("Please select a zone");
      RestaurantJoinFormik.setFieldValue("restaurant_address", null);
    }
  }, [showZoneWarning]);

  return (
    <CustomStackFullWidth
      sx={{
        marginTop: "2rem",
      }}
    >
      <form noValidate onSubmit={RestaurantJoinFormik.handleSubmit}>
        <CustomStackFullWidth
          mt="20px"
          mb="8px"
          sx={{
            backgroundColor: theme.palette.neutral[100],
            borderRadius: "8px",
            boxShadow: shadows[1],
            position: "relative",
            isolation: "isolate",
            zIndex: 0,
          }}
        >
          <OwnerForm
            RestaurantJoinFormik={RestaurantJoinFormik}
            fNameHandler={fNameHandler}
            lNameHandler={lNameHandler}
            phoneHandler={phoneHandler}
          />
        </CustomStackFullWidth>
        <Stack
          id="store-reg-general-info"
          sx={{
            borderRadius: "18px",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? `0 20px 55px ${alpha(theme.palette.common.black, 0.8)}`
                : `0 18px 45px ${alpha(theme.palette.neutral[900], 0.08)}`,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? alpha(theme.palette.neutral[900], 0.9)
                : `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.03
                  )} 0%, ${theme.palette.background.paper} 55%, #ffffff 100%)`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.25, sm: 1.75 },
              borderBottom: `1px solid ${alpha(
                theme.palette.neutral[400],
                0.18
              )}`,
            }}
          >
            <Stack spacing={0.3}>
              <Typography
                fontSize={{ xs: "16px", sm: "18px" }}
                fontWeight="600"
                textAlign="left"
              >
                {t("General Information")}
              </Typography>
              <Typography
                fontSize={{ xs: "11px", sm: "12px" }}
                color={(theme) => theme.palette.neutral[600]}
              >
                {t(
                  "Tell us about your store and location so we can set up your vendor profile."
                )}
              </Typography>
            </Stack>
          </Stack>

          <CustomStackFullWidth
            sx={{
              px: { xs: "14px", sm: "20px", md: "24px" },
              py: { xs: "14px", sm: "20px" },
            }}
            mt=".5rem"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RestaurantDetailsForm
                  RestaurantJoinFormik={RestaurantJoinFormik}
                  restaurantNameHandler={restaurantNameHandler}
                  restaurantAddressHandler={restaurantAddressHandler}
                  restaurantvatHandler={restaurantVatHandler}
                  minDeliveryTimeHandler={minDeliveryTimeHandler}
                  maxDeliveryTimeHandler={maxDeliveryTimeHandler}
                  zoneOption={zoneOption}
                  zoneHandler={zoneHandler}
                  moduleHandler={moduleHandler}
                  moduleOption={moduleOption}
                  handleTimeTypeChangeHandler={handleTimeTypeChangeHandler}
                  currentTab={currentTab}
                  handleCurrentTab={handleCurrentTab}
                  tabs={tabs}
                  selectedLanguage={selectedLanguage}
                  pickupZoneHandler={pickupZoneHandler}
                  inZone={inZone}
                  onBusinessAddressBlur={onBusinessAddressBlur}
                  tinNumberHandler={tinNumberHandler}
                  imageOnchangeHandlerForTinImage={imageOnchangeHandlerForTinImage}
                  singleFileUploadHandlerForTinFile={singleFileUploadHandlerForTinFile}
                  file={file}
                  setFile={setFile}
                  preview={preview}
                  setPreview={setPreview}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomStackFullWidth spacing={3}>
                  <MapForRestaurantJoin
                    RestaurantJoinFormik={RestaurantJoinFormik}
                    searchHeight="100%"
                    zoneData={zoneData}
                    polygonPaths={polygonPaths}
                    inZoom="9"
                    handleLocation={handleLocation}
                    restaurantAddressHandler={restaurantAddressHandler}
                    zoneId={RestaurantJoinFormik?.values?.zoneId}
                    externalLocation={externalLocation}
                    setInZone={(val) => dispatch(setInZone(val))}
                    zoneHandler={zoneHandler}
                    fromVendor={true}
                    showZoneWarning={showZoneWarning}
                    setShowZoneWarning={setShowZoneWarning}
                    inZone={inZone}
                    initialLocation={mapSeedLocation}
                  />
                  <ImageSection
                    singleFileUploadHandlerForImage={
                      singleFileUploadHandlerForImage
                    }
                    imageOnchangeHandlerForImage={imageOnchangeHandlerForImage}
                    singleFileUploadHandlerForCoverPhoto={
                      singleFileUploadHandlerForCoverPhoto
                    }
                    imageOnchangeHandlerForCoverPhoto={
                      imageOnchangeHandlerForCoverPhoto
                    }
                    RestaurantJoinFormik={RestaurantJoinFormik}
                  />
                </CustomStackFullWidth>
              </Grid>
            </Grid>
          </CustomStackFullWidth>
        </Stack>
        <CustomStackFullWidth
          mt="20px"
          sx={{
            backgroundColor: theme.palette.neutral[100],
            borderRadius: "8px",
            boxShadow: shadows[1],
          }}
        >
          <AccountInfo
            RestaurantJoinFormik={RestaurantJoinFormik}
            emailHandler={emailHandler}
            passwordHandler={passwordHandler}
            confirmPasswordHandler={confirmPasswordHandler}
          />
        </CustomStackFullWidth>
        {/* COMMENTED OUT - BusinessTin moved to General Information section
        <CustomStackFullWidth
          mt="20px"
          sx={{
            backgroundColor: theme.palette.neutral[100],
            borderRadius: "8px",
            boxShadow: shadows[1],
          }}
        >
          <BusinessTin
            RestaurantJoinFormik={RestaurantJoinFormik}
            tinNumberHandler={tinNumberHandler}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            imageOnchangeHandlerForTinImage={imageOnchangeHandlerForTinImage}
            singleFileUploadHandlerForTinFile={
              singleFileUploadHandlerForTinFile
            }
            preview={preview}
            setFile={setFile}
            file={file}
            setPreview={setPreview}
          />
        </CustomStackFullWidth>
        */}
        <Stack mt={2} alignItems="flex-start">
          <FormControlLabel
            control={
              <Checkbox
                checked={RestaurantJoinFormik.values.tandc}
                onChange={(e) =>
                  RestaurantJoinFormik.setFieldValue("tandc", e.target.checked)
                }
                name="tandc"
              />
            }
            label={
              <Typography variant="body2">
                {t("I agree to the")}{" "}
                <Link href="/terms-and-conditions" target="_blank" rel="noreferrer">
                  {t("Terms and Conditions")}
                </Link>
              </Typography>
            }
          />
          {RestaurantJoinFormik.touched.tandc &&
            RestaurantJoinFormik.errors.tandc && (
              <FormHelperText error>{RestaurantJoinFormik.errors.tandc}</FormHelperText>
            )}
        </Stack>
        <Grid item md={12} xs={12} mt="1rem" align="end"
          sx={{
            position: "sticky",
            bottom: isBottomMenu ? "66px" : "0",
            zIndex: 999,
          }}
        >
          <ActonButtonsSection sx={{ display: "inline-flex !important" }}>
            <CustomButton
              onClick={handleReset}
              //disabled={isLoading}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.neutral[200], 0.4),
                color: (theme) => theme.palette.primary.dark,
                px: "30px",
                borderRadius: "5px",
              }}
            >
              {t("Reset")}
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={
                !RestaurantJoinFormik.values.tandc ||
                isCheckingContact ||
                RestaurantJoinFormik.isSubmitting
              }
              sx={{
                background: (theme) => theme.palette.primary.main,
                color: (theme) => theme.palette.whiteContainer.main,
                px: "30px",
                borderRadius: "5px",
                fontWeight: "500",
                fontSize: "14px",
                "&:hover": {
                  background: (theme) => theme.palette.primary.dark, // set hover color here
                },
                "&.Mui-disabled": {
                  background: (theme) => alpha(theme.palette.neutral[400], 0.35),
                  color: (theme) => theme.palette.neutral[500],
                  opacity: 1,
                  cursor: "not-allowed",
                },
              }}
            >
              {t("Next")}
            </CustomButton>
          </ActonButtonsSection>
        </Grid>
      </form>
    </CustomStackFullWidth>
  );
};

export default StoreRegistrationForm;
