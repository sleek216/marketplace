import { Grid } from "@mui/material";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import { useAddToWishlist } from "api-manage/hooks/react-query/wish-list/useAddWishList";
import { useWishListDelete } from "api-manage/hooks/react-query/wish-list/useWishListDelete";
import { t } from "i18next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import {
	prefetchStoreDetails,
	seedStoreDetailsCache,
} from "api-manage/hooks/react-query/store/useGetStoreDetails";
import { prepareStoreNavigation } from "helper-functions/storeNavigation";
import { addWishList, removeWishListItem } from "redux/slices/wishList";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import { not_logged_in_message } from "utils/toasterMessages";
import SinglePoster from "../home/module-wise-components/ecommerce/SinglePoster";
import FeaturedStores from "../home/module-wise-components/pharmacy/featured-stores";
import DetailsAndReviews from "./details-and-reviews/DetailsAndReviews";
import ProductDetailsSection from "./product-details-section/ProductDetailsSection";
import ProductsMoreFromTheStore from "./ProductsMoreFromTheStore";
import StoreDetails from "./StoreDetails";
import useTrackRecentlyViewed from "api-manage/hooks/react-query/recently-viewed/useTrackRecentlyViewed";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";

const ProductDetails = ({ productDetailsData, configData }) => {
	const storeImageBaseUrl = configData?.base_urls?.store_image_url;
	const reduxDispatch = useDispatch();
	const queryClient = useQueryClient();
	const [isWishlisted, setIsWishlisted] = useState(false);
	const { mutate: addFavoriteMutation } = useAddToWishlist();
	const { mutate: trackRecentlyViewed } = useTrackRecentlyViewed();
	const { mutate } = useWishListDelete();
	const { data: storeData } = useGetStoreDetails(productDetailsData?.store_id, {
		enabled:
			!!productDetailsData?.store_id && !productDetailsData?.store_details,
	});
	useEffect(() => {
		const store = productDetailsData?.store_details;
		if (!store) return;
		prepareStoreNavigation(store);
		seedStoreDetailsCache(queryClient, store);
		prefetchStoreDetails(queryClient, store);
	}, [productDetailsData?.store_details, queryClient]);

	useEffect(() => {
		if (!productDetailsData?.id) return;
		const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
		trackRecentlyViewed({
			module: getCurrentModuleType(),
			entity_id: productDetailsData?.id,
			viewed_at: new Date().toISOString(),
			token,
		});
	}, [productDetailsData?.id]);
	const addToWishlistHandler = (e) => {
		e.stopPropagation();
		let token = undefined;
		if (typeof window !== "undefined") {
			token = localStorage.getItem("token");
		}
		if (token) {
			addFavoriteMutation(productDetailsData?.id, {
				onSuccess: (response) => {
					if (response) {
						reduxDispatch(addWishList(productDetailsData));
						setIsWishlisted(true);
						toast.success(response?.message);
					}
				},
				onError: (error) => {
					toast.error(error.response.data.message);
				},
			});
		} else toast.error(t(not_logged_in_message));
	};
	const removeFromWishlistHandler = (e) => {
		e.stopPropagation();
		const onSuccessHandlerForDelete = (res) => {
			reduxDispatch(removeWishListItem(productDetailsData?.id));
			setIsWishlisted(false);
			toast.success(res.message, {
				id: "wishlist",
			});
		};
		mutate(productDetailsData?.id, {
			onSuccess: onSuccessHandlerForDelete,
			onError: (error) => {
				toast.error(error.response.data.message);
			},
		});
	};

	return (
		<CustomStackFullWidth
			paddingTop={{ xs: "1.25rem", md: "2.5rem" }}
			paddingBottom="2.5rem"
			sx={{ minHeight: "100vh", backgroundColor: "background.paper", px: { xs: 1, md: 4 }, maxWidth: "1440px", mx: "auto" }}
		>
			<Grid container spacing={{ xs: 2, md: 4 }}>
				<Grid item xs={12} md={9}>
					<CustomStackFullWidth spacing={4}>
						<ProductDetailsSection
							productDetailsData={productDetailsData}
							configData={configData}
							addToWishlistHandler={addToWishlistHandler}
							removeFromWishlistHandler={removeFromWishlistHandler}
							isWishlisted={isWishlisted}
						/>
						<DetailsAndReviews
							configData={configData}
							description={productDetailsData?.description}
							reviews={productDetailsData?.reviews}
							productId={productDetailsData?.id}
							storename={productDetailsData?.store_details?.name}
							showBackground={false}
						/>
						<CustomStackFullWidth>
							<FeaturedStores
								slide="3"
								title="Popular Store"
								configData={configData}
							/>
						</CustomStackFullWidth>
					</CustomStackFullWidth>
				</Grid>
				<Grid item xs={12} md={3}>
					<CustomStackFullWidth spacing={2}>
						<StoreDetails
							storeDetails={
								productDetailsData?.store_details ?? storeData
							}
							storeImageBaseUrl={storeImageBaseUrl}
						/>
					</CustomStackFullWidth>
				</Grid>

				<Grid item xs={12}>
					<ProductsMoreFromTheStore
						productDetails={productDetailsData}
					/>
				</Grid>

				<Grid item xs={12}>
					<SinglePoster />
				</Grid>
			</Grid>
		</CustomStackFullWidth>
	);
};

export default ProductDetails;
