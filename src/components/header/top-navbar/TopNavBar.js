import {
	Badge,
	Box,
	Divider,
	IconButton,
	NoSsr,
	Stack,
	Typography,
	useMediaQuery,
	alpha,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { CustomStackForLoaction } from "../NavBar.style";
import AddressReselect from "./address-reselect/AddressReselect";
import PartnerAppsDropdown from "./PartnerAppsDropdown";
import CustomLanguage from "./language/CustomLanguage";
import ManageSearch from "../second-navbar/ManageSearch";

import { useSelector } from "react-redux";
import CustomContainer from "../../container";
import LogoSide from "../../logo/LogoSide";
import DrawerMenu from "./drawer-menu/DrawerMenu";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { useRouter } from "next/router";
import { Bell as NotificationsIcon } from "lucide-react";
import useGetCustomerNotifications from "api-manage/hooks/react-query/push-notifications/useGetCustomerNotifications";
import NotificationsPanel from "../second-navbar/NotificationsPanel";
import useMarkNotificationAsRead from "api-manage/hooks/react-query/push-notifications/useMarkNotificationAsRead";
import useMarkAllNotificationsAsRead from "api-manage/hooks/react-query/push-notifications/useMarkAllNotificationsAsRead";
import { PUSH_NOTIFICATION_EVENT } from "components/PushNotificationLayout";
import { OPEN_AUTH_MODAL_EVENT } from "../second-navbar/SecondNavbar";
import useHeaderLocation from "helper-functions/useHeaderLocation";

const TopNavBar = ({ location: locationProp }) => {
	const { configData, countryCode, language } = useSelector(
		(state) => state.configData
	);
	const router = useRouter();
	const { t } = useTranslation();
	const [openDrawer, setOpenDrawer] = useState(false);
	const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
	const [notificationTab, setNotificationTab] = useState("new");
	const location = useHeaderLocation(locationProp);
	let zoneId = undefined;
	let token = undefined;
	if (typeof window !== "undefined") {
		token = localStorage.getItem("token");
		zoneId = JSON.parse(localStorage.getItem("zoneid"));
	}
	const moduleType = getCurrentModuleType();
	const isSmall = useMediaQuery("(max-width:1180px)");
	const isMobile = useMediaQuery("(max-width:600px)");
	const showNavbarSearch =
		location && moduleType !== "rental" && moduleType !== "parcel";
	const notificationStatus = notificationTab === "new" ? "unread" : "read";
	const { data: notifications = [], refetch: refetchNotifications } =
		useGetCustomerNotifications(token, notificationStatus);
	const { data: unreadNotifications = [], refetch: refetchUnreadNotifications } =
		useGetCustomerNotifications(token, "unread");
	const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();
	const { mutate: markAllNotificationsAsRead, isLoading: markAllLoading } =
		useMarkAllNotificationsAsRead();
	const unreadNotificationsCount = unreadNotifications?.length;
	const notificationsBadgeCount =
		unreadNotificationsCount > 0
			? unreadNotificationsCount
			: null;
	const handleNotificationClick = (notification) => {
		const data = notification?.data || {};
		const type = data?.type;
		const orderId = data?.order_id;
		const conversationId = data?.conversation_id;
		const senderType = data?.sender_type;
		if (Number(notification?.status) === 1 && notification?.id) {
			markNotificationAsRead(notification?.id, {
				onSettled: () => {
					refetchNotifications();
					refetchUnreadNotifications();
				},
			});
		}
		setNotificationDrawerOpen(false);
		if (!token) {
			window.dispatchEvent(new Event(OPEN_AUTH_MODAL_EVENT));
			return;
		}
		if (type === "message" && conversationId) {
			router.push(
				{
					pathname: "/profile",
					query: {
						page: "inbox",
						conversationId,
						type: senderType || "admin",
						chatFrom: "true",
					},
				},
				undefined,
				{ shallow: true }
			);
			return;
		}
		if (type === "order_status" && orderId) {
			router.push(
				{
					pathname: "/profile",
					query: { page: "my-orders", orderId, from: "notification" },
				},
				undefined,
				{ shallow: true }
			);
			return;
		}
		if (type === "add_fund") {
			router.push(
				{ pathname: "/profile", query: { page: "wallet" } },
				undefined,
				{ shallow: true }
			);
			return;
		}
		router.push(
			{ pathname: "/profile", query: { page: "profile-settings" } },
			undefined,
			{ shallow: true }
		);
	};
	useEffect(() => {
		const onPushNotification = (event) => {
			refetchNotifications();
			refetchUnreadNotifications();
			// Backend list can lag behind push momentarily; retry once for reliability.
			setTimeout(() => {
				refetchNotifications();
				refetchUnreadNotifications();
			}, 1200);
		};
		window.addEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
		return () => {
			window.removeEventListener(PUSH_NOTIFICATION_EVENT, onPushNotification);
		};
	}, [refetchNotifications, refetchUnreadNotifications]);
	const handleMarkAllNotificationsRead = () => {
		markAllNotificationsAsRead(undefined, {
			onSuccess: () => {
				setNotificationTab("read");
			},
			onSettled: () => {
				refetchNotifications();
				refetchUnreadNotifications();
			},
		});
	};

	return (
		<>
			<NoSsr>
				<Box
					sx={{
						width: "100%",
						background: (theme) =>
							theme.palette.mode === "dark"
								? theme.palette.background.paper
								: alpha(theme.palette.primary.main, 0.025),
						borderBottom: (theme) =>
							`1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
					}}
				>
					<CustomContainer>
						{!isSmall && (
							<Box sx={{ borderRadius: "0" }}>
								<Stack
									py="5px"
									width="100%"
									minHeight="34px"
									direction="row"
									justifyContent="space-between"
									alignItems="center"
								>
									<CustomStackForLoaction direction="row">
										<AddressReselect
											setOpenDrawer={setOpenDrawer}
											location={location}
										/>
									</CustomStackForLoaction>
									<Stack
										direction="row"
										justifyContent="end"
										alignItems="center"
										divider={
											<Divider
												orientation="vertical"
												flexItem
												sx={{
													my: "6px",
													borderColor: (theme) =>
														alpha(theme.palette.primary.main, 0.2),
												}}
											/>
										}
										sx={{ "& > *:not(hr)": { px: 1.25 } }}
									>
										<Typography
											onClick={() => router.push("/help-and-support")}
											sx={{
												fontSize: "13px",
												fontWeight: 600,
												color: (theme) => theme.palette.neutral[1000],
												cursor: "pointer",
												whiteSpace: "nowrap",
												transition: "color 0.2s",
												"&:hover": { color: "primary.main" },
											}}
										>
											{t("Help & Support")}
										</Typography>
										<Typography
											onClick={() => router.push("/about-us")}
											sx={{
												fontSize: "13px",
												fontWeight: 600,
												color: (theme) => theme.palette.neutral[1000],
												cursor: "pointer",
												whiteSpace: "nowrap",
												transition: "color 0.2s",
												"&:hover": { color: "primary.main" },
											}}
										>
											{t("About Us")}
										</Typography>
										<Typography
											onClick={() => router.push("/track-order")}
											sx={{
												fontSize: "13px",
												fontWeight: 600,
												color: (theme) => theme.palette.neutral[1000],
												cursor: "pointer",
												whiteSpace: "nowrap",
												transition: "color 0.2s",
												"&:hover": { color: "primary.main" },
											}}
										>
											{moduleType === "rental"
												? t("Track Trip")
												: t("Track Order")}
										</Typography>
										<Typography
											onClick={() => router.push("/store-registration")}
											sx={{
												fontSize: "13px",
												fontWeight: 600,
												color: (theme) => theme.palette.neutral[1000],
												cursor: "pointer",
												whiteSpace: "nowrap",
												transition: "color 0.2s",
												"&:hover": { color: "primary.main" },
											}}
										>
											{t("Become a Seller")}
										</Typography>
										<Typography
											onClick={() => router.push("/deliveryman-registration")}
											sx={{
												fontSize: "13px",
												fontWeight: 600,
												color: (theme) => theme.palette.neutral[1000],
												cursor: "pointer",
												whiteSpace: "nowrap",
												transition: "color 0.2s",
												"&:hover": { color: "primary.main" },
											}}
										>
											{t("Become a Rider")}
										</Typography>
										<PartnerAppsDropdown />
										<CustomLanguage
											countryCode={countryCode}
											language={language}
											noText
										/>
									</Stack>
								</Stack>
							</Box>
						)}

						{isSmall && (
							<Stack spacing={isMobile ? 0.45 : 0.75} py={isMobile ? 0.35 : 0.6}>
								<Stack
									direction="row"
									alignItems="center"
									justifyContent="space-between"
								>
									<CustomStackForLoaction direction="row" sx={{ minWidth: 0 }}>
										<AddressReselect
											setOpenDrawer={setOpenDrawer}
											location={location}
										/>
									</CustomStackForLoaction>
									<Stack direction="row" spacing={1} alignItems="center">
										<PartnerAppsDropdown />
										<CustomLanguage
											countryCode={countryCode}
											language={language}
											noText
										/>
									</Stack>
								</Stack>

								<Stack
									direction="row"
									alignItems="center"
									spacing={isMobile ? 0.55 : 1}
									sx={{ minWidth: 0 }}
								>
									<Box
										onClick={() => router.push("/")}
										sx={{
											display: "inline-flex",
											alignItems: "center",
											cursor: "pointer",
											flexShrink: 0,
										}}
									>
										<LogoSide
											width={isMobile ? "106px" : "122px"}
											height={isMobile ? "34px" : "42px"}
											configData={configData}
										/>
									</Box>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										{showNavbarSearch && (
											<ManageSearch
												zoneid={zoneId}
												query={router.query}
												searchQuery={
													router.query?.data_type === "searched"
														? router.query.search
														: ""
												}
												compact={isMobile}
											/>
										)}
									</Box>
									<IconButton
										onClick={() => setNotificationDrawerOpen(true)}
										sx={{
											width: isMobile ? 30 : 34,
											height: isMobile ? 30 : 34,
											color: (theme) => theme.palette.primary.main,
											flexShrink: 0,
										}}
									>
										<Badge
											color="primary"
											badgeContent={notificationsBadgeCount}
											showZero={false}
										>
											<NotificationsIcon size={isMobile ? 17 : 18} />
										</Badge>
									</IconButton>
									<DrawerMenu
										setToggled={() => {}}
										openDrawer={openDrawer}
										setOpenDrawer={setOpenDrawer}
									/>
								</Stack>
							</Stack>
						)}
					</CustomContainer>
				</Box>
				<NotificationsPanel
					open={notificationDrawerOpen}
					onClose={() => setNotificationDrawerOpen(false)}
					notifications={notifications}
					onNotificationClick={handleNotificationClick}
					activeTab={notificationTab}
					onTabChange={setNotificationTab}
					onMarkAllRead={handleMarkAllNotificationsRead}
					markAllLoading={markAllLoading}
				/>
			</NoSsr>
		</>
	);
};

export default TopNavBar;
