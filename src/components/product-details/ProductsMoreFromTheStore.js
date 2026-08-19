import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import useGetMoreFromStores from "../../api-manage/hooks/react-query/product-details/useGetMoreFromStore";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import ModuleMarketplaceProductCard from "../home/ModuleMarketplaceProductCard";
import H1 from "../typographies/H1";

const ProductsMoreFromTheStore = ({ productDetails }) => {
	const [offSet, setOffSet] = useState(1);
	const [moreItem, setMoreItem] = useState([]);

	const limit = 10;
	const pageParams = {
		productId: productDetails?.id,
		offset: offSet,
		limit: limit,
	};
	const handleSuccess = (res) => {
		if (res) {
			setMoreItem(res);
		}
	};
	const { refetch } = useGetMoreFromStores(pageParams, handleSuccess);
	useEffect(() => {
		refetch();
	}, []);

	if (!moreItem || moreItem.length === 0) return null;

	return (
		<CustomStackFullWidth spacing={2}>
			<H1 textAlign="start" text="More From This Store!" component="h2" />
			<Grid container spacing={2}>
				{moreItem?.slice(0, 8)?.map((item, index) => (
					<Grid
						item
						xs={6}
						sm={4}
						md={3}
						key={index}
						sx={{ display: "flex" }}
					>
						<ModuleMarketplaceProductCard item={item} />
					</Grid>
				))}
			</Grid>
		</CustomStackFullWidth>
	);
};

ProductsMoreFromTheStore.propTypes = {};

export default ProductsMoreFromTheStore;
