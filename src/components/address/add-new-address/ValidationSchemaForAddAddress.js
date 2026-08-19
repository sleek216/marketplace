import React from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";

const ValidationSchemaForAddAddress = () => {
  const { t } = useTranslation();
  return Yup.object({
    address: Yup.string().required(t("Address is required")),
    contact_person_name: Yup.string().required(t("Name is required")),
    contact_person_number: Yup.string().required(t("Phone Number is required")),
    contact_person_email: Yup.string()
      .email(t("Must be a valid email"))
      .when("contact_person_name", {
        is: () =>
          typeof window !== "undefined" && !localStorage.getItem("token"),
        then: (schema) => schema.required(t("Email is required")),
        otherwise: (schema) => schema.nullable(),
      }),
  });
};
export default ValidationSchemaForAddAddress;
