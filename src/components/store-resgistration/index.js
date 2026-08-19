import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomContainer from "components/container";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { NoSsr, Typography, useMediaQuery } from "@mui/material";
import { t } from "i18next";
import StoreStepper from "components/store-resgistration/StoreStepper";
import StoreRegistrationForm from "components/store-resgistration/StoreRegistrationForm";
import BusinessPlan from "components/store-resgistration/BusinessPlan";
import FormSubmitButton from "components/profile/FormSubmitButton";
import { useDispatch, useSelector } from "react-redux";
import { usePostStoreRegistration } from "api-manage/hooks/react-query/store-registration/usePostStoreRegistration";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import PaymentSelect from "components/store-resgistration/PaymentSelect";
import { usePostBusiness } from "api-manage/hooks/react-query/store-registration/usePostBusiness";
import { useRouter } from "next/router";
import SuccessStoreRegistration from "components/store-resgistration/SuccessStoreRegistration";
import {
  setActiveStep,
  setAllData,
  setFieldErrors,
  setInZone,
} from "redux/slices/storeRegistrationData";
import { normalizePaymentRedirectLink } from "helper-functions/normalizePaymentRedirectLink";
import {
  collectRegistrationErrorMessages,
  parseRegistrationApiErrors,
} from "components/store-resgistration/registrationErrorMapper";
import toast from "react-hot-toast";
import {
  clearStoreRegistrationDraft,
  deserializeStoreRegistrationDraft,
  isUsableUpload,
  loadPendingStoreId,
  loadStoreRegistrationDraft,
  savePendingStoreId,
  saveStoreRegistrationDraft,
  serializeStoreRegistrationDraft,
} from "helper-functions/storeRegistrationDraft";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";
import { useTheme } from "@mui/styles";

const StoreRegistration = () => {
  useScrollToTop();
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [resData, setResData] = useState({});
  const [registrationError, setRegistrationError] = useState("");
  const submitInProgressRef = useRef(false);
  const isSmallSize = useMediaQuery(theme.breakpoints.down("md"));
  const { flag, active, plan, package: pa } = router.query;

  const getPaymentFlag = useCallback(() => {
    if (typeof window !== "undefined") {
      return String(
        new URLSearchParams(window.location.search).get("flag") || ""
      ).toLowerCase();
    }
    const q = flag;
    return String(Array.isArray(q) ? q[0] : q || "").toLowerCase();
  }, [flag]);

  const paymentFlag = getPaymentFlag();
  const isPaymentResult = paymentFlag === "success" || paymentFlag === "fail";

  const { allData, activeStep, inZone } = useSelector((state) => state.storeRegData);
  const [formValues, setFormValues] = useState({});
  const [draftReady, setDraftReady] = useState(false);
  const { mutate, isLoading: regIsloading } = usePostStoreRegistration();
  const { mutate: businessMutate, isLoading } = usePostBusiness();
  const wizardDepthRef = useRef(0);
  const STEP_QUERY = "reg_step";

  const parseStepQuery = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 3) return null;
    return n;
  };

  const readStepFromLocation = () => {
    if (typeof window === "undefined") return null;
    return parseStepQuery(
      new URLSearchParams(window.location.search).get(STEP_QUERY)
    );
  };

  const buildStepUrl = useCallback((nextStep, extraQuery = {}) => {
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    Object.entries(extraQuery).forEach(([key, val]) => {
      if (val == null || val === "") params.delete(key);
      else params.set(key, String(val));
    });
    params.set(STEP_QUERY, String(nextStep));
    if (nextStep < 3) params.delete("flag");
    const path =
      typeof window !== "undefined"
        ? window.location.pathname
        : router.pathname || "/store-registration";
    const search = params.toString();
    return search ? `${path}?${search}` : path;
  }, [router.pathname]);

  const goToStep = useCallback(
    (nextStep, { replace = false, extraQuery = {} } = {}) => {
      dispatch(setActiveStep(nextStep));
      if (typeof window === "undefined") return;
      const url = buildStepUrl(nextStep, extraQuery);
      const state = {
        ...(window.history.state || {}),
        as: url,
        url,
        reg_step: nextStep,
      };
      if (replace) {
        window.history.replaceState(state, "", url);
      } else {
        window.history.pushState(state, "", url);
        wizardDepthRef.current += 1;
      }
    },
    [buildStepUrl, dispatch]
  );

  const goBack = useCallback(() => {
    submitInProgressRef.current = false;
    const current = Number(activeStep) || 0;
    if (current > 0) {
      if (typeof window !== "undefined" && wizardDepthRef.current > 0) {
        window.history.back();
        return;
      }
      goToStep(current - 1, { replace: true });
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    const hasZone =
      typeof window !== "undefined" && Boolean(localStorage.getItem("zoneid"));
    router.push(hasZone ? "/home" : "/");
  }, [activeStep, goToStep, router]);

  useEffect(() => {
    const onPopState = () => {
      if (typeof window === "undefined") return;
      if (!window.location.pathname.includes("store-registration")) return;
      wizardDepthRef.current = Math.max(0, wizardDepthRef.current - 1);
      const step = readStepFromLocation();
      if (step != null) {
        dispatch(setActiveStep(step));
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [dispatch]);

  useEffect(() => {
    if (!router.isReady) return;
    let cancelled = false;
    (async () => {
      try {
        const resultFlag = getPaymentFlag();
        if (resultFlag === "success") {
          dispatch(setActiveStep(3));
          dispatch(setAllData({}));
          dispatch(setInZone(null));
          clearStoreRegistrationDraft().catch(() => {});
          return;
        }
        const wantsNewStore =
          String(router.query?.new || "").toLowerCase() === "1" ||
          String(router.query?.fresh || "").toLowerCase() === "1";
        if (wantsNewStore) {
          dispatch(setAllData({}));
          dispatch(setInZone(null));
          dispatch(setFieldErrors(null));
          dispatch(setActiveStep(0));
          setResData({});
          setFormValues({});
          await clearStoreRegistrationDraft();
          if (typeof window !== "undefined") {
            const url = buildStepUrl(0, { new: "", fresh: "", flag: "" });
            window.history.replaceState(
              { ...(window.history.state || {}), as: url, url, reg_step: 0 },
              "",
              url
            );
          }
          return;
        }
        const draft = await loadStoreRegistrationDraft();
        if (cancelled) return;
        const pendingStoreId = loadPendingStoreId();
        if (draft) {
          const values = deserializeStoreRegistrationDraft(draft);
          if (values) {
            const restored = {
              ...values,
              store_id: values.store_id || pendingStoreId || "",
            };
            dispatch(setAllData(restored));
            if (restored.inZone != null) {
              dispatch(setInZone(restored.inZone));
            }
            if (restored.store_id || restored.business_plan) {
              setResData((prev) => ({
                ...(prev || {}),
                store_id: restored.store_id || prev?.store_id,
                type: restored.business_plan || prev?.type,
                package_id: restored.package_id ?? prev?.package_id,
              }));
            }
          }
          const urlStep =
            readStepFromLocation() ?? parseStepQuery(router.query[STEP_QUERY]);
          if (
            resultFlag !== "fail" &&
            urlStep == null &&
            typeof draft.activeStep === "number" &&
            draft.activeStep >= 0 &&
            draft.activeStep < 3
          ) {
            dispatch(setActiveStep(draft.activeStep));
          }
        } else if (pendingStoreId) {
          setResData((prev) => ({
            ...(prev || {}),
            store_id: pendingStoreId,
          }));
        }
        if (resultFlag === "fail") {
          dispatch(setActiveStep(3));
        }
      } catch (_) {
        // ignore
      } finally {
        if (!cancelled) setDraftReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, router.isReady, getPaymentFlag, router.query?.new, router.query?.fresh, buildStepUrl]);

  const wipeRegistrationDraft = () => {
    dispatch(setAllData({}));
    dispatch(setInZone(null));
    setResData({});
    setFormValues({});
    clearStoreRegistrationDraft().catch(() => {});
  };

  useEffect(() => {
    if (activeStep === 0 || activeStep == null) return undefined;
    if (!allData || typeof allData !== "object") return undefined;
    if (Object.keys(allData).length === 0) return undefined;
    const timer = setTimeout(() => {
      (async () => {
        try {
          const existing = await loadStoreRegistrationDraft();
          const merged = {
            ...(existing || {}),
            ...allData,
            logo: isUsableUpload(allData.logo) ? allData.logo : existing?.logo,
            cover_photo: isUsableUpload(allData.cover_photo)
              ? allData.cover_photo
              : existing?.cover_photo,
            tin_certificate_image: isUsableUpload(allData.tin_certificate_image)
              ? allData.tin_certificate_image
              : existing?.tin_certificate_image,
            restaurant_name:
              allData.restaurant_name &&
              Object.values(allData.restaurant_name || {}).some((v) =>
                String(v || "").trim()
              )
                ? allData.restaurant_name
                : existing?.restaurant_name,
            restaurant_address:
              allData.restaurant_address &&
              Object.values(allData.restaurant_address || {}).some((v) =>
                String(v || "").trim()
              )
                ? allData.restaurant_address
                : existing?.restaurant_address,
            inZone,
            activeStep,
          };
          await saveStoreRegistrationDraft(
            await serializeStoreRegistrationDraft(merged)
          );
        } catch (_) {
          // ignore
        }
      })();
    }, 250);
    return () => clearTimeout(timer);
  }, [allData, activeStep, inZone]);

  const extractErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return t("Something went wrong. Please try again.");

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError?.message === "string" && firstError.message) {
        return firstError.message;
      }
    }

    if (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
      const firstFieldErrors = Object.values(data.errors)?.[0];
      if (Array.isArray(firstFieldErrors) && firstFieldErrors[0]) {
        return firstFieldErrors[0];
      }
    }

    if (typeof data?.message === "string" && data.message) {
      return data.message;
    }

    return t("Something went wrong. Please try again.");
  };

  const handleRegistrationApiError = (error) => {
    submitInProgressRef.current = false;
    const { step0Errors } = parseRegistrationApiErrors(error);
    const messages = collectRegistrationErrorMessages(error);
    const joined =
      messages.join("\n") || extractErrorMessage(error);

    setRegistrationError(joined);
    if (messages.length > 0) {
      messages.forEach((msg, index) => {
        toast.error(msg, { id: `store-reg-error-${index}` });
      });
    } else {
      onErrorResponse(error);
    }

    if (step0Errors && Object.keys(step0Errors).length > 0) {
      dispatch(setFieldErrors(step0Errors));
      goToStep(0, { replace: true });
    }
  };

  const formSubmit = (value) => {
    const nextData = {
      ...(allData || {}),
      ...(formValues || {}),
      business_plan: value?.business_plan,
      package_id: value?.package_id,
    };
    submitInProgressRef.current = false;
    setRegistrationError("");
    dispatch(setAllData({
      ...nextData,
      store_id: allData?.store_id || nextData?.store_id || loadPendingStoreId(),
    }));
    setResData((prev) => ({
      ...(prev || {}),
      type: value?.business_plan,
      package_id: value?.package_id,
      store_id: prev?.store_id || allData?.store_id || loadPendingStoreId(),
    }));
    goToStep(2);
  };

  const submitBusiness = (values, dataOverride) => {
    if (submitInProgressRef.current) return;

    submitInProgressRef.current = true;
    setRegistrationError("");
    const sourceData = dataOverride || allData || {};
    const persistPendingVendor = async (registrationRes) => {
      const storeId = registrationRes?.store_id;
      if (!storeId) return;
      savePendingStoreId(storeId);
      const merged = {
        ...sourceData,
        store_id: storeId,
        business_plan:
          registrationRes?.type ?? sourceData?.business_plan,
        package_id:
          registrationRes?.package_id ?? sourceData?.package_id,
      };
      dispatch(setAllData(merged));
      setResData((prev) => ({
        ...(prev || {}),
        ...registrationRes,
        store_id: storeId,
        type: merged.business_plan,
        package_id: merged.package_id,
      }));
      try {
        const existing = await loadStoreRegistrationDraft();
        await saveStoreRegistrationDraft(
          await serializeStoreRegistrationDraft(
            {
              ...(existing || {}),
              ...merged,
              logo: isUsableUpload(merged.logo) ? merged.logo : existing?.logo,
              cover_photo: isUsableUpload(merged.cover_photo)
                ? merged.cover_photo
                : existing?.cover_photo,
              tin_certificate_image: isUsableUpload(
                merged.tin_certificate_image
              )
                ? merged.tin_certificate_image
                : existing?.tin_certificate_image,
            },
            {
              activeStep: 2,
              store_id: storeId,
            }
          )
        );
      } catch (_) {
        // ignore
      }
    };

    const unwrapRegistration = (registrationRes) => {
      const nested = registrationRes?.data;
      const data =
        nested && typeof nested === "object" && !Array.isArray(nested)
          ? { ...registrationRes, ...nested }
          : registrationRes || {};
      return {
        ...data,
        store_id: data?.store_id || data?.id || nested?.store_id || nested?.id,
        type: data?.type || data?.business_plan || sourceData?.business_plan,
        package_id: data?.package_id ?? sourceData?.package_id,
      };
    };

    const handleRegisteredStore = (registrationRes) => {
      const normalized = unwrapRegistration(registrationRes);
      const businessPayload = {
        business_plan: normalized?.type ?? sourceData?.business_plan,
        store_id: normalized?.store_id,
        package_id: normalized?.package_id ?? sourceData?.package_id,
        module_id: sourceData?.module_id,
        zone_id: sourceData?.zoneId,
        ...values,
      };

      // Commission plan can complete without payment transaction.
      if (businessPayload?.business_plan === "commission") {
        submitInProgressRef.current = false;
        goToStep(3, { extraQuery: { flag: "success", active: "" } });
        wipeRegistrationDraft();
        return;
      }

      businessMutate(businessPayload, {
        onSuccess: async (res) => {
          submitInProgressRef.current = false;
          if (res) {
            await persistPendingVendor({
              store_id: businessPayload.store_id,
              type: businessPayload.business_plan,
              package_id: businessPayload.package_id,
            });
            if (res?.redirect_link && res?.payment !== "free_trial") {
              const redirect_url = normalizePaymentRedirectLink(
                res.redirect_link
              );
              if (typeof window !== "undefined") {
                window.location.assign(redirect_url);
              }
              return;
            }
            goToStep(3, { extraQuery: { flag: "success", active: "" } });
            wipeRegistrationDraft();
          }
        },
        onError: handleRegistrationApiError,
      });
    };

    const pendingStoreId = resData?.store_id || sourceData?.store_id || allData?.store_id || loadPendingStoreId();
    if (pendingStoreId) {
      handleRegisteredStore({
        ...(resData || {}),
        store_id: pendingStoreId,
        type: sourceData?.business_plan,
        package_id: sourceData?.package_id,
      });
      return;
    }

    const registrationPayload = {
      ...sourceData,
      value: {
        business_plan: sourceData?.business_plan,
        package_id: sourceData?.package_id,
      },
    };

    // Final step: create vendor record only here.
    mutate(registrationPayload, {
      onSuccess: async (registrationRes) => {
        const normalized = unwrapRegistration(registrationRes);
        await persistPendingVendor(normalized);
        handleRegisteredStore(normalized);
      },
      onError: (error) => {
        const existingId =
          error?.response?.data?.store_id ||
          sourceData?.store_id ||
          allData?.store_id ||
          resData?.store_id ||
          loadPendingStoreId();
        const msg = String(
          error?.response?.data?.message ||
            error?.response?.data?.errors?.[0]?.message ||
            ""
        ).toLowerCase();
        if (existingId && /already|exist|taken|registered/.test(msg)) {
          handleRegisteredStore({
            store_id: existingId,
            type: sourceData?.business_plan,
            package_id: sourceData?.package_id,
          });
          return;
        }
        handleRegistrationApiError(error);
      },
    });
  };

  useEffect(() => {
    if (!router.isReady || !draftReady) return;
    const resultFlag = getPaymentFlag();
    if (resultFlag === "success") {
      dispatch(setActiveStep(3));
      if (typeof window !== "undefined") {
        const url = buildStepUrl(3, { flag: resultFlag });
        window.history.replaceState(
          { ...(window.history.state || {}), as: url, url, reg_step: 3 },
          "",
          url
        );
      }
      return;
    }
    if (resultFlag === "fail") {
      dispatch(setActiveStep(3));
      return;
    }
    const fromUrl =
      readStepFromLocation() ?? parseStepQuery(router.query[STEP_QUERY]);
    if (fromUrl != null) {
      if (fromUrl !== activeStep) {
        dispatch(setActiveStep(fromUrl));
      }
      return;
    }
    const step =
      activeStep === null || activeStep === undefined ? 0 : activeStep;
    if (typeof window === "undefined") return;
    const url = buildStepUrl(step);
    window.history.replaceState(
      { ...(window.history.state || {}), as: url, url, reg_step: step },
      "",
      url
    );
    if (step !== activeStep) {
      dispatch(setActiveStep(step));
    }
  }, [router.isReady, draftReady, getPaymentFlag]);

  const handleActiveStep = () => {
    if (isPaymentResult) {
      return (
        <SuccessStoreRegistration
          flag={paymentFlag}
          onBack={goBack}
          onGoToStep={goToStep}
        />
      );
    }
    const step = (activeStep === null || activeStep === undefined) ? 0 : activeStep;
    if (step === 0) {
      return (
        <StoreRegistrationForm
          setActiveStep={setActiveStep}
          onGoToStep={goToStep}
          setFormValues={setFormValues}
          forceNewStore={String(router.query?.new || "").toLowerCase() === "1"}
          registrationError={registrationError}
          clearRegistrationError={() => {
            setRegistrationError("");
            dispatch(setFieldErrors(null));
          }}
        />
      );
    } else if (step === 1) {
      return (
        <BusinessPlan
          setActiveStep={setActiveStep}
          formSubmit={formSubmit}
          isLoading={false}
          registrationResponse={resData}
          onBack={goBack}
          onBackToGeneralInfo={() => {
            setRegistrationError("");
          }}
          registrationError={registrationError}
          clearRegistrationError={() => setRegistrationError("")}
        />
      );
    } else if (step === 3) {
      return <SuccessStoreRegistration flag={flag || "success"} onBack={goBack} onGoToStep={goToStep} />;
    } else if (step === 2) {
      return (
        <PaymentSelect
          isLoading={isLoading || regIsloading}
          resData={resData}
          submitBusiness={submitBusiness}
          onBack={goBack}
          registrationError={registrationError}
          clearRegistrationError={() => setRegistrationError("")}
        />
      );
    }
  };

  return (
    <NoSsr>
      <CustomContainer>
        <CustomStackFullWidth
          justify="center"
          mt={{ xs: "1.5rem", md: "2rem" }}
          sx={{
            maxWidth: "1080px",
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            fontSize={isSmallSize ? "22px" : "36px"}
            fontWeight="700"
            textAlign="center"
            sx={{
              mb: 0.75,
            }}
          >
            {t("Marketplace Seller")}
          </Typography>
          <Typography
            fontSize={{ xs: "12px", md: "14px" }}
            color={(theme) => theme.palette.neutral[600]}
            sx={{
              maxWidth: "640px",
              mx: "auto",
              mb: { xs: 2, md: 3 },
            }}
          >
            {t(
              "Join GIFT Marketplace and grow your business with online orders, powerful tools, and dedicated customer reach."
            )}
          </Typography>
          <StoreStepper flag={flag} activeStep={isPaymentResult ? 3 : activeStep} />
          {handleActiveStep()}
        </CustomStackFullWidth>
      </CustomContainer>
    </NoSsr>
  );
};

export default StoreRegistration;
