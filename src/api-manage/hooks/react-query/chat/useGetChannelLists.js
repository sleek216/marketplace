import { useQuery } from "react-query";

import MainApi from "../../../MainApi";
import { get_channel_list } from "../../../ApiRoutes";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";
import { getToken, hasValidAuthToken } from "helper-functions/getToken";
import { sanitizeChannelListData } from "utils/chatUnread";

/** Poll inbox list app-wide so navbar badges stay current without a page reload. */
const CHAT_CHANNEL_LIST_POLL_MS =
  Number(process.env.NEXT_PUBLIC_CHAT_CHANNEL_POLL_MS) || 8000;

const getData = async () => {
  const { data } = await MainApi.get(`${get_channel_list}`);
  return data;
};

const handleChannelListError = (error) => {
  if (error?.response?.status === 401 && !hasValidAuthToken(getToken())) {
    return;
  }
  onErrorResponse(error);
};

export const useGetChannelList = (handleRequestOnSuccess, options = {}) => {
  const { enabled = true, currentUserId } = options;
  return useQuery(["get_channel_list"], () => getData(), {
    enabled,
    staleTime: 0,
    cacheTime: 30 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    refetchInterval: enabled ? CHAT_CHANNEL_LIST_POLL_MS : false,
    refetchIntervalInBackground: true,
    select: (data) => sanitizeChannelListData(data, currentUserId),
    onSuccess: handleRequestOnSuccess,
    onError: handleChannelListError,
  });
};
