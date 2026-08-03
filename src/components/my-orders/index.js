import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import NavigationButtons from "./NavigationButtons";
import { useTranslation } from "react-i18next";
import useGetMyOrdersList from "../../api-manage/hooks/react-query/order/useGetMyOrdersList";
import { useDispatch, useSelector } from "react-redux";
import {
	CustomBoxFullWidth,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import {
	Skeleton,
	useMediaQuery,
	Box,
	Chip,
	Stack as MuiStack,
} from "@mui/material";
import CustomEmptyResult from "../custom-empty-result";
import nodata from "../loyalty-points/assets/Search.svg";
import Order, { CustomPaper } from "./order";
import MultiStoreOrderGroup from "./MultiStoreOrderGroup";
import { groupOrdersByCheckoutGroup } from "helper-functions/groupOrdersByCheckoutGroup";
import CustomPagination from "../custom-pagination";
import { data_limit } from "api-manage/ApiRoutes";
import { setCurrentTab, setOrderType } from "redux/slices/utils";
import { setOrderDetailsModal } from "redux/slices/offlinePaymentData";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-hot-toast";
import useGetTrackOrderData from "../../api-manage/hooks/react-query/order/useGetTrackOrderData";
import TabsTypeOne from "../custom-tabs/TabsTypeOne";
import active from "./assets/active_image.png";
import past from "./assets/past_image.png";
import { Stack } from "@mui/system";
import { ShoppingBag } from "lucide-react";
import MainApi from "api-manage/MainApi";
import { order_details_api } from "api-manage/ApiRoutes";
import { getGuestId, getToken, hasValidAuthToken } from "helper-functions/getToken";
import {
	getOngoingStatusGroup,
	getPreviousStatusGroup,
} from "utils/orderStatus";
import ProfileSectionHeader from "../user-information/ProfileSectionHeader";

const ORDER_LIST_LOADING_TOAST_ID = "my-orders-loading";

const CustomShimmerCard = ({ reviewMode = false }) => {
	const theme = useTheme();
	const isMobilePreview = useMediaQuery(theme.breakpoints.down("sm"));
	return (
		<CustomBoxFullWidth sx={{ width: "100%", maxWidth: "100%" }}>
			{isMobilePreview ? (
				<MuiStack spacing={2} width="100%">
					{[...Array(6)].map((item, index) => (
						<CustomPaper key={index}>
							<Stack direction="row" spacing={1.25} alignItems="stretch">
								<Skeleton
									variant="rounded"
									sx={{ width: "32%", maxWidth: "110px", aspectRatio: "1 / 1", flexShrink: 0 }}
								/>
								<Stack flex={1} spacing={0.75}>
									<Stack direction="row" justifyContent="space-between">
										<Skeleton variant="text" width="35%" height={18} />
										<Skeleton variant="text" width="28%" height={18} />
									</Stack>
									<Stack direction="row" justifyContent="space-between">
										<Skeleton variant="rounded" width="38%" height={22} />
										<Skeleton variant="rounded" width="48%" height={22} />
									</Stack>
									<Skeleton variant="text" width="45%" height={16} />
									<Stack direction="row" justifyContent="space-between" alignItems="center">
										<Stack direction="row" spacing={1}>
											<Skeleton variant="rounded" width={62} height={20} />
											<Skeleton variant="rounded" width={52} height={20} />
											<Skeleton variant="rounded" width={54} height={20} />
										</Stack>
										<Skeleton variant="circular" width={18} height={18} />
									</Stack>
								</Stack>
							</Stack>
						</CustomPaper>
					))}
				</MuiStack>
			) : (
			<MuiStack spacing={1.5} width="100%">
				{[...Array(6)].map((item, index) => (
					<CustomPaper key={index} sx={{ width: "100%", maxWidth: "none" }}>
						<Stack
							direction="row"
							alignItems="center"
							justifyContent="space-between"
							spacing={2}
							width="100%"
						>
							<Stack
								direction="row"
								spacing={1.5}
								alignItems="center"
								flex={1}
								minWidth={0}
							>
								<Skeleton
									variant="rectangular"
									width={72}
									height={72}
									sx={{ flexShrink: 0, borderRadius: "2px" }}
								/>
								<Stack spacing={0.5} flex={1} minWidth={0}>
									<Skeleton variant="text" width="220px" height={20} />
									<Skeleton variant="text" width="140px" height={18} />
									<Skeleton variant="text" width="160px" height={16} />
								</Stack>
							</Stack>
							<Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
								<Skeleton variant="text" width={90} height={28} />
								<Skeleton variant="rounded" width={110} height={32} />
								{reviewMode && <Skeleton variant="rounded" width={96} height={32} />}
								<Skeleton variant="circular" width={18} height={18} />
							</Stack>
						</Stack>
					</CustomPaper>
				))}
			</MuiStack>
			)}
		</CustomBoxFullWidth>
	);
};

const MyOrders = (props) => {
	const tabsData = [
		{
			title: "ongoing",
			img: active,
		},
		{
			title: "previous",
			img: past,
		},
		// {
		// 	title: "pending review",
		// 	img: past,
		// },
		// {
		// 	title: "reviewed",
		// 	img: past,
		// },
	];

	const ongoingFilters = ["all", "pending", "accepted", "handover"];
	const previousFilters = ["all", "delivered", "refunded", "cancelled"];

	const theme = useTheme();
	const { configData } = props;
	const { t } = useTranslation();
	const { orderType, currentTab } = useSelector((state) => state.utilsData);
	const selectedMainTab = currentTab || "ongoing";

	const [offset, setOffSet] = useState(1);
	const [ongoingFilter, setOngoingFilter] = useState("all");
	const [previousFilter, setPreviousFilter] = useState("all");
	const [reviewStatusByOrder, setReviewStatusByOrder] = useState({});
	const [reviewStatusLoading, setReviewStatusLoading] = useState(false);
	const [expandedReviewOrderId, setExpandedReviewOrderId] = useState(null);
	const [expandedOrderId, setExpandedOrderId] = useState(null);
	const [trackTabOrderId, setTrackTabOrderId] = useState(null);
	const processedReviewOrderRef = useRef(null);
	const router = useRouter();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setOrderDetailsModal(false));
	}, [dispatch]);

	const orderTypeValue = selectedMainTab === "ongoing" ? "running-orders" : "list";
	const guestId = getGuestId() || "";

	const buildOrderDetailsUrl = (orderId) => {
		const params = new URLSearchParams({ order_id: String(orderId) });
		if (!hasValidAuthToken(getToken()) && guestId) {
			params.set("guest_id", guestId);
		}
		return `${order_details_api}?${params.toString()}`;
	};

	const { data, refetch, isFetching } = useGetMyOrdersList({
		orderType: orderTypeValue,
		offset: offset,
	});

	useEffect(() => {
		refetch();
		dispatch(setOrderType(selectedMainTab === "ongoing" ? 0 : 1));
	}, [selectedMainTab, offset]);

	useEffect(() => {
		const reviewOrderId = router.query.reviewOrderId;
		if (!reviewOrderId) return;
		if (processedReviewOrderRef.current === reviewOrderId) return;

		processedReviewOrderRef.current = reviewOrderId;
		const parsedOrderId = Number(reviewOrderId) || reviewOrderId;

		dispatch(setCurrentTab("previous"));
		dispatch(setOrderType(1));
		setPreviousFilter("all");
		setOffSet(1);
		setExpandedReviewOrderId(parsedOrderId);

		const { reviewOrderId: _removed, ...restQuery } = router.query;
		router.replace(
			{ pathname: router.pathname, query: restQuery },
			undefined,
			{ shallow: true }
		);
	}, [router.query.reviewOrderId]);

	useEffect(() => {
		setOffSet(1);
		setExpandedOrderId(null);
		dispatch(setOrderType(selectedMainTab === "ongoing" ? 0 : 1));
		if (selectedMainTab === "ongoing") {
			setOngoingFilter("all");
		}
		if (selectedMainTab === "previous") {
			setPreviousFilter("all");
		}
	}, [currentTab]);

	useEffect(() => {
		if (isFetching) {
			toast.loading(t("Getting Order List..."), {
				id: ORDER_LIST_LOADING_TOAST_ID,
			});
		} else {
			toast.dismiss(ORDER_LIST_LOADING_TOAST_ID);
		}
		return () => {
			toast.dismiss(ORDER_LIST_LOADING_TOAST_ID);
		};
	}, [isFetching, t]);

	const normalizeStatus = (status) =>
		(status || "").toString().trim().toLowerCase().replaceAll("-", "_");

	const isItemReviewed = (item) => {
		return Boolean(
			item?.is_reviewed_item ||
				item?.is_reveiewed_item ||
			item?.is_reviewed ||
				item?.is_review ||
				item?.reviewed ||
				item?.review ||
				item?.review_data ||
				item?.item_review ||
				item?.item_review_id ||
				item?.customer_review ||
				item?.review_id
		);
	};

	const getOrderReviewStatusFromDetails = (detailsResponse) => {
		const details = Array.isArray(detailsResponse)
			? detailsResponse
			: detailsResponse?.details || detailsResponse?.items || [];
		const deliverymanFlag = detailsResponse?.is_reviewed_deliveryman;

		if (!Array.isArray(details) || details.length === 0) {
			return deliverymanFlag ? "reviewed" : "pending";
		}
		const reviewableItems = details.filter((item) => item?.item_id || item?.item_details);
		if (reviewableItems.length === 0) return "pending";
		const reviewedCount = reviewableItems.filter((item) => isItemReviewed(item)).length;
		const allItemsReviewed = reviewedCount === reviewableItems.length;
		const deliverymanReviewed = deliverymanFlag === undefined ? true : Boolean(deliverymanFlag);
		return allItemsReviewed && deliverymanReviewed ? "reviewed" : "pending";
	};

	const orders = data?.orders || [];
	const reviewCandidateOrders = orders.filter(
		(order) => getPreviousStatusGroup(order?.order_status) === "delivered"
	);

	useEffect(() => {
		if (
			(selectedMainTab !== "pending review" &&
				selectedMainTab !== "reviewed" &&
				selectedMainTab !== "previous") ||
			reviewCandidateOrders.length === 0
		) {
			return;
		}
		let isCancelled = false;
		setReviewStatusLoading(true);

		Promise.allSettled(
			reviewCandidateOrders.map(async (order) => {
				const response = await MainApi.get(buildOrderDetailsUrl(order?.id));
				return {
					orderId: order?.id,
					status: getOrderReviewStatusFromDetails(response?.data),
				};
			})
		)
			.then((results) => {
				if (isCancelled) return;
				const nextMap = {};
				results.forEach((result) => {
					if (result.status === "fulfilled" && result.value?.orderId) {
						nextMap[result.value.orderId] = result.value.status;
					}
				});
				setReviewStatusByOrder((prev) => ({ ...prev, ...nextMap }));
			})
			.finally(() => {
				if (!isCancelled) {
					setReviewStatusLoading(false);
				}
			});

		return () => {
			isCancelled = true;
		};
	}, [selectedMainTab, data?.orders?.map((order) => order?.id).join(","), guestId]);

	const getFilteredOrders = () => {
		if (!orders.length) return [];

		if (selectedMainTab === "ongoing") {
			if (ongoingFilter === "all") return orders;
			return orders.filter(
				(order) => getOngoingStatusGroup(order?.order_status) === ongoingFilter
			);
		}

		if (selectedMainTab === "previous") {
			if (previousFilter === "all") return orders;
			return orders.filter(
				(order) => getPreviousStatusGroup(order?.order_status) === previousFilter
			);
		}

		if (selectedMainTab === "pending review") {
			return reviewCandidateOrders.filter(
				(order) => reviewStatusByOrder[order?.id] !== "reviewed"
			);
		}

		if (selectedMainTab === "reviewed") {
			return reviewCandidateOrders.filter(
				(order) => reviewStatusByOrder[order?.id] === "reviewed"
			);
		}

		return orders;
	};

	const filteredOrders = getFilteredOrders();
	const groupedOrderEntries = groupOrdersByCheckoutGroup(filteredOrders);

	const getOrderRenderProps = (order) => ({
		reviewStatus: reviewStatusByOrder[order?.id],
		t,
		configData,
		dispatch,
		onReviewClick: handleToggleReviewPanel,
		isReviewExpanded: expandedReviewOrderId === order?.id,
		onReviewSubmitted: handleReviewSubmitted,
		isExpanded: expandedOrderId === order?.id,
		onToggleDetails: handleToggleOrderDetails,
		onOpenTrackDetails: handleOpenTrackDetails,
		openTrackTab: trackTabOrderId === order?.id,
	});

	const renderOrderEntry = (entry, index) => {
		if (entry.type === "group") {
			return (
				<MultiStoreOrderGroup
					key={`group-${entry.checkoutGroupId}`}
					checkoutGroupId={entry.checkoutGroupId}
					orders={entry.orders}
					renderOrderProps={getOrderRenderProps}
				/>
			);
		}

		return (
			<Order
				key={entry.order?.id}
				index={index}
				order={entry.order}
				{...getOrderRenderProps(entry.order)}
			/>
		);
	};

	useEffect(() => {
		if (!expandedReviewOrderId || isFetching) return;
		const orderExists = filteredOrders?.some(
			(order) => String(order?.id) === String(expandedReviewOrderId)
		);
		if (!orderExists) return;

		const timer = setTimeout(() => {
			document
				.getElementById(`order-card-${expandedReviewOrderId}`)
				?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 300);

		return () => clearTimeout(timer);
	}, [expandedReviewOrderId, isFetching, filteredOrders]);

	const renderSubFilters = () => {
		if (selectedMainTab !== "ongoing" && selectedMainTab !== "previous") return null;
		const filters = selectedMainTab === "ongoing" ? ongoingFilters : previousFilters;
		const selectedFilter = selectedMainTab === "ongoing" ? ongoingFilter : previousFilter;
		const setFilter = selectedMainTab === "ongoing" ? setOngoingFilter : setPreviousFilter;

		return (
			<MuiStack direction="row" spacing={1} flexWrap="wrap" rowGap={1}>
				{filters.map((filter) => (
					<Chip
						key={filter}
						label={t(filter)}
						clickable
						color={selectedFilter === filter ? "primary" : "default"}
						variant={selectedFilter === filter ? "filled" : "outlined"}
						onClick={() => setFilter(filter)}
						sx={{
							textTransform: "capitalize",
							borderRadius: "2px",
							fontWeight: 600,
							height: 32,
						}}
					/>
				))}
			</MuiStack>
		);
	};

	const handleToggleReviewPanel = (orderId) => {
		setExpandedReviewOrderId((prev) => (prev === orderId ? null : orderId));
	};

	const refreshSingleOrderReviewStatus = async (orderId) => {
		if (!orderId) return;
		try {
			const response = await MainApi.get(buildOrderDetailsUrl(orderId));
			const status = getOrderReviewStatusFromDetails(response?.data);
			setReviewStatusByOrder((prev) => ({ ...prev, [orderId]: status }));
		} catch (error) {
			// keep UI stable even if refresh fails; user can continue in modal
		}
	};

	const handleReviewSubmitted = async (orderId) => {
		await refreshSingleOrderReviewStatus(orderId);
		setExpandedReviewOrderId(null);
	};

	const handleToggleOrderDetails = (orderId) => {
		setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
		setTrackTabOrderId(null);
	};
	const handleOpenTrackDetails = (orderId) => {
		setExpandedOrderId(orderId);
		setTrackTabOrderId(orderId);
	};

	const handleInnerContent = () => {
		if (data) {
			if (reviewStatusLoading && (selectedMainTab === "pending review" || selectedMainTab === "reviewed")) {
				return <CustomShimmerCard reviewMode />;
			}
			if (filteredOrders?.length === 0) {
				return (
					<CustomEmptyResult
						image={nodata}
						label="No Orders Found"
						width="128px"
						height="128px"
					/>
				);
			} else {
				return (
					<MuiStack spacing={1.5} width="100%" sx={{ maxWidth: "100%" }}>
						{groupedOrderEntries?.map((entry, index) => (
							<Box
								key={
									entry.type === "group"
										? `group-${entry.checkoutGroupId}`
										: entry.order?.id
								}
								sx={{ width: "100%", maxWidth: "100%" }}
							>
								{renderOrderEntry(entry, index)}
							</Box>
						))}
					</MuiStack>
				);
			}
		} else {
			return <CustomShimmerCard />;
		}
	};
	return (
		<CustomStackFullWidth
			spacing={0}
			sx={{
				minHeight: "60vh",
				width: "100%",
				maxWidth: "100%",
				boxSizing: "border-box",
			}}
		>
			<ProfileSectionHeader
				icon={ShoppingBag}
				title={t("My Orders")}
				subtitle={t("View and manage all your orders")}
			/>

			<Box
				sx={{
					px: { xs: 1.5, md: 2 },
					py: { xs: 2, md: 2 },
					width: "100%",
					maxWidth: "100%",
					boxSizing: "border-box",
				}}
			>
				<CustomStackFullWidth
					spacing={2}
					sx={{ width: "100%", maxWidth: "100%" }}
				>
					<TabsTypeOne
						tabs={tabsData}
						currentTab={selectedMainTab}
						t={t}
					/>
					{renderSubFilters()}
					{handleInnerContent()}
					{data?.total_size > data_limit &&
						selectedMainTab !== "pending review" &&
						selectedMainTab !== "reviewed" &&
						((selectedMainTab === "ongoing" && ongoingFilter === "all") ||
							(selectedMainTab === "previous" && previousFilter === "all")) && (
						<CustomPagination
							total_size={data?.total_size}
							page_limit={data_limit}
							offset={offset}
							setOffset={setOffSet}
						/>
					)}
				</CustomStackFullWidth>
			</Box>
		</CustomStackFullWidth>
	);
};

export default MyOrders;
