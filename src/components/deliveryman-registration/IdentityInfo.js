import {
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import CustomTextFieldWithFormik from "components/form-fields/CustomTextFieldWithFormik";
import { t } from "i18next";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import BadgeIcon from "@mui/icons-material/Badge";
import React, { useEffect, useState } from "react";
import { alpha } from "@mui/system";
import { IDENTITY_TYPE } from "./constants";
import { useTheme } from "@emotion/react";
import InputLabel from "@mui/material/InputLabel";
import MultiFileUploader from "components/multi-file-uploader/MultiFileUploader";

const acceptedFileInputFormat =
  "application/pdf,image/*,text/plain,.doc, .docx,.txt";
const supportedFormatMultiImages = [
  "jpg", "jpeg", "gif", "png", "pdf", "doc", "docx", "deb", "webp",
];

const IdentityInfo = ({
  deliveryManFormik,
  identityImage,
  setIdentityImage,
  handleFieldChange,
}) => {
  const theme = useTheme();
  const [displayIdentityNumber, setDisplayIdentityNumber] = useState("");

  // Format identity number based on type
  const formatIdentityNumber = (value, type) => {
    if (!value) return "";
    const digits = value.replace(/\D/g, "");
    const letters = value.replace(/[^A-Za-z]/g, "");
    
    switch (type) {
      case "cnic":
        // Format: xxxxx-xxxxxxx-x
        if (digits.length <= 5) {
          return digits;
        } else if (digits.length <= 12) {
          return `${digits.slice(0, 5)}-${digits.slice(5)}`;
        } else {
          return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
        }
      case "driving_license":
        // Format: AA-12-12345
        const cleanValue = value.replace(/[^A-Za-z0-9-]/g, "");
        const letters = cleanValue.replace(/[^A-Za-z]/g, "");
        const numbers = cleanValue.replace(/[^0-9]/g, "");
        
        if (letters.length >= 2 && numbers.length >= 2) {
          const firstLetters = letters.substring(0, 2).toUpperCase();
          const firstNumbers = numbers.substring(0, 2);
          const remainingNumbers = numbers.substring(2, 7);
          return `${firstLetters}-${firstNumbers}-${remainingNumbers}`;
        } else if (cleanValue.match(/^[A-Za-z]/)) {
          // If starts with letters, format as AA-
          const firstLetters = letters.substring(0, 2).toUpperCase();
          if (numbers.length > 0) {
            const firstNumbers = numbers.substring(0, 2);
            const remainingNumbers = numbers.substring(2, 7);
            return `${firstLetters}-${firstNumbers}-${remainingNumbers}`;
          }
          return firstLetters;
        } else {
          // If starts with numbers, add AA- prefix
          const firstNumbers = numbers.substring(0, 2);
          const remainingNumbers = numbers.substring(2, 7);
          return `AA-${firstNumbers}-${remainingNumbers}`;
        }
      case "passport":
        // Format: AB1234567 (letters followed by numbers)
        const cleanPassport = value.replace(/[^A-Za-z0-9]/g, "");
        return cleanPassport.toUpperCase();
      default:
        return value;
    }
  };

  // Strip formatting to get raw value for submission
  const stripIdentityNumberFormatting = (value, type) => {
    switch (type) {
      case "cnic":
        return value.replace(/\D/g, "");
      case "driving_license":
        return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      case "passport":
        return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      default:
        return value;
    }
  };

  const handleIdentityNumberKeyDown = (event) => {
    const allowedControlKeys = [
      "Backspace", "Delete", "Tab", "Enter",
      "ArrowLeft", "ArrowRight", "Home", "End", "-",
    ];
    if (allowedControlKeys.includes(event.key)) return;

    const selectedIdentityType = deliveryManFormik.values.identity_type;
    
    switch (selectedIdentityType) {
      case "cnic":
        if (!/^\d$/.test(event.key)) event.preventDefault();
        break;
      case "driving_license":
        if (!/^[A-Za-z0-9-]$/.test(event.key)) event.preventDefault();
        break;
      case "passport":
        if (!/^[A-Za-z0-9]$/.test(event.key)) event.preventDefault();
        break;
      default:
        if (!/^[A-Za-z0-9-]$/.test(event.key)) event.preventDefault();
    }
  };

  const handleIdentityNumberPaste = (event) => {
    const pastedText = event.clipboardData?.getData("text") || "";
    const selectedIdentityType = deliveryManFormik.values.identity_type;
    
    switch (selectedIdentityType) {
      case "cnic":
        if (!/^[\d\s-]+$/.test(pastedText)) {
          event.preventDefault();
        } else {
          const strippedValue = stripIdentityNumberFormatting(pastedText, selectedIdentityType);
          const formattedValue = formatIdentityNumber(strippedValue, selectedIdentityType);
          setDisplayIdentityNumber(formattedValue);
          handleFieldChange("identity_number", strippedValue);
        }
        break;
      case "driving_license":
        if (!/^[A-Za-z0-9\s-]+$/.test(pastedText)) {
          event.preventDefault();
        } else {
          const strippedValue = stripIdentityNumberFormatting(pastedText, selectedIdentityType);
          const formattedValue = formatIdentityNumber(strippedValue, selectedIdentityType);
          setDisplayIdentityNumber(formattedValue);
          handleFieldChange("identity_number", strippedValue);
        }
        break;
      case "passport":
        if (!/^[A-Za-z0-9\s-]+$/.test(pastedText)) {
          event.preventDefault();
        } else {
          const strippedValue = stripIdentityNumberFormatting(pastedText, selectedIdentityType);
          const formattedValue = formatIdentityNumber(strippedValue, selectedIdentityType);
          setDisplayIdentityNumber(formattedValue);
          handleFieldChange("identity_number", strippedValue);
        }
        break;
      default:
        if (!/^[A-Za-z0-9\s-]+$/.test(pastedText)) {
          event.preventDefault();
        }
    }
  };

  // Handle identity number input with formatting
  const handleIdentityNumberChange = (inputValue) => {
    const selectedIdentityType = deliveryManFormik.values.identity_type;
    const strippedValue = stripIdentityNumberFormatting(inputValue, selectedIdentityType);
    const formattedValue = formatIdentityNumber(strippedValue, selectedIdentityType);
    
    // Update display state
    setDisplayIdentityNumber(formattedValue);
    
    // Update formik with raw value for submission
    handleFieldChange("identity_number", strippedValue);
  };

  useEffect(() => {
    typeof identityImage !== "string" &&
      handleFieldChange("identity_image", identityImage);
  }, [identityImage]);

  // Sync display value when formik value changes (for form reset/validation)
  useEffect(() => {
    const selectedIdentityType = deliveryManFormik.values.identity_type;
    if (deliveryManFormik.values.identity_number) {
      const formattedValue = formatIdentityNumber(deliveryManFormik.values.identity_number, selectedIdentityType);
      setDisplayIdentityNumber(formattedValue);
    }
  }, [deliveryManFormik.values.identity_number, deliveryManFormik.values.identity_type]);

  const fileImagesHandler = (files, type) => {
    if (type === 'front') {
      if (deliveryManFormik.values.identity_type === "passport") {
        // For passport, replace the entire array
        setIdentityImage(files);
      } else {
        // For CNIC/driving license, update front image
        const currentImages = Array.isArray(identityImage) ? [...identityImage] : [];
        currentImages[0] = files[0]; // Front image at index 0
        setIdentityImage(currentImages);
      }
    } else if (type === 'back') {
      // For CNIC/driving license, update back image
      const currentImages = Array.isArray(identityImage) ? [...identityImage] : [];
      currentImages[1] = files[0]; // Back image at index 1
      setIdentityImage(currentImages);
    } else {
      // Fallback for single file (passport)
      setIdentityImage(files);
    }
  };

  return (
    <>
      <CustomBoxFullWidth>
        <Grid container columnSpacing={3}>
          <Grid item xs={12} md={6} sx={{ minHeight: "5rem" }}>
            <CustomSelectWithFormik
              required
              selectFieldData={IDENTITY_TYPE}
              inputLabel={t("Identity Type")}
              passSelectedValue={(value) => {
                handleFieldChange("identity_type", value);
                handleFieldChange("identity_number", "");
              }}
              touched={deliveryManFormik.touched.identity_type}
              errors={deliveryManFormik.errors.identity_type}
              fieldProps={deliveryManFormik.getFieldProps("identity_type")}
              placeholder={t("Select Identity Type")}
              startIcon={
                <BadgeIcon
                  sx={{
                    color:
                      deliveryManFormik.touched.identity_type &&
                        !deliveryManFormik.errors.identity_type
                        ? theme.palette.primary.main
                        : alpha(theme.palette.neutral[400], 0.7),
                    fontSize: "18px",
                  }}
                />
              }
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ marginTop: "-8px" }}>
            <CustomTextFieldWithFormik
              compact
              required
              type="text"
              label={t("Identity Number")}
              touched={deliveryManFormik.touched.identity_number}
              errors={deliveryManFormik.errors.identity_number}
              fieldProps={deliveryManFormik.getFieldProps("identity_number")}
              onChangeHandler={(value) => {
                handleIdentityNumberChange(value);
              }}
              triggerChangeOnType
              onKeyDown={handleIdentityNumberKeyDown}
              onPaste={handleIdentityNumberPaste}
              value={displayIdentityNumber}
              displayValue={displayIdentityNumber}
              placeholder={
                deliveryManFormik.values.identity_type === "passport"
                  ? t("Enter Identity Number (AB1234567)")
                  : deliveryManFormik.values.identity_type === "driving_license"
                    ? t("Enter Identity Number (AA-12-12345)")
                    : t("Enter Identity Number (xxxxx-xxxxxxx-x)")
              }
              fontSize="12px"
              startIcon={
                <InputAdornment position="start">
                  <BadgeIcon
                    sx={{
                      color:
                        deliveryManFormik.touched.identity_number &&
                          !deliveryManFormik.errors.identity_number
                          ? theme.palette.primary.main
                          : alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        <CustomStackFullWidth spacing={2}>
          <Stack
            direction="row"
            flexWrap="wrap"
            width="100%"
            spacing={1}
            alignItems="center"
          >
            <InputLabel
              sx={{
                fontWeight: "500",
                color: (theme) => theme.palette.neutral[1000],
              }}
            >
              {t("Identity Image")}
            </InputLabel>
            <Typography fontSize="10px">
              ({t("JPG, JPEG, PNG, WEBP Less Than 2MB Ratio 1:1")})
            </Typography>
          </Stack>

          {deliveryManFormik.values.identity_type === "passport" ? (
            // Single upload field for passport
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t("Passport Photo")}
                  </Typography>
                  <MultiFileUploader
                    fileImagesHandler={(files) => fileImagesHandler(files, 'passport')}
                    totalFiles={Array.isArray(identityImage) && identityImage.length > 0 ? [identityImage[0]] : []}
                    maxFileSize={2 * 1024 * 1024}
                    supportedFileFormats={supportedFormatMultiImages}
                    acceptedFileInputFormat={acceptedFileInputFormat}
                    maxFiles={1}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {t("Please upload your passport photo")}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            // Two separate upload fields for CNIC and driving license
            <>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={{ xs: 2, md: 1 }}
                alignItems={{ xs: "stretch", md: "flex-start" }}
              >
                <Stack flex={1} minWidth={0}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t("Front Side")}
                  </Typography>
                  <MultiFileUploader
                    fileImagesHandler={(files) => fileImagesHandler(files, 'front')}
                    totalFiles={Array.isArray(identityImage) && identityImage.length > 0 ? [identityImage[0]] : []}
                    maxFileSize={2 * 1024 * 1024}
                    supportedFileFormats={supportedFormatMultiImages}
                    acceptedFileInputFormat={acceptedFileInputFormat}
                    maxFiles={1}
                    width="100%"
                  />
                </Stack>
                <Stack flex={1} minWidth={0}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t("Back Side")}
                  </Typography>
                  <MultiFileUploader
                    fileImagesHandler={(files) => fileImagesHandler(files, 'back')}
                    totalFiles={Array.isArray(identityImage) && identityImage.length > 0 ? [identityImage[1]] : []}
                    maxFileSize={2 * 1024 * 1024}
                    supportedFileFormats={supportedFormatMultiImages}
                    acceptedFileInputFormat={acceptedFileInputFormat}
                    maxFiles={1}
                    width="100%"
                  />
                </Stack>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {deliveryManFormik.values.identity_type === "cnic" 
                  ? t("Please upload both front and back sides of your CNIC")
                  : t("Please upload both front and back sides of your driving license")
                }
              </Typography>
            </>
          )}
        </CustomStackFullWidth>
      </CustomBoxFullWidth>
    </>
  );
};

export default IdentityInfo;
