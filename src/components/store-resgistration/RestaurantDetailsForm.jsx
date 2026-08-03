import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { alpha, Grid, InputAdornment, useTheme, Stack, TextField, Box, Typography } from "@mui/material";
import CustomTextFieldWithFormik from "../form-fields/CustomTextFieldWithFormik";
import { useTranslation } from "react-i18next";
import { Briefcase as WorkIcon, MapPin as RoomIcon, Mountain as LandslideIcon } from "lucide-react";
import CustomSelectWithFormik from "components/custom-select/CustomSelectWithFormik";
import { Truck as LocalShippingIcon } from "lucide-react";
import LangTab from "components/store-resgistration/LanTab";
import { useSelector } from "react-redux";
import CustomMultiSelect from "components/custom-multi-select/CustomMultiSelect";
import { Hand as HailIcon } from "lucide-react";
import { UserCircle as AccountCircle, UploadCloud as CloudUploadIcon, FileText as DescriptionIcon } from "lucide-react";

export const checkTaxiModule = (value, moduleOption) => {
  const moduleObj = moduleOption?.find((item) => item.value === value);
  return moduleObj?.type === "rental";
};
const RestaurantDetailsForm = ({
  RestaurantJoinFormik,
  restaurantNameHandler,
  restaurantAddressHandler,
  restaurantvatHandler,
  zoneOption,
  zoneHandler,
  moduleHandler,
  moduleOption,
  handleTimeTypeChangeHandler,
  currentTab,
  handleCurrentTab,
  tabs,
  selectedLanguage,
  minDeliveryTimeHandler,
  maxDeliveryTimeHandler,
  pickupZoneHandler,
	onBusinessAddressBlur,
  tinNumberHandler,
  imageOnchangeHandlerForTinImage,
  singleFileUploadHandlerForTinFile,
  file,
  setFile,
  preview,
  setPreview,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [address, setAddress] = React.useState("");
  const timeType = [
    { label: "Minute", value: "minute" },
    { label: "Hour", value: "hour" },
    { label: "Day", value: "day" },
  ];
  useEffect(() => {
    setAddress(
      RestaurantJoinFormik.values.restaurant_address?.[selectedLanguage]
    );
  }, [RestaurantJoinFormik.values.restaurant_address, selectedLanguage]);
  const { selectedModule } = useSelector((state) => state.utilsData);
  const [moduleType, SetModuleType] = useState("");
  useEffect(() => {
    SetModuleType(selectedModule?.module_type);
  }, [selectedModule]);

  // When navigating between steps, the parent form can unmount and local `file`
  // state resets. Fall back to the persisted Formik value so the selected NTN
  // certificate still shows when returning to General Information.
  const persistedTinFile = RestaurantJoinFormik?.values?.tin_certificate_image;
  const tinFileToShow = file || persistedTinFile;

  const handleOnlyNumberInputKeyDown = (event) => {
    const allowedControlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (allowedControlKeys.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };
  const handleOnlyNumberInputPaste = (event) => {
    const pastedText = event.clipboardData?.getData("text") || "";
    if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
    }
  };


  const hasMultipleLanguages = tabs && tabs.length > 1;

  return (
    <CustomStackFullWidth alignItems="center" key={address || selectedLanguage}>
      <Grid container spacing={{ xs: "0", md: "3" }}>
        <CustomStackFullWidth spacing={4}>
          <CustomStackFullWidth
            sx={{
              padding: { xs: "10px", md: "20px" },
              paddingBottom: "0px !important",
              borderRadius: "10px",
              gap: "0px",
              backgroundColor: (theme) => theme.palette.background.default,
            }}
          >
            {hasMultipleLanguages && (
              <LangTab
                tabs={tabs}
                currentTab={currentTab}
                setCurrentTab={handleCurrentTab}
                fontSize=""
              />
            )}
            <Stack mt={hasMultipleLanguages ? 4 : 0}>
              <CustomTextFieldWithFormik
                labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                backgroundColor
                required="true"
                type="text"
                label={
                  hasMultipleLanguages
                    ? `${t("Business Name")} (${t(tabs[currentTab]?.value)})`
                    : t("Business Name")
                }
                placeholder={t("Business name")}
                value={
                  RestaurantJoinFormik.values.restaurant_name[selectedLanguage]
                }
                touched={RestaurantJoinFormik.touched.restaurant_name}
                errors={RestaurantJoinFormik.errors.restaurant_name}
                onChangeHandler={restaurantNameHandler}
                fontSize="12px"
                startIcon={
                  <InputAdornment position="start">
                    <WorkIcon
                      sx={{
                        color:
                          RestaurantJoinFormik.touched.restaurant_name &&
                            !RestaurantJoinFormik.errors.restaurant_name
                            ? theme.palette.primary.main
                            : theme.palette.neutral[400],
                        fontSize: "18px",
                      }}
                    />
                  </InputAdornment>
                }
              />
            </Stack>
            <Stack>
              <CustomTextFieldWithFormik
                labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                backgroundColor
                placeholder={t("Pick from map")}
                required="true"
                type="text"
                label={
                  hasMultipleLanguages
                    ? `${t("Business Address")} (${t(tabs[currentTab]?.value)})`
                    : t("Business Address")
                }
                touched={RestaurantJoinFormik.touched.restaurant_address}
                errors={RestaurantJoinFormik.errors.restaurant_address}
                value={
                  RestaurantJoinFormik.values.restaurant_address?.[
                  selectedLanguage
                  ] || ""
                }
                onChangeHandler={restaurantAddressHandler}
                triggerChangeOnType
                readOnly
                disableTextSelection
                fontSize="12px"
                startIcon={
                  <InputAdornment position="start">
                    <RoomIcon
                      sx={{
                        color:
                          RestaurantJoinFormik.touched.restaurant_address &&
                            !RestaurantJoinFormik.errors.restaurant_address
                            ? theme.palette.primary.main
                            : alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  </InputAdornment>
                }
              />
            </Stack>
          </CustomStackFullWidth>

          <CustomStackFullWidth gap={{ xs: "30px", md: "30px" }}>
            <Grid item xs={12} sm={12} md={12}>
              <CustomSelectWithFormik
                labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                selectFieldData={zoneOption}
                inputLabel={t("Business Zone")}
                passSelectedValue={zoneHandler}
                touched={RestaurantJoinFormik.touched.zoneId}
                errors={RestaurantJoinFormik.errors.zoneId}
                fieldProps={RestaurantJoinFormik.getFieldProps("zoneId")}
                placeholder={t("Select Business Zone")}
                required={true}
                startIcon={
                  <LandslideIcon
                    sx={{
                      color: alpha(theme.palette.neutral[400], 0.7),
                      fontSize: "18px",
                    }}
                  />
                }
              />
            </Grid>

            {RestaurantJoinFormik.values.zoneId && (
              <Grid item xs={12} sm={12} md={12}>
                <CustomSelectWithFormik
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  selectFieldData={moduleOption}
                  inputLabel={t("Business Module")}
                  placeholder={t("Select Business Module")}
                  passSelectedValue={moduleHandler}
                  touched={RestaurantJoinFormik.touched.module_id}
                  errors={RestaurantJoinFormik.errors.module_id}
                  fieldProps={RestaurantJoinFormik.getFieldProps("module_id")}
                  required={true}
                  startIcon={
                    <WorkIcon
                      sx={{
                        color: alpha(theme.palette.neutral[400], 0.7),
                        fontSize: "18px",
                      }}
                    />
                  }
                />
              </Grid>
            )}
            {checkTaxiModule(
              RestaurantJoinFormik?.values?.module_id,
              moduleOption
            ) && (
                <Grid item xs={12} sm={12} md={12} >
                  <CustomMultiSelect
                    required
                    zoneOption={zoneOption}
                    label="Pickup Area"
                    placeholder={
                      RestaurantJoinFormik.values.pickup_zone_id.length < 1
                        ? "Select Pickup Area"
                        : ""
                    }
                    handleChange={pickupZoneHandler}
                    icon={
                      <HailIcon
                        sx={{
                          color:
                            RestaurantJoinFormik.touched.restaurant_name &&
                              !RestaurantJoinFormik.errors.restaurant_name
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "16px",
                        }}
                      />
                    }
                  />
                </Grid>
              )}

            <Grid item container xs={12} sm={12} md={12} spacing={{ xs: 0, md: 2 }}>
              <Grid item md={4} xs={12}>
                <CustomTextFieldWithFormik
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  placeholder={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Min Pickup Time")
                      : t("Min Delivery Time")
                  }
                  required="true"
                  type="number"
                  name="min_delivery_time"
                  label={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Minimum Pickup Time")
                      : t("Minimum Delivery Time")
                  }
                  touched={RestaurantJoinFormik.touched.min_delivery_time}
                  errors={RestaurantJoinFormik.errors.min_delivery_time}
                  fieldProps={RestaurantJoinFormik.getFieldProps(
                    "min_delivery_time"
                  )}
                  onChangeHandler={minDeliveryTimeHandler}
                  value={RestaurantJoinFormik.values.min_delivery_time}
                  onKeyDown={handleOnlyNumberInputKeyDown}
                  onPaste={handleOnlyNumberInputPaste}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <LocalShippingIcon
                        sx={{
                          color:
                            RestaurantJoinFormik.touched.min_delivery_time &&
                              !RestaurantJoinFormik.errors.min_delivery_time
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <CustomTextFieldWithFormik
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  placeholder={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Max Pickup Time")
                      : t("Max Delivery Time")
                  }
                  required="true"
                  type="number"
                  name="max_delivery_time"
                  label={
                    checkTaxiModule(
                      RestaurantJoinFormik?.values?.module_id,
                      moduleOption
                    )
                      ? t("Maximum Pickup Time")
                      : t("Maximum Delivery Time")
                  }
                  touched={RestaurantJoinFormik.touched.max_delivery_time}
                  errors={RestaurantJoinFormik.errors.max_delivery_time}
                  fieldProps={RestaurantJoinFormik.getFieldProps(
                    "max_delivery_time"
                  )}
                  onChangeHandler={maxDeliveryTimeHandler}
                  value={RestaurantJoinFormik.values.max_delivery_time}
                  onKeyDown={handleOnlyNumberInputKeyDown}
                  onPaste={handleOnlyNumberInputPaste}
                  fontSize="12px"
                  startIcon={
                    <InputAdornment position="start">
                      <LocalShippingIcon
                        sx={{
                          color:
                            RestaurantJoinFormik.touched.max_delivery_time &&
                              !RestaurantJoinFormik.errors.max_delivery_time
                              ? theme.palette.primary.main
                              : alpha(theme.palette.neutral[400], 0.7),
                          fontSize: "18px",
                        }}
                      />
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} style={{marginTop: "16px"}}>
                <CustomSelectWithFormik
                  required={true}
                  labelColor={alpha(theme.palette.neutral[1000], 0.8)}
                  selectFieldData={timeType}
                  inputLabel={t("Duration type")}
                  passSelectedValue={handleTimeTypeChangeHandler}
                  touched={RestaurantJoinFormik.touched.delivery_time_type}
                  errors={RestaurantJoinFormik.errors.delivery_time_type}
                  placeholder={t("Select Duration")}
                  fieldProps={RestaurantJoinFormik.getFieldProps(
                    "delivery_time_type"
                  )}
                />
              </Grid>
            </Grid>

            {/* NTN Fields Section */}
            <Grid item container xs={12} sm={12} md={12} spacing={{ xs: 0, md: 2 }} sx={{ mt: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fontSize="12px"
                  label={t("National Tax Number (NTN)")}
                  placeholder={t("Type your NTN")}
                  type="text"
                  inputMode="numeric"
                  fullWidth
                  name="tin"
                  value={RestaurantJoinFormik.values.tin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 13);
                    RestaurantJoinFormik.setFieldValue("tin", value);
                  }}
                  onBlur={RestaurantJoinFormik.handleBlur}
                  inputProps={{
                    maxLength: 13,
                    pattern: "[0-9]*"
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle
                          sx={{
                            color: alpha(theme.palette.neutral[400], 0.7),
                            fontSize: "18px",
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  error={
                    RestaurantJoinFormik.touched.tin &&
                    Boolean(RestaurantJoinFormik.errors.tin)
                  }
                  helperText={
                    RestaurantJoinFormik.touched.tin &&
                    RestaurantJoinFormik.errors.tin
                  }
                  sx={{
                    "& .MuiInputBase-root": {
                      height: "45px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "12px",
                      padding: "0 14px",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={2}>
                  {/* Label and Info */}
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: { xs: "12px", sm: "14px" },
                        color: (theme) => theme.palette.text.primary,
                      }}
                    >
                      {t("NTN Certificate")}
                    </Typography>
                    <Typography
                      fontSize="12px"
                      sx={{
                        color: (theme) => theme.palette.neutral[400],
                      }}
                    >
                      ({t("pdf, doc, jpg. File size : max 2 MB")})
                    </Typography>
                  </Stack>

                  {/* File Upload Box */}
                  <Box
                    sx={{
                      width: "100%",
                      minHeight: "120px",
                      position: "relative",
                    }}
                  >
                    {tinFileToShow ? (
                      <Box
                        sx={{
                          width: "100%",
                          border: `1px dashed ${alpha(theme.palette.neutral[400], 0.5)}`,
                          borderRadius: "8px",
                          backgroundColor: theme.palette.background.paper,
                          padding: "1rem",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            width: "100%",
                          }}
                        >
                          <DescriptionIcon
                            sx={{
                              fontSize: "2rem",
                              color: alpha(theme.palette.neutral[600], 0.5),
                            }}
                          />
                          <Stack spacing={0.25} sx={{ flex: 1 }}>
                            <Typography
                              fontSize="14px"
                              fontWeight="500"
                              sx={{
                                color: theme.palette.neutral[1000],
                                wordBreak: "break-all",
                              }}
                            >
                              {tinFileToShow?.name ||
                                tinFileToShow?.file_name ||
                                tinFileToShow?.original_name ||
                                t("File selected")}
                            </Typography>
                            <Typography
                              fontSize="12px"
                              sx={{
                                color: alpha(theme.palette.neutral[600], 0.8),
                              }}
                            >
                              {t("File uploaded")}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    ) : (
                      <Box
                        component="label"
                        htmlFor="ntn-file-input"
                        sx={{
                          width: "100%",
                          border: `1px dashed ${alpha(theme.palette.neutral[400], 0.5)}`,
                          padding: "1.5rem",
                          borderRadius: "8px",
                          backgroundColor: theme.palette.background.paper,
                          cursor: "pointer",
                          transition: "all 0.2s ease-in-out",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          "&:hover": {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CloudUploadIcon
                            sx={{
                              fontSize: "2rem",
                              color: alpha(theme.palette.neutral[600], 0.6),
                            }}
                          />
                          <Typography
                            fontSize="12px"
                            sx={{
                              color: theme.palette.neutral[600],
                              fontWeight: 400,
                            }}
                          >
                            {t("Select file here")}
                          </Typography>
                        </Stack>
                      </Box>
                    )}
                    <input
                      id="ntn-file-input"
                      type="file"
                      hidden
                      accept=".pdf, .doc, .docx, .jpeg, .jpg, .png"
                      onChange={(e) => {
                        const selected = e.target.files[0];
                        if (selected && selected.size < 1024 * 1024 * 2) {
                          setFile(selected);
                          imageOnchangeHandlerForTinImage(selected);
                          singleFileUploadHandlerForTinFile(selected);
                          if (selected.type.startsWith("image/")) {
                            const imageUrl = URL.createObjectURL(selected);
                            setPreview(imageUrl);
                          } else {
                            setPreview(null);
                          }
                        }
                      }}
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CustomStackFullWidth>
        </CustomStackFullWidth>
      </Grid>
    </CustomStackFullWidth>
  );
};
export default RestaurantDetailsForm;
