import React, { useEffect, useRef, useState } from "react";
import {
  alpha,
  Button,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import ValidationSechemaProfile from "./Validation";
import IconButton from "@mui/material/IconButton";
import toast from "react-hot-toast";
import { useDeleteProfile } from "api-manage/hooks/react-query/profile/useDeleteProfile";
import { useRouter } from "next/router";
import ImageUploaderWithPreview from "../../single-file-uploader-with-preview/ImageUploaderWithPreview";
import useUpdateProfile from "../../../api-manage/hooks/react-query/profile/useUpdateProfile";
import {
  onErrorResponse,
  onSingleErrorResponse,
} from "api-manage/api-error-response/ErrorResponses";
import { setUser } from "redux/slices/profileInfo";
import { useDispatch } from "react-redux";
import { ChevronLeft as ArrowBackIosNewIcon } from "lucide-react";
import CustomAlert from "../../alert/CustomAlert";
import FormSubmitButton from "../FormSubmitButton";
import { AlertTriangle as ReportProblemIcon } from "lucide-react";
import VerifiedIcon from "components/profile/VerifiedIcon";
import CustomModal from "components/modal";
import OtpForm from "components/auth/sign-up/OtpForm";
import { auth } from "firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useFireBaseOtpVerify } from "api-manage/hooks/react-query/forgot-password/useFIreBaseOtpVerify";
import {
  formatPhoneNumber,
  formatPhoneNumberForApi,
  isCompletePhoneNumber,
  isVerificationFlagOn,
} from "utils/CustomFunctions";
import CustomPhoneInput from "components/custom-component/CustomPhoneInput";
import { getLanguage } from "helper-functions/getLanguage";

export const BackIconButton = styled(IconButton)(({ theme }) => ({
  padding: "10px",
  borderRadius: "4px",
  justifyContent: "center",
  fontSize: "13px",
  color: theme.palette.primary.main,
}));
export const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: "5px",
  borderColor: theme.palette.neutral[400],
  color: theme.palette.neutral[400],
  marginRight: "5px",
  paddingInline: "30px",
}));

export const convertValuesToFormData = (
  values,
  resData,
  verificationId,
  options = {}
) => {
  const { omitPassword = false } = options;
  const { name, phone, email, image, button_type, reset_token, password } =
    values;
  let formData = new FormData();
  if (values?.reset_token) {
    formData.append("name", name ?? resData?.name);
    // formData.append('l_name', l_name ?? resData?.l_name)
    formData.append(
      "phone",
      resData?.verification_on === "email"
        ? formatPhoneNumberForApi(resData?.phone)
        : formatPhoneNumberForApi(phone ?? resData?.phone)
    );
    formData.append("email", email ?? resData?.email);
    formData.append("image", image ?? resData?.image ?? resData?.image);
    formData.append("button_type", button_type ?? resData?.button_type);
    formData.append("otp", reset_token ? reset_token : null);
    formData.append(
      "verification_medium",
      reset_token ? resData?.verification_medium : null
    );
    formData.append(
      "verification_on",
      reset_token ? resData?.verification_on : null
    );
    formData.append("session_info", verificationId);
  } else {
    formData.append("name", name ?? resData?.name);
    formData.append("phone", formatPhoneNumberForApi(phone ?? resData?.phone));
    formData.append("email", email ?? resData?.email);
    formData.append("image", image ?? resData?.image ?? resData?.image);
    if (button_type) {
      formData.append("button_type", button_type);
    } else if (resData?.button_type) {
      formData.append("button_type", resData.button_type);
    }

    if (!omitPassword) {
      formData.append("password", password ?? resData?.password);
    }
  }
  return formData;
};
const BasicInformationForm = ({
  data,
  configData,
  t,
  refetch,
  setEditProfile,
  formSubmit,
  handleCloseEmail,
  handleClosePhone,
  handleClick,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openEmail, setOpenEmail] = React.useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [resData, setResData] = React.useState([]);
  const [loginValue, setLoginValue] = useState(null);
  const recaptchaWrapperRef = useRef(null);
  const imageContainerRef = useRef();
  const { f_name, l_name, phone, email, image_full_url } = data;
  const lanDirection = getLanguage() ? getLanguage() : "ltr";
  const customerImageUrl = configData?.base_urls?.customer_image_url;
  const dispatch = useDispatch();
  const profileFormik = useFormik({
    initialValues: {
      name: f_name ? `${f_name} ${l_name ? l_name : ""}` : "",
      email: email ? email : "",
      phone: phone ? formatPhoneNumber(phone) : "",
      image: image_full_url ? image_full_url : "",
    },
    validationSchema: ValidationSechemaProfile(false),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      const nameOk = Boolean(values.name?.trim());
      const emailOk = Boolean(values.email?.trim());
      const phoneOk = isCompletePhoneNumber(values.phone);
      if (!nameOk || !emailOk || !phoneOk) {
        helpers.setTouched({
          name: true,
          email: true,
          phone: true,
        });
        return;
      }
      try {
        formSubmitOnSuccess(values);
      } catch (err) { }
    },
  });
  const isUpdateDisabled =
    !profileFormik.values.name?.trim() ||
    !profileFormik.values.email?.trim() ||
    !isCompletePhoneNumber(profileFormik.values.phone);
  const { mutate: fireBaseOtpMutation, isLoading: fireIsLoading } =
    useFireBaseOtpVerify();
  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-update",
        {
          size: "invisible",
          callback: (response) => {
            // console.log("Recaptcha verified", response);
          },
          "expired-callback": () => {
            window.recaptchaVerifier?.reset();
          },
        },
        auth
      );
    } else {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
      // setUpRecaptcha()
    }
  };

  useEffect(() => {
    setUpRecaptcha();
    return () => {
      if (recaptchaWrapperRef.current) {
        //recaptchaWrapperRef.current.clear(); // Clear Recaptcha when component unmounts
        recaptchaWrapperRef.current = null;
      }
    };
  }, []);
  const sendOTP = (response, values) => {
    const phoneNumber = formatPhoneNumberForApi(values?.phone);
    if (!phoneNumber) {
      console.error("Invalid phone number");
      return;
    }

    if (!window.recaptchaVerifier) {
      setUpRecaptcha();
    }
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setOpen(true);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const { mutate: profileUpdateByMutate, isLoading } = useUpdateProfile();

  const formSubmitOnSuccess = (values) => {
    const onSuccessHandler = (response) => {
      if (response) {
        setResData({
          ...resData,
          ...response,
          name: values?.name,
          // l_name: l_name,
          phone: values?.phone,
          email: values?.email,
          image: values?.image,
          button_type: values?.button_type,
        });
        if (response?.otp_send) {
          if (response?.verification_on === "phone") {
            if (configData?.firebase_otp_verification === 1) {
              sendOTP(response, values);
            } else {
              setOpen(true);
            }
          } else {
            setOpenEmail(true);
          }
        } else {
          setOpenEmail(false);
          setOpen(false);
          toast.success(response?.message);
          refetch();
          handleClick();
        }
      }
    };

    const formData = convertValuesToFormData(values, resData, verificationId, {
      omitPassword: true,
    });
    profileUpdateByMutate(formData, {
      onSuccess: onSuccessHandler,
      onError: (error) => {
        if (Array.isArray(error?.response?.data?.errors)) {
          return onErrorResponse(error);
        } else {
          toast.error(error?.response?.data?.message);
        }
      },
    });
  };
  const singleFileUploadHandlerForImage = (value) => {
    profileFormik.setFieldValue("image", value.currentTarget.files[0]);
  };
  const imageOnchangeHandlerForImage = (value) => {
    profileFormik.setFieldValue("image", value);
  };
  const router = useRouter();
  const onSuccessHandlerForUserDelete = (res) => {
    if (res?.errors) {
      toast.error(res?.errors?.[0]?.message);
    } else {
      localStorage.removeItem("token");
      toast.success(t("Account has been deleted"));
      dispatch(setUser(null));
      router.push("/", undefined, { shallow: true });
    }
    setOpenModal(false);
  };
  const { mutate, isLoading: isLoadingDelete } = useDeleteProfile(
    onSuccessHandlerForUserDelete
  );
  const deleteUserHandler = () => {
    mutate();
  };

  const handleReset = () => {
    const name = f_name ? `${f_name} ${l_name ? l_name : ""}` : "";
    profileFormik.setFieldValue("name", name ? name : "");
    profileFormik.setFieldValue("l_name", name ? name : "");
    profileFormik.setFieldValue("email", email ? email : "");
    profileFormik.setFieldValue(
      "phone",
      phone ? formatPhoneNumber(phone) : ""
    );
  };
  const phoneHandler = (value) => {
    profileFormik.setFieldValue("phone", formatPhoneNumber(value));
  };
  const handleVerified = (type) => {
    if (type === "email") {
      formSubmitOnSuccess({ ...profileFormik?.values, button_type: "email" });
    } else {
      formSubmitOnSuccess({ ...profileFormik?.values, button_type: "phone" });
    }
  };
  return (
    <>
      <Grid item md={12} xs={12} alignSelf="center">
        <div ref={recaptchaWrapperRef}>
          <div id="recaptcha-update"></div>
        </div>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle2" fontWeight="700">
            {t("Edit Personal Details")}
          </Typography>
          <BackIconButton onClick={() => setEditProfile(false)}>
            <ArrowBackIosNewIcon
              sx={{
                fontSize: "10px",
                color: (theme) => theme.palette.primary.main,
                fontWeight: "700",
                marginRight: "3px",
              }}
            />
            {t("Go Back")}
          </BackIconButton>
        </Stack>
      </Grid>
      <form noValidate onSubmit={profileFormik.handleSubmit}>
        <Grid
          container
          md={12}
          xs={12}
          spacing={{ xs: 2, sm: 2, md: 3 }}
          paddingRight={{ xs: "0px", md: "60px" }}
          paddingLeft={{ xs: "0px", md: "60px" }}
          marginLeft="0px"
        >
          <Grid item md={12} xs={12} textAlign="-webkit-center">
            <Stack
              sx={{
                position: "relative",
                width: "140px",
                borderRadius: "50%",
              }}
            >
              <ImageUploaderWithPreview
                type="file"
                labelText={t("Upload your photo")}
                hintText="Image format - jpg, png, jpeg, gif Image Size - maximum size 2 MB Image Ratio - 1:1"
                file={profileFormik.values.image}
                onChange={singleFileUploadHandlerForImage}
                imageOnChange={imageOnchangeHandlerForImage}
                width="8.125rem"
                // imageUrl={customerImageUrl}
                borderRadius="50%"
                objectFit
              //height='140px'
              />
            </Stack>
          </Grid>
          <Grid item md={12} xs={12}>
            <TextField
              sx={{ width: "100%" }}
              InputProps={{
                style: {
                  height: "45px", // Set your desired height value here
                },
              }}
              id="outlined-basic"
              variant="outlined"
              name="name"
              value={profileFormik.values.name}
              onChange={profileFormik.handleChange}
              label={t("User Name")}
              required
              error={
                profileFormik.touched.name && Boolean(profileFormik.errors.name)
              }
              helperText={
                profileFormik.touched.name && profileFormik.errors.name
              }
              touched={profileFormik.touched.name && "true"}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack position="relative">
              <TextField
                sx={{ width: "100%" }}
                InputProps={{
                  style: {
                    height: "45px", // Set your desired height value here
                  },
                }}
                id="outlined-basic"
                // label="Enter Email"
                variant="outlined"
                name="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                label={t("Email")}
                required
                error={
                  profileFormik.touched.email &&
                  Boolean(profileFormik.errors.email)
                }
                helperText={
                  profileFormik.touched.email && profileFormik.errors.email
                }
                touched={profileFormik.touched.email && "true"}
              />
              <Stack
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "12px",
                }}
              >
                <>
                  {" "}
                  {email && (
                    <>
                      {isVerificationFlagOn(data?.is_email_verified) &&
                        email === profileFormik?.values.email ? (
                        <VerifiedIcon />
                      ) : (
                        <>
                          {configData?.centralize_login
                            ?.email_verification_status === 1 && (
                              <Button
                                size="small"
                                onClick={() => handleVerified("email")}
                                sx={{
                                  py: 0.25,
                                  px: 1.25,
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  borderRadius: "16px",
                                  whiteSpace: "nowrap",
                                  minWidth: "auto",
                                  color: (theme) => theme.palette.error.main,
                                  border: (theme) => `1px solid ${theme.palette.error.main}`,
                                  backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                                  "&:hover": {
                                    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.16),
                                  },
                                }}
                              >
                                {t("Verify")}
                              </Button>
                            )}
                        </>
                      )}
                    </>
                  )}
                </>
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={6} xs={12}>
            <Stack position="relative">
              <CustomPhoneInput
                initCountry={configData?.country}
                value={profileFormik.values.phone}
                onHandleChange={phoneHandler}
                touched={profileFormik.touched.phone}
                errors={profileFormik.errors.phone}
                lanDirection={lanDirection}
                height="45px"
                alignWithMuiField
                required
                disabled={data?.is_phone_verified === 1}
                specialLabel={
                  data?.is_phone_verified === 1 ? (
                    <span>
                      {t("Phone")}{" "}
                      <span style={{ color: "red" }}>
                        ({t("Not Changeable")})
                      </span>
                    </span>
                  ) : undefined
                }
              />
              <Stack
                sx={{
                  position: "absolute",
                  right: "10px",
                  top: "39px",
                }}
              >
                {data?.is_phone_verified === 1 ? (
                  <VerifiedIcon />
                ) : (
                  <>
                    {configData?.centralize_login?.phone_verification_status ===
                      1 && (
                        <Button
                          size="small"
                          onClick={() => handleVerified("phone")}
                          sx={{
                            py: 0.25,
                            px: 1.25,
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: "16px",
                            whiteSpace: "nowrap",
                            minWidth: "auto",
                            color: (theme) => theme.palette.error.main,
                            border: (theme) => `1px solid ${theme.palette.error.main}`,
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                            "&:hover": {
                              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.16),
                            },
                          }}
                        >
                          {t("Verify")}
                        </Button>
                      )}
                  </>
                )}
              </Stack>
            </Stack>
          </Grid>
          <Grid item md={12} xs={12} align="end">
            <FormSubmitButton
              handleReset={handleReset}
              isLoading={isLoading}
              disabled={isUpdateDisabled}
              reset={t("Reset")}
              submit={t("Update Profile")}
            />
          </Grid>
        </Grid>
      </form>
      {open && (
        <CustomModal
          openModal={open}
          handleClose={() => setOpen(false)}
          setModalOpen={setOpen}
        >
          <OtpForm
            data={data?.phone}
            handleClose={() => setOpen(false)}
            formSubmitHandler={formSubmitOnSuccess}
            loginValue={resData}
            reSendOtp={formSubmitOnSuccess}
          />
        </CustomModal>
      )}
      {openEmail && (
        <CustomModal
          handleClose={() => setOpenEmail(false)}
          openModal={openEmail}
          setModalOpen={setOpenEmail}
        >
          <OtpForm
            data={profileFormik?.values.email}
            handleClose={() => setOpenEmail(false)}
            formSubmitHandler={formSubmitOnSuccess}
            loginValue={resData}
            reSendOtp={formSubmitOnSuccess}
          />
        </CustomModal>
      )}
    </>
  );
};
export default BasicInformationForm;
