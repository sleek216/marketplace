import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useReducer, useState } from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import IncrementDecrementManager from "./IncrementDecrementManager";
import ProductInformationBottomSection from "./ProductInformationBottomSection";
import VariationsManager from "./VariationsManager";

import { onErrorResponse } from "api-manage/api-error-response/ErrorResponses";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { getCartListModuleWise } from "helper-functions/getCartListModuleWise";
import { getModuleId } from "helper-functions/getModuleId";
import { getGuestId } from "helper-functions/getToken";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
	mapApiCartRowsToReduxItems,
	getCartsFromResponse,
} from "helper-functions/normalizeCartListResponse";
import { setCart, setCartList } from "redux/slices/cart";
import { addWishList } from "redux/slices/wishList";
import {
	not_logged_in_message,
	out_of_limits,
	out_of_stock,
	product_update_to_cart_message,
	update_error_text,
} from "utils/toasterMessages";
import useAddCartItem from "../../../api-manage/hooks/react-query/add-cart/useAddCartItem";
import useCartItemUpdate from "../../../api-manage/hooks/react-query/add-cart/useCartItemUpdate";
import CustomRatings from "../../search/CustomRatings";
import CategoryInformation from "../CategoryInformation";
import InStockTag from "../InStockTag";
import {
	handleInitialTotalPriceVarPriceQuantitySet,
	isVariationAvailable,
} from "./helperFunction";
import PricePreviewWithStock from "./PricePreviewWithStock";
import { ACTION, initialState, reducer } from "./states";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { checkLocationBeforeCart } from "helper-functions/headerSessionSync";
import { findMatchingCartItem } from "helper-functions/cartItemMatch";
import ManualExpectedDeliveryInfo from "../ManualExpectedDeliveryInfo";

export const getItemObject = (productData) => {
	const unitPrice = Number(productData?.unit_price ?? productData?.price ?? (productData?.quantity ? productData?.totalPrice / productData?.quantity : productData?.totalPrice) ?? 0) || 0;
	return {
		guest_id: getGuestId(),
		model: productData?.available_date_starts ? "ItemCampaign" : "Item",
		add_on_ids: [],
		add_on_qtys: [],
		item_id: productData?.id,
		price: unitPrice,
		quantity: productData?.quantity,
		variation: productData?.selectedOption,
	};
};
const ProductInformation = ({
	productDetailsData,
	productUpdate,
	handleModalClose,
	modalmanage,
	imageSrcUrl,
	isSmall,
}) => {
	const theme = useTheme();
	const router = useRouter();
	const [wishListCount, setWishListCount] = useState(
		productDetailsData?.whislists_count
	);
	const currentLocation = JSON.parse(localStorage.getItem("currentLatLng"));
	const { cartList: aliasCartList } = useSelector((state) => state.cart);
	//this aliasCartList has been added so that we can use cartList as per module wise.
	const cartList = getCartListModuleWise(aliasCartList);
	const dispatchRedux = useDispatch();
	const [state, dispatch] = useReducer(reducer, initialState);
	const { t } = useTranslation();
	const { mutate, isLoading } = useAddCartItem();
	const { mutate: updateMutate, isLoading: updateIsLoading } =
		useCartItemUpdate();
	const isFoodModuleItem =
		productDetailsData?.module_type === "food" ||
		productDetailsData?.module?.module_type === "food" ||
		getCurrentModuleType() === "food";
	const getResolvedStock = () => Number(state?.modalData?.[0]?.stock);
	const isStockExceeded = () => {
		if (isFoodModuleItem) return false;
		const resolvedStock = getResolvedStock();
		return Number.isFinite(resolvedStock) && state?.modalData?.[0]?.quantity > resolvedStock;
	};
	const isOutOfStockItem = () => {
		if (isFoodModuleItem) return false;
		const resolvedStock = getResolvedStock();
		return Number.isFinite(resolvedStock) && resolvedStock <= 0;
	};

	useEffect(() => {
		handleInitialTotalPriceVarPriceQuantitySet(
			productDetailsData,
			dispatch,
			cartList,
			handleChoices,
			state.selectedOptions,
			state.modalData
		);
	}, [productDetailsData]);

	const handleChoices = (option, choice) => {
		if (cartList.length > 0) {
			const itemIsInCart = cartList.find(
				(item) =>
					String(item?.id) === String(productDetailsData?.id) &&
					JSON.stringify(item?.selectedOption?.[0]) ===
					JSON.stringify(option)
			);
			if (itemIsInCart) {
				dispatch({
					type: ACTION.setModalData,
					payload: {
						...itemIsInCart,
					},
				});
			} else {
				dispatch({
					type: ACTION.setModalData,
					payload: {
						...productDetailsData,
						selectedOption: [option],
						quantity: 1,
						price: option.price,
						totalPrice: option.price,
					},
				});
			}
		} else {
			dispatch({
				type: ACTION.setModalData,
				payload: {
					...state.modalData[0],
					selectedOption: [option],
					price: option?.price,
					totalPrice: option?.price,
					quantity: 1,
				},
			});
		}
	};
	const decrementQuantity = () => {
		dispatch({ type: ACTION.decrementQuantity });
	};

	const incrementQuantity = () => {
		if (isFoodModuleItem || state.modalData[0]?.stock > state.modalData[0]?.quantity) {
			if (productDetailsData?.maximum_cart_quantity) {
				if (
					productDetailsData?.maximum_cart_quantity >
					state.modalData[0]?.quantity
				) {
					dispatch({ type: ACTION.incrementQuantity });
				} else {
					toast.error(t(out_of_limits));
				}
			} else {
				dispatch({ type: ACTION.incrementQuantity });
			}
		} else {
			toast.error(t(out_of_stock));
		}
	};
	const handleSuccess = (res) => {
		if (res) {
			let product = {};
			res?.forEach((item) => {
				product = {
					...item?.item,
					cartItemId: item?.id,
					quantity: item?.quantity,
					totalPrice: item?.price,
					selectedOption: item?.variation,
				};
			});
			dispatchRedux(
				setCart({
					...product,
				})
			);
			toast.success(t("Item added to cart"));
			handleModalClose?.();
		}
	};
	const handleAddToCartOnDispatch = () => {
		if (!checkLocationBeforeCart()) {
			return;
		}
		if (isOutOfStockItem() || isStockExceeded()) {
			toast.error(t(out_of_stock));
			return;
		}

		const modalItem = state?.modalData[0] || productDetailsData;
		const addQty = modalItem?.quantity || 1;
		const resolvedPrice = Number(modalItem?.price ?? modalItem?.unit_price ?? productDetailsData?.price ?? productDetailsData?.unit_price ?? 0) || 0;

		dispatch({
			type: ACTION.setModalData,
			payload: {
				...modalItem,
				quantity: 1,
				totalPrice: resolvedPrice,
			},
		});

		const itemIsInCart = findMatchingCartItem(cartList, {
			...modalItem,
			id: productDetailsData?.id || modalItem?.id,
		});

		if (itemIsInCart) {
			const currentQty = Number(itemIsInCart?.quantity || 0);
			const stockLimit = Number.isFinite(getResolvedStock()) ? getResolvedStock() : null;
			const remainingStock = stockLimit !== null ? stockLimit - currentQty : null;
			if (remainingStock !== null && remainingStock <= 0) {
				toast.error(t(out_of_stock));
				return;
			}
			const finalAddQty = remainingStock !== null ? Math.min(addQty, remainingStock) : addQty;
			if (finalAddQty <= 0) {
				toast.error(t(out_of_stock));
				return;
			}
			const updateQuantity = currentQty + finalAddQty;
			const cartIdToUpdate = itemIsInCart?.cartItemId || itemIsInCart?.id || modalItem?.cartItemId;

			const itemModuleId = productDetailsData?.module_id || productDetailsData?.module?.id || modalItem?.module_id;
			const itemModuleType = productDetailsData?.module_type || productDetailsData?.module?.module_type || modalItem?.module_type;

			const updatedProduct = {
				...modalItem,
				id: modalItem?.id || productDetailsData?.id,
				cartItemId: cartIdToUpdate,
				quantity: updateQuantity,
				totalPrice: resolvedPrice * updateQuantity,
				module_id: itemModuleId,
				module_type: itemModuleType,
				isUpdate: true,
			};

			dispatchRedux(setCart(updatedProduct));
			toast.success(t("Item added to cart"));
			handleModalClose?.();

			const cartItemObject = {
				cart_id: cartIdToUpdate,
				guest_id: getGuestId(),
				model: modalItem?.available_date_starts ? "ItemCampaign" : "Item",
				add_on_ids: [],
				add_on_qtys: [],
				item_id: modalItem?.id || productDetailsData?.id,
				price: resolvedPrice,
				quantity: updateQuantity,
				variation: modalItem?.selectedOption || [],
				moduleIdOverride: itemModuleId,
			};

			updateMutate(cartItemObject, {
				onSuccess: (res) => {
					if (res) {
						const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
						const otherModulesItems = cartList.filter((c) => {
							const cModuleId = c?.module_id || c?.module?.id;
							const cModuleType = c?.module_type || c?.module?.module_type;
							if (itemModuleId && cModuleId) return String(cModuleId) !== String(itemModuleId);
							if (itemModuleType && cModuleType) return cModuleType !== itemModuleType;
							return true;
						});
						dispatchRedux(setCartList([...otherModulesItems, ...mappedFromApi]));
					}
				},
				onError: (err) => {
					const status = err?.response?.status;
					const msg = (err?.response?.data?.message || err?.response?.data?.errors?.[0]?.message || "").toLowerCase();
					const isNotFound = status === 404 || msg.includes("not found") || msg.includes("notfound");
					if (!isNotFound) {
						onErrorResponse(err);
					}
				},
			});
			return;
		}

		const itemModuleId = productDetailsData?.module_id || productDetailsData?.module?.id || modalItem?.module_id;
		const itemModuleType = productDetailsData?.module_type || productDetailsData?.module?.module_type || modalItem?.module_type;

		const tempProduct = {
			...modalItem,
			id: modalItem?.id || productDetailsData?.id,
			cartItemId: modalItem?.cartItemId || `temp_${modalItem?.id || productDetailsData?.id}_${Date.now()}`,
			quantity: addQty,
			totalPrice: resolvedPrice * addQty,
			selectedOption: modalItem?.selectedOption || [],
			module_id: itemModuleId,
			module_type: itemModuleType,
			module: productDetailsData?.module,
		};

		// Optimistic instant 0ms Add to Cart
		dispatchRedux(setCart(tempProduct));
		toast.success(t("Item added to cart"));
		handleModalClose?.();

		const itemObject = {
			...getItemObject(modalItem),
			moduleIdOverride: itemModuleId,
		};

		mutate(itemObject, {
			onSuccess: (res) => {
				if (res) {
					const mappedFromApi = mapApiCartRowsToReduxItems(getCartsFromResponse(res));
					const otherModulesItems = cartList.filter((c) => {
						const cModuleId = c?.module_id || c?.module?.id;
						const cModuleType = c?.module_type || c?.module?.module_type;
						if (itemModuleId && cModuleId) return String(cModuleId) !== String(itemModuleId);
						if (itemModuleType && cModuleType) return cModuleType !== itemModuleType;
						return true;
					});
					dispatchRedux(setCartList([...otherModulesItems, ...mappedFromApi]));
				}
			},
			onError: (err) => {
				const msg = (err?.response?.data?.errors?.[0]?.message || err?.response?.data?.message || "").toLowerCase();
				const isAlreadyInCart =
					msg.includes("already") ||
					msg.includes("exist") ||
					err?.response?.status === 422 ||
					err?.response?.status === 403;
				if (!isAlreadyInCart) {
					dispatchRedux(setRemoveItemFromCart(tempProduct));
					onErrorResponse(err);
				}
			},
		});
	};

	const addToCard = () => {
		handleAddToCartOnDispatch();
	};

	const updateCartSuccessHandler = (res) => {
		if (res) {
			const pp = res?.map((item) => {
				const newItem = {
					...item?.item,
					cartItemId: item?.id,
					quantity: item?.quantity,
					totalPrice: item?.price,
					selectedOption: item?.variation,
				};

				return newItem;
			});
			dispatchRedux(setCartList(pp));
			toast.success(t("Cart updated successfully"), { id: "cart-update" });
			handleModalClose?.();
		}
	};

	const handleUpdateToCart = (cartItem) => {
		if (!checkLocationBeforeCart()) {
			return;
		}
		if (isOutOfStockItem() || isStockExceeded()) {
			toast.error(t(out_of_stock));
			return;
		}
		if (
			JSON.stringify(productDetailsData) ===
			JSON.stringify(state.modalData[0])
		) {
			toast(t(update_error_text), {
				icon: "⚠️",
			});
		} else {
			const itemIsInCart = findMatchingCartItem(cartList, {
				...state.modalData[0],
				id: productDetailsData?.id || state.modalData[0]?.id,
			});

			const cartIdToUpdate = itemIsInCart?.cartItemId || itemIsInCart?.id || state.modalData[0]?.cartItemId;
			const modalItem = state.modalData[0];
			const updateQty = Number(modalItem?.quantity) || 1;
			const unitPrice =
				Number(
					modalItem?.unit_price ??
					modalItem?.price ??
					(updateQty > 0 ? Number(modalItem?.totalPrice) / updateQty : modalItem?.totalPrice) ??
					0
				) || 0;

			const updatedProduct = {
				...modalItem,
				id: modalItem?.id || productDetailsData?.id,
				cartItemId: cartIdToUpdate,
				quantity: updateQty,
				price: unitPrice,
				itemBasePrice: unitPrice,
				totalPrice: unitPrice * updateQty,
				isUpdate: true,
			};

			// Optimistic instant UI update (0ms)
			dispatchRedux(setCart(updatedProduct));
			toast.success(t("Cart updated successfully"), { id: "cart-update" });

			const cartItemObject = {
				cart_id: cartIdToUpdate,
				guest_id: getGuestId(),
				model: modalItem?.available_date_starts
					? "ItemCampaign"
					: "Item",
				add_on_ids: [],
				add_on_qtys: [],
				item_id: modalItem?.id || productDetailsData?.id,
				price: unitPrice,
				quantity: updateQty,
				variation: modalItem?.selectedOption || [],
				moduleIdOverride:
					productDetailsData?.module_id || productDetailsData?.module?.id,
			};
			updateMutate(cartItemObject, {
				onSuccess: updateCartSuccessHandler,
				onError: (err) => {
					onErrorResponse(err);
				},
			});
			if (productUpdate) {
				handleModalClose?.();
			}
		}
	};

	let token = undefined;
	if (typeof window !== "undefined") {
		token = localStorage.getItem("token");
	}

	const { mutate: addFavoriteMutation } = useAddToWishlist();
	const addToFavorite = () => {
		if (token) {
			addFavoriteMutation(productDetailsData?.id, {
				onSuccess: (response) => {
					if (response) {
						dispatchRedux(addWishList(productDetailsData));
						toast.success(response?.message);
						setWishListCount(wishListCount + 1);
					}
				},
				onError: (error) => {
					toast.error(error.response.data.message);
				},
			});
		} else toast.error(t(not_logged_in_message));
	};

	const topInformation = () => {
		return (
			<CustomStackFullWidth
				spacing={0.5}
				padding={{
					xs: "0px 8px 0px 8px",
					sm: "10px 20px 10px 20px",
					md: "0px",
				}}
			>
				{state.modalData[0]?.name ? (
					<CustomStackFullWidth
						direction="row"
						alignItems="center"
						spacing={1.5}
						marginTop={{ xs: "10px", sm: "0px" }}
					>
						<Typography
							fontSize={{
								xs: "20px",
								sm: "28px",
							}}
							fontWeight="700"
							component="h1"
							sx={{ lineHeight: 1.3, color: "text.primary" }}
						>
							{state.modalData[0]?.name}
						</Typography>
						<InStockTag
							stock={isFoodModuleItem ? undefined : state.modalData[0]?.stock}
						/>
					</CustomStackFullWidth>
				) : (
					<Skeleton width={100} variant="text" />
				)}

				<Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" mt={1}>
					{state.modalData[0]?.isCampaignItem ? null : (
						<>
							<Stack direction="row" alignItems="center" spacing={0.5}>
								<CustomRatings
									ratingValue={state.modalData[0]?.avg_rating}
									readOnly
									color={theme.palette.warning.main}
								/>
								<Typography fontWeight="700" fontSize="13px" color="primary.main">
									{state.modalData[0]?.avg_rating?.toFixed(1)}
								</Typography>
							</Stack>
							<Typography color="neutral.300">|</Typography>
							<Stack alignItems="center" direction="row" spacing={0.3}>
								<Typography variant="body2" color="primary.main">
									{state.modalData[0]?.rating_count} {t("Reviews")}
								</Typography>
							</Stack>
							<Typography color="neutral.300">|</Typography>
						</>
					)}
					{state.modalData[0]?.store_name ? (
						router.pathname !== `/store/[id]` ? (
							<Link
								href={{
									pathname: "/store/[id]",
									query: {
										id: `${state.modalData[0]?.store_id}`,
										module_id: `${
											state.modalData[0]?.module_id ||
											state.modalData[0]?.module?.id ||
											getModuleId()
										}`,
										lat: currentLocation?.lat,
										lng: currentLocation?.lng,
										store_zone_id: `${state?.modalData[0]?.zone_id}`,
									},
								}}
							>
								<Typography
									variant="body2"
									fontWeight="500"
									color="primary.main"
									sx={{
										"&:hover": { textDecoration: "underline" },
									}}
									component="span"
								>
									{t("Brand")}: {state.modalData[0]?.store_name}
								</Typography>
							</Link>
						) : (
							<Typography variant="body2" fontWeight="500" color="primary.main">
								{t("Brand")}: {state.modalData[0]?.store_name}
							</Typography>
						)
					) : null}
				</Stack>
				{state.modalData[0]?.generic_name?.[0] && (
					<Typography
						fontSize={{ xs: "12px", sm: "12px" }}
						fontWeight="400"
						color="customColor.textGray"
						component="h2"
					>
						{state.modalData[0]?.generic_name?.[0]}
					</Typography>
				)}


				<PricePreviewWithStock
					state={state}
					theme={theme}
					productDetailsData={productDetailsData}
				/>

				<ManualExpectedDeliveryInfo item={state?.modalData[0]} />

				{state?.modalData[0]?.nutritions_name?.length > 0 && (
					<>
						<Typography fontSize="14px" fontWeight="500" mt="5px">
							{t("Nutrition Details")}
						</Typography>

						<Stack direction="row" spacing={0.5}>
							{state?.modalData[0]?.nutritions_name?.map(
								(item, index) => (
									<Typography
										fontSize="12px"
										key={index}
										color={theme.palette.neutral[400]}
									>
										{item}
										{index !==
											state?.modalData[0]?.nutritions_name.length - 1
											? ","
											: "."}
									</Typography>
								)
							)}
						</Stack>
					</>
				)}
				{state?.modalData[0]?.allergies_name?.length > 0 && (
					<>
						<Typography fontSize="14px" fontWeight="500" mt="5px">
							{t("Allergic Ingredients")}
						</Typography>

						<Stack direction="row" spacing={0.5}>
							{state?.modalData[0]?.allergies_name?.map(
								(item, index) => (
									<Typography
										fontSize="12px"
										key={index}
										color={theme.palette.neutral[400]}
									>
										{item}
										{index !==
											state?.modalData[0]?.allergies_name.length - 1
											? ","
											: "."}
									</Typography>
								)
							)}
						</Stack>
					</>
				)}
			</CustomStackFullWidth>
		);
	};

	return (
		<>
			{state.modalData.length > 0 && (
				<CustomStackFullWidth spacing={2}>
					<Box sx={{ width: "100%" }}>
						{topInformation()}
						<Stack
							padding={{
								xs: "10px 0px",
								sm: "15px 0px",
								md: "0px",
							}}
							spacing={1.5}
						>
							{state.modalData[0]?.variations?.length > 0 && (
								<VariationsManager
									productDetailsData={state.modalData[0]}
									handleChoices={handleChoices}
								/>
							)}
							{/*<SizeVariation productDetailsData={productDetailsData} />*/}
							{state.modalData.length > 0 && (
								<IncrementDecrementManager
									decrementQuantity={decrementQuantity}
									incrementQuantity={incrementQuantity}
									modalData={state?.modalData[0]}
									productUpdate={productUpdate}
									marketplaceLayout={modalmanage === "true"}
								/>
							)}
							{isSmall && (
								<CustomStackFullWidth sx={{ mt: ".5rem" }}>
									<CategoryInformation
										tags={state?.modalData?.[0]?.tags}
										categories={
											state?.modalData?.[0]?.category_ids
										}
									/>
								</CustomStackFullWidth>
							)}
						</Stack>
					</Box>

					<ProductInformationBottomSection
						addToCard={addToCard}
						handleUpdateToCart={handleUpdateToCart}
						productDetailsData={state.modalData[0]}
						selectedOptions={state?.selectedOptions}
						dispatchRedux={dispatchRedux}
						addToFavorite={addToFavorite}
						wishListCount={wishListCount}
						setWishListCount={setWishListCount}
						cartItemQuantity={state?.modalData[0]?.quantity}
						t={t}
						handleModalClose={handleModalClose}
						isLoading={isLoading}
						addToCartMutate={mutate}
						updateIsLoading={updateIsLoading}
						marketplaceLayout={modalmanage === "true"}
					/>

				</CustomStackFullWidth>
			)}
		</>
	);
};

export default ProductInformation;
