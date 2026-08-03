import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { customer_notifications_mark_all_as_read_api } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const postHandler = async () => {
  const { data } = await MainApi.post(customer_notifications_mark_all_as_read_api);
  return data;
};

const useMarkAllNotificationsAsRead = () => {
  return useMutation("mark-all-notifications-as-read", postHandler, {
    onError: onSingleErrorResponse,
  });
};

export default useMarkAllNotificationsAsRead;

