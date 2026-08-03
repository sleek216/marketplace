import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { isCompletePhoneNumber } from "utils/CustomFunctions";

const ValidationSechemaProfile = (requirePasswordFields = false) => {
  const { t } = useTranslation();
  const baseFields = {
    name: Yup.string().trim().required(t("name is required")),
    phone: Yup.string()
      .required(t("phone number required"))
      .test(
        "complete-phone",
        t("phone number required"),
        (value) => isCompletePhoneNumber(value)
      ),
    email: Yup.string()
      .trim()
      .email(t("Must be a valid email"))
      .max(255)
      .required(t("Email is required")),
  };
  if (requirePasswordFields) {
    return Yup.object({
      ...baseFields,
      password: Yup.string()
        .min(6, t("Password must be at least 6 characters"))
        .required(t("Password is required")),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], t("Passwords must match"))
        .required(t("Confirm password is required")),
    });
  }
  return Yup.object(baseFields);
};

export default ValidationSechemaProfile;