import React, { useEffect, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { CustomTypography } from "../landing-page/hero-section/HeroSection.style";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { alpha, NoSsr } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";

const CustomPhoneNumberInputStyled = styled(PhoneInput, {
  shouldForwardProp: (prop) => prop !== "alignWithMuiField",
})(
  ({ theme, languageDirection, borderRadius, background, alignWithMuiField }) => ({
    ...(alignWithMuiField && {
      "&.react-tel-input": {
        marginTop: 0,
        paddingTop: 0,
        position: "relative",
        overflow: "visible",
        zIndex: 5,
      },
    }),
    "&.react-tel-input": {
      // Prevent the floating label from being clipped
      overflow: "visible",
    },
    "&.react-tel-input .special-label": {
      fontSize: "12px !important",
      fontWeight: "500 !important",
      color: alpha(theme.palette.neutral[1000], 0.7),
      left: languageDirection === "rtl" ? "80%" : alignWithMuiField ? "14px !important" : "10px",
      top: alignWithMuiField ? "-9px !important" : "-8px !important",
      backgroundColor: background || theme.palette.background.paper,
      padding: "0 4px !important",
      zIndex: 9999,
      display: "inline-block",
      whiteSpace: "nowrap",
      ...(alignWithMuiField && {
        lineHeight: 1,
        transform: "none",
      }),
    },
    "&.react-tel-input .flag-dropdown": {
      backgroundColor: "transparent",
      border: "none",
      height: "100% !important",
      borderRadius: borderRadius
        ? `${borderRadius} 0px 0px ${borderRadius} !important`
        : "2px 0px 0px 2px !important",
    },
    "&.react-tel-input .selected-flag .flag": {
      right: languageDirection === "rtl" && "11px",
    },
    "&.react-tel-input .flag-dropdown.open .selected-flag": {
      backgroundColor: theme.palette.neutral[100],
    },
    "&.react-tel-input .country-list .search-box": {
      backgroundColor: theme.palette.background.custom2,
      color: theme.palette.neutral[600],
    },
    "&.react-tel-input .country-list .search ": {
      backgroundColor: theme.palette.background.custom2,
    },
    "&.react-tel-input .country-list .search .search-box": {
      height: "36px !important",
    },
    "&.react-tel-input .country-list .search-emoji": {
      display: "none",
    },
    "&.react-tel-input .selected-flag": {
      backgroundColor: theme.palette.neutral[100],
      height: "100% !important",
      borderRadius: borderRadius
        ? `${borderRadius} 0px 0px ${borderRadius} !important`
        : "2px 0px 0px 2px !important",
      width: "auto !important",
      minWidth: "85px !important",
      paddingLeft: "8px !important",
      paddingRight: "8px !important",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "&:hover": {
        backgroundColor: theme.palette.background.custom2,
      },
    },
    "&.react-tel-input .selected-dial-code": {
      color: theme.palette.neutral[800],
      fontWeight: 500,
      marginLeft: "2px",
      marginRight: "6px",
    },
    "&.react-tel-input .country-list .country": {
      textAlign: "start",
      padding: "3px 18px",
      "&:hover": {
        backgroundColor: theme.palette.background.custom2,
      },
    },
    "&.react-tel-input .country-list .search-emoji": {
      marginInlineEnd: "10px",
    },
    "&.react-tel-input .country-list": {
      backgroundColor: theme.palette.background.custom2,
      width: "300px",

      [theme.breakpoints.down("sm")]: {
        width: "300px",
      },
    },
    "&.react-tel-input .country-list .country.highlight": {
      backgroundColor: theme.palette.background.default,
    },
    "&.react-tel-input .country-list .country-name": {
      color: theme.palette.neutral[1000],
    },
    "&.react-tel-input .country-list .country .dial-code": {
      color: theme.palette.neutral[400],
    },
    "&.react-tel-input .selected-flag .arrow": {
      right: languageDirection === "rtl" ? "-20px" : "25px",
    },
    "&.react-tel-input .form-control": {
      border: `1px solid ${theme.palette.neutral[200]}`,
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.neutral[1000],
      paddingLeft: languageDirection === "rtl" ? "92px !important" : "92px !important",
      marginRight: 0,
      boxSizing: "border-box",
      ...(alignWithMuiField && {
        marginTop: 0,
      }),
      ...(languageDirection === "rtl" && {
        textAlign: "left",
        direction: "ltr",
        unicodeBidi: "plaintext",
      }),
      "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus":
      {
        filter: "none",
        WebkitTextFillColor: theme.palette.neutral[1000],
        WebkitBoxShadow:
          "0 0 0px 40rem " + theme.palette.neutral[200] + " inset",
      },
    },
    "&.react-tel-input .iti__flag-container": {
      left: languageDirection === "rtl" ? "unset" : 0,
      right: languageDirection === "rtl" ? 0 : "unset",
    },
    "&.react-tel-input .iti__selected-flag": {
      left: languageDirection === "rtl" ? 0 : "unset",
      right: languageDirection === "rtl" ? "unset" : 0,
    },
    "&.react-tel-input .iti__selected-flag .iti__arrow": {
      transform:
        languageDirection === "rtl" ? "rotate(180deg)" : "rotate(0deg)",
    },
  })
);
const CustomPhoneInput = ({
  value,
  onHandleChange,
  initCountry,
  touched,
  errors,
  lanDirection,
  height,
  borderRadius,
  background,
  removeLabel,
  required,
  disabled,
  specialLabel: customSpecialLabel,
  /** Align label + input vertically with adjacent MUI TextField (e.g. sign-up row) */
  alignWithMuiField,
}) => {
  const getDialCodeFromCountry = (countryCode) => {
    if (!countryCode || !PhoneInput?.getCountryData) return "";
    const selectedCountry = PhoneInput.getCountryData().find(
      (item) => item.countryCode === countryCode.toLowerCase()
    );
    return selectedCountry?.dialCode || "";
  };

  const defaultCountry = initCountry?.toLowerCase();
  const [selectedDialCode, setSelectedDialCode] = useState(
    getDialCodeFromCountry(defaultCountry)
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  const getDigits = (val) => `${val || ""}`.replace(/\D/g, "");
  const getLocalNumber = (fullNumber, dialCode) => {
    const digits = getDigits(fullNumber);
    if (!dialCode || !digits.startsWith(dialCode)) return digits;
    return digits.slice(dialCode.length);
  };
  const changeHandler = (phone, countryData) => {
    const dialCode = countryData?.dialCode || selectedDialCode || "";
    const currentValue = getDigits(phone);
    const nationalNumber = getLocalNumber(currentValue, dialCode);
    setSelectedDialCode(dialCode);
    setPhoneNumber(nationalNumber);
    onHandleChange(nationalNumber ? `${dialCode}${nationalNumber}` : dialCode);
  };
  const { configData } = useSelector((state) => state.configData);
  const { t } = useTranslation();
  useEffect(() => {
    const initialDialCode = getDialCodeFromCountry(defaultCountry);
    setSelectedDialCode(initialDialCode);
  }, [defaultCountry]);

  useEffect(() => {
    const fullDigits = getDigits(value);
    const localNumber = getLocalNumber(fullDigits, selectedDialCode);
    setPhoneNumber(localNumber);
  }, [value, selectedDialCode]);

  const displayValue = useMemo(
    () => `${selectedDialCode}${phoneNumber}`,
    [selectedDialCode, phoneNumber]
  );
  return (
    <NoSsr>
      <CustomStackFullWidth
        alignItems="flex-start"
        spacing={alignWithMuiField ? 0 : 0.8}
        sx={
          alignWithMuiField
            ? {
                width: "100%",
                "& .react-tel-input": {
                  marginTop: 0,
                  paddingTop: 0,
                },
              }
            : undefined
        }
      >
        {lanDirection && (
          <CustomPhoneNumberInputStyled
            alignWithMuiField={alignWithMuiField}
            background={background}
            borderRadius={borderRadius}
            autoFormat={false}
            placeholder={t("Enter phone number")}
            value={displayValue}
            copyNumbersOnly
            enableSearchField
            enableSearch
            separateDialCode
            countryCodeEditable={false}
            onChange={changeHandler}
            disabled={disabled}
            inputProps={{
              required: true,
              autoFocus: false,
              disabled,
              placeholder: t("Enter phone number"),
              onKeyDown: (e) => {
                if (["+", "-", "e", "E"].includes(e.key)) {
                  e.preventDefault();
                }
              },
            }}
            specialLabel={
              customSpecialLabel ??
              (required ? (
                <span>
                  {t("Phone")}
                  <span style={{ color: "#d32f2f", marginLeft: "2px" }}>*</span>
                </span>
              ) : (
                t("Phone")
              ))
            }
            country={defaultCountry}
            searchStyle={{ margin: "0", width: "95%", height: "50px" }}
            inputStyle={{
              width: "100%",
              height: height ? height : "56px",
              borderRadius: borderRadius ? borderRadius : "2px",
            }}
            languageDirection={lanDirection}
            buttonClass={{ "background-color": "red" }}
            {...(configData?.country_picker_status !== 1 && {
              disableDropdown: true,
            })}
          />
        )}
        {touched && errors && (
          <CustomTypography
            variant="caption"
            sx={{
              ml: "10px",
              fontWeight: "inherit",
              color: (theme) => theme.palette.error.main,
            }}
          >
            {errors}
          </CustomTypography>
        )}
      </CustomStackFullWidth>
    </NoSsr>
  );
};
export default CustomPhoneInput;
