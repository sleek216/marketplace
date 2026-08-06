import { alpha, Box, Grid, Stack, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";
import { getAmountWithSign, getDiscountedAmount } from "../../../helper-functions/CardHelpers";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";
import { handleProductValueWithOutDiscount } from "../../../utils/CustomFunctions";
import CustomImageContainer from "../../CustomImageContainer";
import VariationContent from "../../added-cart-view/VariationContent";
import ManualExpectedDeliveryInfo from "../../product-details/ManualExpectedDeliveryInfo";
import { groupItemsByStore } from "../../product-details/storeItemGrouping";
import { StoreGroupHeader } from "../../product-details/StoreGroupSection";

export const VegNonveg = ({ theme, item, t }) => {
	return (
		<Stack
			sx={{
				position: "absolute",
				bottom: 0,
				left: 0,
				width: "100%",

				background: (theme) => theme.palette.primary.overLay,
				opacity: "0.6",
				padding: "10px",
				height: "30%",
				alignItems: "center",
				justifyContent: "center",
				borderBottomRightRadius: "10px",
				borderBottomLeftRadius: "10px",
			}}
		>
			<Typography align="center" color={theme.palette.neutral[100]}>
				{item?.veg === 0 ? t("Non-Veg") : t("Veg")}
			</Typography>
		</Stack>
	);
};

const RegularOrders = (props) => {
	const { cartList, t } = props;
	const theme = useTheme();
	const storeGroups = groupItemsByStore(cartList);
	const listSurfaceSx = {
		backgroundColor: (th) =>
			th.palette.mode === "dark"
				? alpha(th.palette.common.white, 0.06)
				: "#f4f4f5",
		borderRadius: "12px",
		overflow: "hidden",
	};

	return (
		<>
			{cartList.length > 0 ? (
				<CustomStackFullWidth spacing={2}>
					{storeGroups.map((group) => (
						<Box key={group.storeId}>
							<StoreGroupHeader
								storeName={group.storeName}
								storeLogo={group.storeLogo}
								storeId={group.storeId}
								sx={{
									px: 0,
									borderBottom: "none",
									pb: 1,
									pt: 0,
								}}
							/>
							<CustomStackFullWidth sx={listSurfaceSx}>
								{group.items.map(({ item }, index) => (
									<Stack
										key={item?.cartItemId || item?.id || index}
										direction="row"
										alignItems="center"
										spacing={1.5}
										sx={{
											px: { xs: 1.25, sm: 1.75 },
											py: 1.25,
											...(index < group.items.length - 1 && {
												borderBottom: (th) =>
													`1px solid ${alpha(
														th.palette.common.black,
														th.palette.mode === "dark" ? 0.12 : 0.06
													)}`,
											}),
										}}
									>
										<Box
											sx={{
												position: "relative",
												flexShrink: 0,
												width: 56,
												height: 56,
											}}
										>
											<CustomImageContainer
												height="56px"
												width="56px"
												src={item?.image_full_url}
												loading="lazy"
												borderRadius="8px"
												objectfit="cover"
											/>
											<Box
												aria-label={`${t("Quantity")} ${item.quantity}`}
												sx={{
													position: "absolute",
													top: -6,
													right: -6,
													minWidth: 22,
													height: 22,
													px: item.quantity > 9 ? 0.5 : 0,
													borderRadius: "50%",
													bgcolor: "common.black",
													color: "common.white",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: "11px",
													fontWeight: 700,
													lineHeight: 1,
													boxSizing: "border-box",
													border: (th) =>
														`2px solid ${
															th.palette.mode === "dark"
																? th.palette.grey[900]
																: "#f4f4f5"
														}`,
												}}
											>
												{item.quantity}
											</Box>
										</Box>
										<Stack
											direction="row"
											alignItems="center"
											justifyContent="space-between"
											flex={1}
											minWidth={0}
											spacing={1}
										>
											<Stack minWidth={0} spacing={0.25} flex={1}>
												<Typography
													component="div"
													variant="body1"
													sx={{
														fontWeight: 500,
														fontSize: { xs: "14px", sm: "15px" },
														color: (th) =>
															th.palette.mode === "dark"
																? th.palette.common.white
																: th.palette.common.black,
														lineHeight: 1.35,
														overflow: "hidden",
														textOverflow: "ellipsis",
														display: "-webkit-box",
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
													}}
												>
													{item.name}
												</Typography>
												{item.is_prescription_required !== 0 && (
													<Typography
														variant="caption"
														sx={{ color: theme.palette.error.main }}
													>
														{t("Prescription Required")}
													</Typography>
												)}
												<Box
													sx={{
														"& .MuiTypography-root": {
															fontSize: "13px !important",
															color: `${
																theme.palette.neutral?.[500] ?? "#737373"
															} !important`,
															fontWeight: 400,
														},
													}}
												>
													<VariationContent cartItem={item} />
												</Box>
											</Stack>
											<Typography
												variant="body1"
												sx={{
													flexShrink: 0,
													fontWeight: 700,
													fontSize: { xs: "14px", sm: "16px" },
													color: (th) =>
														th.palette.mode === "dark"
															? th.palette.common.white
															: th.palette.common.black,
													whiteSpace: "nowrap",
												}}
											>
												{getAmountWithSign(
													item?.totalPrice != null
														? getDiscountedAmount(
																item?.totalPrice,
																item?.discount,
																item?.discount_type,
																item?.store_discount,
																item?.quantity
														  )
														: getDiscountedAmount(
																handleProductValueWithOutDiscount(item) * (item?.quantity || 1),
																item?.discount,
																item?.discount_type,
																item?.store_discount,
																item?.quantity || 1
														  )
												)}
											</Typography>
										</Stack>
									</Stack>
								))}
								{group.deliverySource && (
									<ManualExpectedDeliveryInfo
										record={group.deliverySource}
										variant="footer"
										footerInset
									/>
								)}
							</CustomStackFullWidth>
						</Box>
					))}
				</CustomStackFullWidth>
			) : (
				<CustomStackFullWidth
					direction="row"
					alignItems="flex-start"
					spacing={2}
				>
					<Skeleton variant="rectangular" height="90px" width="95px" />
					<Stack>
						<Skeleton variant="text" width="50px" />
						<Skeleton variant="text" width="50px" />
						<Skeleton variant="text" width="50px" />
					</Stack>
				</CustomStackFullWidth>
			)}
			<Grid item md={12} xs={12}>
				<Stack
					width="100%"
					sx={{
						mt: "20px",
						borderBottom: `2px solid ${theme.palette.neutral[300]}`,
					}}
				></Stack>
			</Grid>
		</>
	);
};

RegularOrders.propTypes = {};

export default RegularOrders;
