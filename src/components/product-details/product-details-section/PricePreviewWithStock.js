import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import {
	getAmountWithSign,
	getDiscountedAmount,
} from "../../../helper-functions/CardHelpers";

const PricePreviewWithStock = (props) => {
	const { state, theme, productDetailsData } = props;

	const priceWithOrWithoutDiscount = (price) => {
		return (
			<Typography
				marginTop="10px !important"
				marginBottom="10px !important"
				display="flex"
				alignItems="center"
				fontWeight="800"
				color="primary.main"
				sx={{
					fontSize: { xs: "24px", sm: "32px" },
				}}
				component="h2"
			>
				{price ===
				getDiscountedAmount(
					price,
					state.modalData[0]?.discount,
					state.modalData[0]?.discount_type,
					state.modalData[0]?.store_discount
				) ? (
					<>{getAmountWithSign(price)}</>
				) : (
					<>
						{
							<>
								{getAmountWithSign(
									getDiscountedAmount(
										price,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}
								<Typography
									variant="body1"
									marginLeft="8px"
									fontWeight="400"
									color={theme.palette.customColor.textGray}
									sx={{ fontSize: { xs: "13px", sm: "16px" } }}
								>
									<del>{getAmountWithSign(price)}</del>
								</Typography>
							</>
						}
					</>
				)}
			</Typography>
		);
	};
	const handlePriceRange = (priceOne, priceTwo) => {
		return (
			<Typography
				marginTop="10px !important"
				marginBottom="10px !important"
				display="flex"
				alignItems="center"
				fontWeight="800"
				color="primary.main"
				sx={{
					fontSize: { xs: "24px", sm: "32px" },
				}}
			>
				{state?.modalData?.[0]?.discount === 0 ? (
					<>
						{priceOne > priceTwo ? (
							<>
								{`${getAmountWithSign(
									getDiscountedAmount(
										priceOne,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} - ${getAmountWithSign(
									getDiscountedAmount(
										priceTwo,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} `}
							</>
						) : (
							<>
								{`  ${getAmountWithSign(
									getDiscountedAmount(
										priceTwo,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}-${getAmountWithSign(
									getDiscountedAmount(
										priceOne,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} `}
							</>
						)}
					</>
				) : (
					<>
						{priceOne < priceTwo ? (
							<>{`${getAmountWithSign(
								getDiscountedAmount(
									priceOne,
									state.modalData[0]?.discount,
									state.modalData[0]?.discount_type,
									state.modalData[0]?.store_discount
								)
							)} - ${getAmountWithSign(
								getDiscountedAmount(
									priceTwo,
									state.modalData[0]?.discount,
									state.modalData[0]?.discount_type,
									state.modalData[0]?.store_discount
								)
							)} `}</>
						) : (
							<>
								{` ${getAmountWithSign(
									getDiscountedAmount(
										priceTwo,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)} -${getAmountWithSign(
									getDiscountedAmount(
										priceOne,
										state.modalData[0]?.discount,
										state.modalData[0]?.discount_type,
										state.modalData[0]?.store_discount
									)
								)}`}
							</>
						)}

						<Typography
							variant="body1"
							marginLeft="8px"
							fontWeight="400"
							color={theme.palette.customColor.textGray}
							sx={{ fontSize: { xs: "13px", sm: "16px" } }}
						>
							<del>
								{priceOne < priceTwo ? (
									<>
										{" "}
										{`${getAmountWithSign(
											priceOne
										)} - ${getAmountWithSign(priceTwo)}`}
									</>
								) : (
									<>
										{" "}
										{` ${getAmountWithSign(
											priceTwo
										)}-${getAmountWithSign(priceOne)} `}
									</>
								)}
							</del>
						</Typography>
					</>
				)}
			</Typography>
		);
	};
	const handlePrice = () => {
		// Filter out variations that don't have valid prices
		const validVariations = state?.modalData[0]?.variations?.filter(
			(variation) => 
				variation?.price !== undefined && 
				variation?.price !== null && 
				!isNaN(Number(variation?.price)) &&
				Number(variation?.price) > 0
		) || [];

		// Only show variation prices if there are valid variations with prices
		if (validVariations.length > 0) {
			const firstPrice = Number(validVariations[0]?.price);
			const lastPrice = Number(validVariations[validVariations.length - 1]?.price);
			
			if (firstPrice === lastPrice) {
				// All variations have the same price
				return (
					<>
						{priceWithOrWithoutDiscount(firstPrice)}
					</>
				);
			} else {
				// Variations have different prices, show range
				return (
					<Stack direction="row" alignItems="center">
						{handlePriceRange(firstPrice, lastPrice)}
					</Stack>
				);
			}
		} else {
			// No valid variations, use base product price
			return <>{priceWithOrWithoutDiscount(state?.modalData[0]?.price)}</>;
		}
	};

	return <>{handlePrice()}</>;
};

PricePreviewWithStock.propTypes = {};

export default PricePreviewWithStock;
