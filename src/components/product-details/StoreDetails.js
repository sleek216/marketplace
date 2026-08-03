import { useTheme } from "@emotion/react";
import { Heart as FavoriteIcon, HeartOff as FavoriteBorderIcon } from "lucide-react";
import {
	alpha,
	Grid,
	Paper,
	Tooltip,
	Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import { useAddStoreToWishlist } from "api-manage/hooks/react-query/wish-list/useAddStoreToWishLists";
import { useWishListStoreDelete } from "api-manage/hooks/react-query/wish-list/useWishListStoreDelete";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import {
	buildStoreHref,
	prepareStoreNavigation,
} from "helper-functions/storeNavigation";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useQueryClient } from "react-query";
import { prefetchStoreDetails } from "api-manage/hooks/react-query/store/useGetStoreDetails";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { addWishListStore, removeWishListStore } from "redux/slices/wishList";
import { CustomButtonPrimary } from "styled-components/CustomButtons.style";
import {
	CustomBoxFullWidth,
	CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import CustomImageContainer from "../CustomImageContainer";
import CustomRatings from "../search/CustomRatings";
import { RoundedIconButton } from "./product-details-section/ProductsThumbnailsSettings";

const CustomWrapper = styled(Paper)(({ theme }) => ({
	padding: "24px",
	borderRadius: "2px",
	background: theme.palette.background.paper,
	border: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
	boxShadow: `0 1px 4px ${alpha(theme.palette.common.black || '#000', 0.06)}`,
	display: "flex",
	flexDirection: "column",
	gap: "20px",
	transition: "box-shadow 0.18s ease",
	"&:hover": {
		boxShadow: `0 4px 14px ${alpha(theme.palette.common.black || '#000', 0.1)}`,
	}
}));

const StoreDetails = ({ storeDetails, storeImageBaseUrl }) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { configData } = useSelector((state) => state.configData);
	const dispatchRedux = useDispatch();
	const { wishLists } = useSelector((state) => state.wishList);
	const { mutate } = useWishListStoreDelete();
	const { mutate: addFavoriteMutation } = useAddStoreToWishlist();

	let token = undefined;
	if (typeof window !== "undefined") {
		token = localStorage.getItem("token");
	}
	const onSuccessHandlerForDelete = (res) => {
		dispatchRedux(removeWishListStore(storeDetails?.id));
		toast.success(res.message, {
			id: "wishlist",
		});
	};

	const addToFavorite = () => {
		if (token) {
			addFavoriteMutation(storeDetails?.id, {
				onSuccess: (response) => {
					if (response) {
						dispatchRedux(addWishListStore(storeDetails));
						toast.success(response?.message);
					}
				},
				onError: (error) => {
					toast.error(error.response.data.message);
				},
			});
		} else toast.error(t(not_logged_in_message));
	};
	const isInWishList = (id) => {
		return !!wishLists?.store?.find(
			(wishStore) => wishStore.id === storeDetails?.id
		);
	};
	const deleteWishlistStore = (id) => {
		mutate(id, {
			onSuccess: onSuccessHandlerForDelete,
			onError: (error) => {
				toast.error(error.response.data.message);
			},
		});
	};
	const storeHref = useMemo(
		() => buildStoreHref(storeDetails),
		[storeDetails]
	);

	useEffect(() => {
		if (!storeDetails) return;
		prepareStoreNavigation(storeDetails);
		prefetchStoreDetails(queryClient, storeDetails);
		if (storeHref) {
			router.prefetch(storeHref);
		}
	}, [queryClient, router, storeDetails, storeHref]);

	const handleVisitStore = () => {
		if (!storeHref) return;
		prepareStoreNavigation(storeDetails);
		router.push(storeHref);
	};

	const handleClick = () => {
		router.push({
			pathname: "/profile",
			query: {
				page: "inbox",
				type: "vendor",
				id: storeDetails?.vendor_id,
				routeName: "vendor_id",
				chatFrom: "true",
			},
		});
	};
	return (
		<CustomStackFullWidth spacing={2}>
			<CustomWrapper>
				<Typography variant="h6" fontWeight="700" mb={1} sx={{ fontSize: "16px" }}>
					{t("Delivery")}
				</Typography>
				<CustomStackFullWidth spacing={1.5}>
					<Typography variant="body2" color="text.secondary">
						<span style={{ fontWeight: 600, color: "black" }}>{t("Standard Delivery")}</span><br />
						{t("3-5 Business Days")}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						<span style={{ fontWeight: 600, color: "black" }}>{t("Cash on Delivery")}</span> {t("Available")}
					</Typography>
				</CustomStackFullWidth>
			</CustomWrapper>
			<CustomWrapper>
				<Typography variant="body2" color="text.secondary" mb={-1} sx={{ fontSize: "13px" }}>
					{t("Sold by")}
				</Typography>
				<Grid container spacing={2.5}>
					<Grid item xs={12} container>
					<Grid item xs={10} alignSelf="center">
						<CustomStackFullWidth
							direction="raw"
							alignItems="center"
							sx={{
								flex: "0 0 60px",
								gap: "10px",
							}}
						>
							<CustomBoxFullWidth
								sx={{
									position: "relative",
									height: "60px",
									width: "80px",
									borderRadius: "50%",
									border: (theme) =>
										`1px solid ${alpha(
											theme.palette.neutral[300],
											0.3
										)}`,
								}}
							>
								<CustomImageContainer
									src={storeDetails?.logo_full_url}
									// alt={item?.name}
									height="100%"
									width="100%"
									obejctfit="contain"
									borderRadius="50%"
								/>
							</CustomBoxFullWidth>
							<CustomStackFullWidth spacing={0.5}>
								<Typography variant="h6" fontWeight="700" component="h2">
									{storeDetails?.name}
								</Typography>
								<CustomStackFullWidth
									direction="row"
									alignItems="center"
								>
									<CustomRatings
										ratingValue={storeDetails?.avg_rating}
										color={theme.palette.warning.main}
										readOnly
									/>
									<Typography
										fontSize="12px"
										color="customColor.textGray"
									>
										({storeDetails?.rating_count})
									</Typography>
								</CustomStackFullWidth>
								<Typography fontSize="14px" component="h3">
									{storeDetails?.total_items - 1}+ {t("Products")}
								</Typography>
							</CustomStackFullWidth>
						</CustomStackFullWidth>
					</Grid>
					<Grid item xs={2}>
						{!isInWishList(storeDetails?.id) && (
							<Tooltip title={t("Add to wishlist")}>
								<RoundedIconButton
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										marginLeft: "auto",
										backgroundColor: theme.palette.background.paper,
										border: `1px solid ${alpha(
											theme.palette.primary.main,
											0.25
										)}`,
										filter:
											"drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))",
										"&:hover": {
											backgroundColor: alpha(
												theme.palette.primary.main,
												0.08
											),
										},
									}}
									onClick={addToFavorite}
								>
									<FavoriteBorderIcon
										size={18}
										color={theme.palette.primary.main}
									/>
								</RoundedIconButton>
							</Tooltip>
						)}
						{isInWishList(storeDetails?.id) && (
							<Tooltip title={t("Remove from wishlist")}>
								<RoundedIconButton
									onClick={() => deleteWishlistStore(storeDetails?.id)}
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										marginLeft: "auto",
										backgroundColor: alpha(
											theme.palette.primary.main,
											0.1
										),
										border: `1px solid ${alpha(
											theme.palette.primary.main,
											0.35
										)}`,
										filter:
											"drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.05))",
										"&:hover": {
											backgroundColor: alpha(
												theme.palette.primary.main,
												0.16
											),
										},
									}}
								>
									<FavoriteIcon
										size={18}
										color={theme.palette.primary.main}
									/>
								</RoundedIconButton>
							</Tooltip>
						)}
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Grid
						container
						sx={{
							borderRadius: "10px",
							backgroundColor: alpha(theme.palette.primary.main, 0.04),
							border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
							overflow: "hidden",
						}}
					>
						<Grid
							item
							xs={6}
							sx={{
								px: 2,
								py: 1.5,
								borderRight: `1px solid ${alpha(
									theme.palette.neutral[300],
									0.35
								)}`,
							}}
						>
							<CustomStackFullWidth
								alignItems="center"
								spacing={0.25}
								textAlign="center"
							>
								<Typography
									sx={{
										fontSize: { xs: "16px", sm: "18px" },
										fontWeight: 700,
										lineHeight: 1.2,
										color: "text.primary",
									}}
								>
									{storeDetails?.positive_rating?.toFixed(1)}%
								</Typography>
								<Typography
									sx={{
										color: "customColor.textGray",
										fontSize: { xs: "11px", sm: "12px" },
										fontWeight: 500,
										lineHeight: 1.3,
									}}
								>
									{t("Positive Review")}
								</Typography>
							</CustomStackFullWidth>
						</Grid>
						<Grid item xs={6} sx={{ px: 2, py: 1.5 }}>
							<CustomStackFullWidth
								alignItems="center"
								spacing={0.25}
								textAlign="center"
							>
								<Typography
									sx={{
										fontSize: { xs: "16px", sm: "18px" },
										fontWeight: 700,
										lineHeight: 1.2,
										color: "text.primary",
									}}
								>
									{getAmountWithSign(storeDetails?.minimum_order)}
								</Typography>
								<Typography
									sx={{
										color: "customColor.textGray",
										fontSize: { xs: "11px", sm: "12px" },
										fontWeight: 500,
										lineHeight: 1.3,
									}}
								>
									{t("Minimum Order")}
								</Typography>
							</CustomStackFullWidth>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} container spacing={2}>
					<Grid item xs={12}>
						<CustomButtonPrimary fullwidth="true" onClick={handleVisitStore}>
							<Typography>{t("Visit Store")}</Typography>
						</CustomButtonPrimary>
					</Grid>
				</Grid>
			</Grid>
		</CustomWrapper>
		</CustomStackFullWidth>
	);
};

StoreDetails.propTypes = {};

export default React.memo(StoreDetails);
