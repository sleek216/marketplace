import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
	CustomBoxFullWidth,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import ChatSideBar from "./ChatSideBar";
import ChatView from "./ChatView";
import { alpha, Box, Stack } from "@mui/material";
import EmptyView from "./EmptyView";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import ConversationInfoTop from "./ConversationInfoTop";
import LoadingBox from "./LoadingBox";
import { useGetChannelList } from "api-manage/hooks/react-query/chat/useGetChannelLists";
import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useGetConversation } from "api-manage/hooks/react-query/chat/useGetConversation";
import { useStoreMessage } from "api-manage/hooks/react-query/chat/useStoreMessage";
import {
	CHAT_CONVERSATION_ACTIVE_EVENT,
	CHAT_MESSAGE_SENT_EVENT,
} from "hooks/useChatUnreadBadge";
import { useSearchList } from "api-manage/hooks/react-query/chat/useSearch";
import PushNotificationLayout from "../PushNotificationLayout";
import { useTranslation } from "react-i18next";
import { getAdminAvatarUrl } from "utils/chatAvatar";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import {
	conversationMatchesKey,
	getProfileUserId,
	markConversationMessageSent,
	sanitizeChannelListData,
} from "utils/chatUnread";
import {
	findChannelConversation,
	getConversationPartnerName,
	mergeConversationFromDetails,
} from "utils/chatDisplayName";

const Chatting = ({
	configData,
	drawerMode = false,
	profileEmbed = false,
	initialConversationId = null,
	initialSenderType = null,
}) => {
	const theme = useTheme();
	const [page_limit, setPageLimit] = useState(10);
	const [offset, setOffset] = useState(1);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [channelId, setChannelId] = useState(null);
	const [searchResults, setSearchResults] = useState(null);
	const [messagesData, setMessagesData] = useState([]);
	const [apiFor, setApiFor] = useState("conversation_id");
	const [receiverType, setReceiverType] = useState();
	const [receiverName, setReceiverName] = useState();
	const [receiverId, setReceiverId] = useState();
	const [searchValue, setSearchValue] = useState("");
	const [receiver, setReceiver] = useState();
	const [receiverImage, setReceiverImage] = useState();
	const [userType, setUserType] = useState("");
	const [resetState, setResetState] = useState(false);
	const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
	const mdDown = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const router = useRouter();
	const queryClient = useQueryClient();
	const { profileInfo } = useSelector((state) => state.profileInfo);
	const currentUserId = getProfileUserId(profileInfo);
	const {
		id,
		type,
		routeName,
		conversationId,
		chatFrom,
		deliveryman_name,
		deliveryManData_image,
		text,
		orderId,
	} = router.query;
	const [deliveryInfo, setDeliveryInfo] = useState({});
	//const { configData } = useSelector((state) => state.configDataSettings);
	const [scrollBottom, setScrollBottom] = useState(true);

	useEffect(() => {
		setDeliveryInfo({
			name: deliveryman_name,
			image: deliveryManData_image,
		});
	}, [deliveryman_name]);

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false);
	};
	const handleToggleSidebar = () => {
		setIsSidebarOpen((prevState) => !prevState);
	};
	const {
		data: channelData,
		refetch: refetchChannelList,
		isFetched,
		isLoading: channelListLoading,
	} = useGetChannelList(undefined, { currentUserId });

	const channelList = useMemo(
		() => searchResults ?? channelData?.conversations ?? [],
		[searchResults, channelData]
	);

	const channelLoading =
		channelListLoading && !(channelData?.conversations?.length > 0);

	const clearConversationUnreadInCache = useCallback(
		(activeKey, sentText) => {
			queryClient.setQueryData(["get_channel_list"], (old) => {
				if (!old?.conversations) return old;

				return {
					...old,
					conversations: old.conversations.map((conv) => {
						if (!conversationMatchesKey(conv, activeKey)) return conv;

						return {
							...conv,
							unread_message_count: 0,
							last_message: {
								...(conv.last_message || {}),
								message: sentText ?? conv.last_message?.message,
								sender_type: "customer",
								sender_id:
									currentUserId ?? conv.last_message?.sender_id,
							},
						};
					}),
				};
			});
		},
		[queryClient, currentUserId]
	);

	const buildActiveConversationKey = useCallback(() => {
		if (!channelId) return null;
		return {
			conversationId:
				channelId === "admin" ? receiver?.id ?? channelId : channelId,
			receiverType: receiverType,
		};
	}, [channelId, receiver?.id, receiverType]);

	// Auto-open a specific conversation when opened from a toast notification
	useEffect(() => {
		if (!initialConversationId || !isFetched) return;
		const convId = String(initialConversationId);
		const senderType = initialSenderType || "vendor";
		if (senderType === "admin") {
			setApiFor("admin_id");
			setChannelId("admin");
		} else {
			setApiFor("conversation_id");
			setChannelId(convId);
		}
		setReceiverType(senderType);
		setScrollBottom(true);
		setIsSidebarOpen(drawerMode ? true : false);
		setResetState(true);
	}, [initialConversationId, initialSenderType, isFetched]);

	const {
		data,
		isSuccess,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
		isRefetching: conversationDataRefetching,
		hasPreviousPage,
	} = useGetConversation({ channelId, apiFor, page_limit, offset });

	// from notification

	useEffect(() => {
		if (type) {
			setReceiverType(type);
		}
		if (conversationId) {
			setChannelId(conversationId);
			setScrollBottom(true);
			const tempReceiver =
				channelList.length !== 0 &&
				channelList.filter((item) => item.id == conversationId);
			setReceiver(tempReceiver[0]);
		}
		if (type === "admin") {
			setReceiverId(conversationId);
		} else {
			setReceiverId(null);
		}
	}, [conversationId, channelList, type]);

	//from pages
	useEffect(() => {
		if (id && routeName && type) {
			const tempReceiver =
				channelList.length !== 0 &&
				channelList.filter((item) => {
					if (type === "vendor") {
						return item?.receiver?.vendor_id == id;
					} else if (type === "delivery_man") {
						return item?.sender?.deliveryman_id == id;
					}
				});
			setReceiver(tempReceiver[0]);
			setReceiverImage(tempReceiver[0]?.receiver?.image_full_url);
			setChannelId(id);
			setReceiverId(id);
			setReceiverType(type);
			setApiFor(routeName);
			setIsSidebarOpen(false);
			if (type !== "admin") {
				setUserType(type);
			}
			setResetState(true);
		}
	}, [id, type, routeName, chatFrom, channelList, deliveryManData_image]);

	useEffect(() => {
		setMessagesData([data]);
	}, [data]);

	// Prefer fresh store/vendor names from conversation details + channel list polls.
	useEffect(() => {
		const details = data?.pages?.[0]?.conversation;
		if (!details || !channelId) return;

		setReceiver((prev) => mergeConversationFromDetails(prev, details));
	}, [data, channelId]);

	useEffect(() => {
		if (!channelId) return;

		const freshChannel = findChannelConversation(channelList, {
			channelId,
			receiverType,
		});
		if (!freshChannel) return;

		setReceiver((prev) => mergeConversationFromDetails(prev, freshChannel));
	}, [channelList, channelId, receiverType]);
	const handleChannelOnClick = async (value) => {
		setReceiverId(null);
		await refetchChannelList();
		if (value.receiver_type === "admin") {
			setApiFor("admin_id");
			setChannelId("admin");
			setScrollBottom(true);
			setReceiverType(value.receiver_type);
			// setReceiverName(configData.business_name);
			setReceiverImage(value?.receiver?.image_full_url);
			setReceiver(value);
			setIsSidebarOpen(drawerMode ? true : false);
		} else {
			setApiFor("conversation_id");
			setChannelId(value.id);
			setScrollBottom(true);
			setReceiverType(value.receiver_type);
			setReceiverName(getConversationPartnerName(value, configData));
			setReceiverImage(value?.receiver?.image_full_url);
			setReceiver(value);
			setIsSidebarOpen(drawerMode ? true : false);
		}
		setDeliveryInfo(null);
		mdDown && !drawerMode && setIsSidebarOpen(false);
		setResetState(true);
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		if (!channelId) {
			window.dispatchEvent(
				new CustomEvent(CHAT_CONVERSATION_ACTIVE_EVENT, { detail: null })
			);
			return;
		}

		const activeKey = buildActiveConversationKey();
		clearConversationUnreadInCache(activeKey);
		window.dispatchEvent(
			new CustomEvent(CHAT_CONVERSATION_ACTIVE_EVENT, { detail: activeKey })
		);
	}, [
		channelId,
		receiverType,
		receiver?.id,
		buildActiveConversationKey,
		clearConversationUnreadInCache,
	]);

	const { mutate: storeMessageByMutate, isLoading: isLoadingMessageSend } =
		useStoreMessage();
	const handleChatMessageSend = (values) => {
		let newValues = {
			receiver_type: receiverType,
			id: channelId,
			receiverId,
			...values,
		};
		const activeKey = buildActiveConversationKey();

		const handleSuccess = async (res) => {
			markConversationMessageSent(activeKey, values?.text);
			clearConversationUnreadInCache(activeKey, values?.text);
			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event(CHAT_MESSAGE_SENT_EVENT));
			}
			await refetch();
			await refetchChannelList();
			queryClient.setQueryData(["get_channel_list"], (old) =>
				sanitizeChannelListData(old, currentUserId)
			);
		};

		storeMessageByMutate(newValues, {
			onSuccess: handleSuccess,
			onError: onErrorResponse,
		});
	};

	useEffect(() => {
		if (type === "admin" && text && channelId && orderId) {
			handleChatMessageSend({ text: text, file: [], order_id: orderId });
			const { pathname, query } = router;

			const updatedQuery = { ...query, text: "" };
			router.replace({ pathname, query: updatedQuery }, undefined, {
				shallow: true,
			});
		}
	}, [type, text, channelId, orderId]);

	const handleSearchFetchOnSuccess = (res) => {
		if (res) {
			setSearchResults(res.conversations);
		}
	};
	const {
		isLoading,
		isRefetching: isRefetchingForSearch,
		refetch: searchRefetch,
	} = useSearchList(searchValue, handleSearchFetchOnSuccess);
	const searchSubmitHandler = (e) => {
		e.preventDefault();
		if (searchValue) {
			try {
				searchRefetch().then();
			} catch (err) {}
		}
	};

	const handleSearch = (values) => {
		setSearchValue(values);
	};
	const handleReset = () => {
		setSearchValue("");
		setSearchResults(null);
		refetchChannelList().then();
	};
	const handleScroll = (e) => {
		if (e.currentTarget.scrollTop === 0) {
			if (hasNextPage) {
				fetchNextPage().then();
				e.currentTarget.scrollTop = 400;
				setScrollBottom(false);
			}
		}
	};

	const ChatImageUrl = () => {
		if (receiver?.receiver_type === "vendor") {
			return receiver?.receiver?.image_full_url;
		} else if (receiver?.receiver_type === "delivery_man") {
			return receiver?.receiver?.image_full_url;
		} else return getAdminAvatarUrl(configData);
	};
	const userImage =
		receiverType === "admin"
			? getAdminAvatarUrl(configData)
			: deliveryInfo?.image_full_url
			? deliveryInfo?.image_full_url
			: receiverImage
			? receiverImage
			: deliveryManData_image;

	const { t } = useTranslation();
	const showSidebarPane = drawerMode ? true : mdDown ? isSidebarOpen : true;
	const showConversationPane = drawerMode ? true : !isSidebarOpen;
	
	return (
		<PushNotificationLayout refetch={refetch} pathName="chat">
			<CustomBoxFullWidth
				sx={{
					height: "100%",
					minHeight: 0,
					...(profileEmbed && {
						borderRadius: "2px",
						border: `1px solid ${alpha(theme.palette.divider, 0.55)}`,
						overflow: "hidden",
						bgcolor: "background.paper",
					}),
					...(drawerMode && {
						borderRadius: 0,
						overflow: "hidden",
						bgcolor: "background.paper",
					}),
				}}
				mt={
					drawerMode || profileEmbed
						? { xs: 0, md: 0 }
						: {
								xs: "0rem",
								md: "0",
								paddingInlineEnd: "0.5rem",
								paddingBlockEnd: "0.5rem",
						  }
				}
			>
				<CustomStackFullWidth spacing={1} direction="row" sx={{ height: "100%", minHeight: 0 }}>
					{mdDown ? (
						<>
							{showSidebarPane && (
								<Stack width="100%" sx={{ height: "100%", minHeight: 0 }}>
									<ChatSideBar
										onClose={handleCloseSidebar}
										embedded={drawerMode}
										profileEmbed={profileEmbed}
										handleToggleSidebar={
											handleToggleSidebar
										}
										open={isSidebarOpen}
										handleChannelOnClick={
											handleChannelOnClick
										}
										isFetched={isFetched}
										channelList={channelList}
										searchValue={searchValue}
										setSearchValue={setSearchValue}
										handleSearch={handleSearch}
										// isLoading={isLoading}
										handleReset={handleReset}
										searchSubmitHandler={
											searchSubmitHandler
										}
										channelLoading={channelLoading}
										selectedId={receiver?.id}
										chatFrom={chatFrom}
										setIsSidebarOpen={setIsSidebarOpen}
										userType={userType}
										setUserType={setUserType}
										setChannelId={setChannelId}
										configData={configData}
										setResetState={setResetState}
									/>
								</Stack>
							)}
						</>
					) : (
						<Stack
							sx={
								drawerMode
									? {
											width: { xs: "40%", md: "34%" },
											minWidth: "260px",
											maxWidth: "320px",
											flexShrink: 0,
											height: "100%",
											minHeight: 0,
									  }
									: {}
							}
						>
							<ChatSideBar
								onClose={handleCloseSidebar}
								embedded={drawerMode}
								profileEmbed={profileEmbed}
								handleToggleSidebar={handleToggleSidebar}
								open={showSidebarPane}
								handleChannelOnClick={handleChannelOnClick}
								isFetched={isFetched}
								channelList={channelList}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								handleSearch={handleSearch}
								// isLoading={isLoading}
								handleReset={handleReset}
								searchSubmitHandler={searchSubmitHandler}
								channelLoading={channelLoading}
								selectedId={receiver?.id}
								chatFrom={chatFrom}
								setIsSidebarOpen={setIsSidebarOpen}
								userType={userType}
								setUserType={setUserType}
								setChannelId={setChannelId}
								configData={configData}
								setResetState={setResetState}
							/>
						</Stack>
					)}

					<Stack
						width={mdDown ? (showSidebarPane ? "" : "100%") : "100%"}
						flex={1}
						minWidth={0}
						height="100%"
						minHeight={0}
						backgroundColor={alpha(
							theme.palette.background.default,
							0.6
						)}
						borderRadius={profileEmbed ? "0" : "0px 2px 2px 0px"}
						sx={{
							borderLeft: `1px solid ${theme.palette.neutral[200]}`,
							display: "flex",
							flexDirection: "column",
							overflow: "hidden",
						}}
					>
						{showConversationPane && resetState && (
							<Box sx={{ flexShrink: 0 }}>
								<ConversationInfoTop
									receiver={receiver}
									mdUp={mdUp}
									handleToggleSidebar={handleToggleSidebar}
									ChatImageUrl={ChatImageUrl}
									userImage={userImage}
									theme={theme}
									deliveryman_name={deliveryInfo?.name}
									deliveryManImage={deliveryInfo?.image}
									deliveryUrl={
										type === "vendor"
											? configData?.base_urls?.store_image_url
											: configData?.base_urls
													?.delivery_man_image_url
									}
									receiverType={receiverType}
									adminUser={configData?.business_name}
								/>
							</Box>
						)}

						{channelId &&
							showConversationPane &&
							resetState && (
								<ChatView
									conversationData={messagesData?.[0]?.pages}
									handleChatMessageSend={
										handleChatMessageSend
									}
									channelList={channelList}
									handleScroll={handleScroll}
									scrollBottom={scrollBottom}
									receiverType={receiverType}
									isLoadingMessageSend={isLoadingMessageSend}
									userType={userType}
									channelId={channelId}
									orderId={orderId}
									embedded={profileEmbed || drawerMode}
								/>
							)}
						{isFetchingNextPage && <LoadingBox />}

						{!channelId && (!mdDown || drawerMode) && <EmptyView />}
					</Stack>
				</CustomStackFullWidth>
			</CustomBoxFullWidth>
		</PushNotificationLayout>
	);
};
export default Chatting;
