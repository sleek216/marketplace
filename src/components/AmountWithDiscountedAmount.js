import { Stack, Typography, useTheme } from "@mui/material";
import {
	getAmountWithSign,
	getDiscountedAmount,
	getProductDiscountPercent,
} from "../helper-functions/CardHelpers";
import { getCurrentModuleType } from "../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../helper-functions/moduleTypes";

const AmountWithDiscountedAmount = ({ item, noPrimaryColor, compact = false }) => {
	const theme = useTheme();
	const isFood = getCurrentModuleType() === ModuleTypes.FOOD;

	const discounted = getDiscountedAmount(
		item?.price,
		item?.discount,
		item?.discount_type,
		item?.store_discount,
		item?.quantity
	);
	const hasDiscount =
		discounted !== item?.price && Number(item?.price) > 0;
	const discountPercent = getProductDiscountPercent(item);

	const saleColor = noPrimaryColor
		? theme.palette.text.primary
		: isFood
			? theme.palette.moduleTheme.food
			: theme.palette.primary.main;

	const saleFontSize = compact
		? { xs: "14px", sm: "15px" }
		: { xs: "15px", sm: "17px" };
	const metaFontSize = compact ? "11px" : "12px";

	if (!hasDiscount) {
		return (
			<Typography
				component="span"
				sx={{
					fontSize: saleFontSize,
					fontWeight: 700,
					color: saleColor,
					lineHeight: 1.2,
				}}
			>
				{getAmountWithSign(discounted)}
			</Typography>
		);
	}

	return (
		<Stack spacing={0.25} alignItems="flex-start">
			<Typography
				component="span"
				sx={{
					fontSize: saleFontSize,
					fontWeight: 700,
					color: saleColor,
					lineHeight: 1.2,
				}}
			>
				{getAmountWithSign(discounted)}
			</Typography>
			<Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
				<Typography
					component="span"
					sx={{
						fontSize: metaFontSize,
						color: theme.palette.text.disabled,
						textDecoration: "line-through",
						lineHeight: 1.2,
					}}
				>
					{getAmountWithSign(item?.price)}
				</Typography>
				{discountPercent > 0 && (
					<Typography
						component="span"
						sx={{
							fontSize: metaFontSize,
							fontWeight: 600,
							color: theme.palette.text.primary,
							lineHeight: 1.2,
						}}
					>
						-{discountPercent}%
					</Typography>
				)}
			</Stack>
		</Stack>
	);
};

export default AmountWithDiscountedAmount;
