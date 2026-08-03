import { useMutation } from "react-query";
import MainApi from "api-manage/MainApi";
import { customer_notifications_mark_as_read_api } from "api-manage/ApiRoutes";
import { onSingleErrorResponse } from "api-manage/api-error-response/ErrorResponses";

const postHandler = async (notificationId) => {
  const id = Number(notificationId);
  const payload = {
    notification_ids: [id],
  };
  const { data } = await MainApi.post(customer_notifications_mark_as_read_api, payload);
  return data;
};

const useMarkNotificationAsRead = () => {
  return useMutation("mark-notification-as-read", postHandler, {
    onError: onSingleErrorResponse,
  });
};

export default useMarkNotificationAsRead;

