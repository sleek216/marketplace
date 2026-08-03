import {
  alpha,
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import H1 from "components/typographies/H1";
import {
  CustomButton,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { useTranslation } from "react-i18next";
import UserInfo from "./UserInfo";
import IdentityInfo from "./IdentityInfo";
import AccountInfo from "./AccountInfo";
import DeliverymanFormWrapper from "./DeliverymanFormWrapper";
import { useFormik } from "formik";
import { useState } from "react";
import { usePostDeliveryManRegisterInfo } from "api-manage/hooks/react-query/deliveryman-registration/useRegisterDeliveryMan";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import toast from "react-hot-toast";
import deliveryManValidationSchema from "./validation/delivery-validation-schema";
import { useRouter } from "next/router";
import {
  ActonButtonsSection,
  FormSection,
  TitleTopSection,
} from "./CustomStylesDeliveryman";
import { objectToFormData } from "helper-functions/objectToFormData";
import { FORM_TITLE } from "./constants";
import useScrollToTop from "api-manage/hooks/custom-hooks/useScrollToTop";

const formatIdentityNumberForUI = (value, identityType) => {
  if (identityType === "passport") {
    const normalized = (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = normalized.replace(/[^A-Z]/g, "").slice(0, 2);
    const digits = normalized.replace(/[^0-9]/g, "").slice(0, 7);
    if (!letters && !digits) return "";
    if (letters.length < 2 && digits.length === 0) return letters;
    if (digits.length === 0) return `${letters} - `;
    return `${letters} - ${digits}`;
  }

  if (identityType === "driving_license") {
    const normalized = (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = normalized.replace(/[^A-Z]/g, "").slice(0, 2);
    const midDigits = normalized.replace(/[^0-9]/g, "").slice(0, 2);
    const lastDigits = normalized.replace(/[^0-9]/g, "").slice(2, 7);
    if (!letters && !midDigits && !lastDigits) return "";
    if (letters.length < 2 && midDigits.length === 0) return letters;
    if (midDigits.length === 0) return `${letters} - `;
    if (lastDigits.length === 0) return `${letters} - ${midDigits} - `;
    return `${letters} - ${midDigits} - ${lastDigits}`;
  }

  // CNIC (default): xxxxx - xxxxxxx - x
  const digits = (value || "").replace(/\D/g, "").slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return `${digits.slice(0, 5)} - ${digits.slice(5)}`;
  return `${digits.slice(0, 5)} - ${digits.slice(5, 12)} - ${digits.slice(12, 13)}`;
};

const normalizeIdentityNumberForBackend = (value, identityType) => {
  if (identityType === "passport") {
    const normalized = (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = normalized.replace(/[^A-Z]/g, "").slice(0, 2);
    const digits = normalized.replace(/[^0-9]/g, "").slice(0, 7);
    return `${letters}${digits}`;
  }
  if (identityType === "driving_license") {
    const normalized = (value || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const letters = normalized.replace(/[^A-Z]/g, "").slice(0, 2);
    const digits = normalized.replace(/[^0-9]/g, "").slice(0, 7);
    return `${letters}${digits}`;
  }
  return (value || "").replace(/\D/g, "");
};

const DeliveryManComponent = ({ configData }) => {
  useScrollToTop();
  const router = useRouter();
  const { t } = useTranslation();
  const isBottomMenu = useMediaQuery("(max-width: 1180px)");
  const [image, setImage] = useState("");
  const [identityImage, setIdentityImage] = useState("");
  const { mutate: registerDeliveryman, isLoading } =
    usePostDeliveryManRegisterInfo();

  const deliveryManFormik = useFormik({
    initialValues: {
      f_name: "",
      l_name: "",
      email: "",
      earning: "",
      referral_code: "",
      zone_id: "",
      vehicle_id: "",
      identity_type: "cnic",
      identity_number: "",
      phone: "",
      password: "",
      confirm_password: "",
      tandc: false,
    },
    validationSchema: deliveryManValidationSchema(),
    validationOptions: {
      abortEarly: false,
    },
    onSubmit: async (values, helpers) => {
      try {
        if (!values?.tandc) return;
        const { confirm_password, tandc, ...modifiedValues } = values;

        // UI shows separators, backend gets normalized compact value.
        modifiedValues.identity_number = normalizeIdentityNumberForBackend(
          modifiedValues.identity_number,
          modifiedValues.identity_type
        );
        if (modifiedValues.identity_type === "cnic") {
          // Keep API compatibility in case backend still expects "nid".
          modifiedValues.identity_type = "nid";
        }

        registerDeliveryman(objectToFormData(modifiedValues), {
          onSuccess: (res) => {
            toast.success(res.message, { id: res.message });
            helpers.resetForm();
            setImage("");
            setIdentityImage("");
            router.push("/home");
          },
          onError: onErrorResponse,
        });
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleFieldChange = (field, value) => {
    if (field === "f_name" || field === "l_name") {
      const sanitizedValue = (value || "").replace(/[^A-Za-z\s]/g, "");
      deliveryManFormik.setFieldValue(field, sanitizedValue);
      return;
    }

    if (field === "identity_number") {
      // Store RAW value in formik (no dashes/spaces). UI formatting is handled
      // in `IdentityInfo` via `displayIdentityNumber`.
      deliveryManFormik.setFieldValue(field, value);
      return;
    }

    deliveryManFormik.setFieldValue(field, value);
  };

  const handleReset = () => {
    deliveryManFormik.resetForm();
    setImage("");
    setIdentityImage("");
  };

  return (
    <CustomStackFullWidth
      sx={{
        maxWidth: "1080px",
        mx: "auto",
        width: "100%",
        textAlign: "center",
        mt: { xs: "1.5rem", md: "2rem" },
      }}
    >
      <TitleTopSection>
        <H1
          text={t("Marketplace Rider")}
          sx={{
            fontWeight: "700",
            fontSize: { xs: "26px", md: "36px" },
            mt: "20px",
            lineHeight: "36px",
          }}
        />
      </TitleTopSection>

      {/* Mirrors StoreRegistrationForm root: only marginTop, so sticky scroll bounds match vendor. */}
      <CustomStackFullWidth
        sx={{
          marginTop: "2rem",
        }}
      >
        <form onSubmit={deliveryManFormik.handleSubmit}>
          <Box mt={4} sx={{ textAlign: "left" }}>
            <FormSection>
              <DeliverymanFormWrapper
                title={FORM_TITLE.userInfo}
                component={
                  <UserInfo
                    {...{ deliveryManFormik, image, setImage }}
                    handleFieldChange={handleFieldChange}
                  />
                }
              />
              <DeliverymanFormWrapper
                title={FORM_TITLE.accountInfo}
                component={
                  <AccountInfo
                    configData={configData}
                    {...{ deliveryManFormik }}
                    handleFieldChange={handleFieldChange}
                  />
                }
              />
              <DeliverymanFormWrapper
                title={FORM_TITLE.identityInfo}
                component={
                  <IdentityInfo
                    {...{ deliveryManFormik, identityImage, setIdentityImage }}
                    handleFieldChange={handleFieldChange}
                  />
                }
              />
            </FormSection>

            <Stack mt={2} alignItems="flex-start">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deliveryManFormik.values.tandc}
                    onChange={(e) =>
                      deliveryManFormik.setFieldValue("tandc", e.target.checked)
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
              {deliveryManFormik.touched.tandc && deliveryManFormik.errors.tandc && (
                <FormHelperText error>
                  {deliveryManFormik.errors.tandc}
                </FormHelperText>
              )}
            </Stack>
          </Box>

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
                disabled={isLoading || !deliveryManFormik.values.tandc}
                sx={{
                  background: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.whiteContainer.main,
                  px: "30px",
                  borderRadius: "5px",
                  fontWeight: "500",
                  fontSize: "14px",
                  "&:hover": {
                    background: (theme) => theme.palette.primary.dark,
                  },
                  "&.Mui-disabled": {
                    background: (theme) => alpha(theme.palette.neutral[400], 0.35),
                    color: (theme) => theme.palette.neutral[500],
                    opacity: 1,
                    cursor: "not-allowed",
                  },
                }}
              >
                {t(isLoading ? "Submitting..." : "Submit Information")}
              </CustomButton>
            </ActonButtonsSection>
          </Grid>
        </form>
      </CustomStackFullWidth>
    </CustomStackFullWidth>
  );
};

export default DeliveryManComponent;
