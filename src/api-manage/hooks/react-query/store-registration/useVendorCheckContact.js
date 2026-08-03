import { useMutation } from "react-query";
import { vendor_check_contact_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";

const postCheckContact = async ({ email, phone }) => {
  const { data } = await MainApi.post(vendor_check_contact_api, {
    email,
    phone,
  });
  return data;
};

export const useVendorCheckContact = () =>
  useMutation("vendor-check-contact", postCheckContact);
