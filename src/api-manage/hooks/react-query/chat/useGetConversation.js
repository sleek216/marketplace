import { useInfiniteQuery } from "react-query";

import { get_conversations_api } from "../../../ApiRoutes";
import MainApi from "../../../MainApi";
import { onErrorResponse } from "../../../api-error-response/ErrorResponses";

/** Backend paginates with `offset` as page number (1-based), not cursor skip. */
const CHAT_CONVERSATION_POLL_MS =
  Number(process.env.NEXT_PUBLIC_CHAT_POLL_MS) || 8000;

const getData = async (params, pageParam) => {
  const { channelId, apiFor, page_limit } = params;

  const { data } = await MainApi.get(
    `${get_conversations_api}?${apiFor}=${
      channelId === "admin" ? 0 : channelId
    }&offset=${pageParam}&limit=${page_limit}`
  );
  return data;
};

export const useGetConversation = (params) => {
  const { channelId, apiFor, page_limit } = params;
  const conversationEnabled = Boolean(
    channelId !== undefined &&
      channelId !== null &&
      `${channelId}`.length > 0 &&
      apiFor
  );

  return useInfiniteQuery(
    ["get_conversation", channelId ?? null, apiFor ?? null, page_limit],
    ({ pageParam = params.offset }) => getData(params, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.messages.length > 0 ? nextPage : undefined;
      },
      enabled: conversationEnabled,
      refetchInterval: conversationEnabled ? CHAT_CONVERSATION_POLL_MS : false,
      refetchIntervalInBackground: false,
      onError: onErrorResponse,
    }
  );
};
