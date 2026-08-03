import { alpha, Stack, Typography, useTheme } from "@mui/material";
import { Truck } from "lucide-react";
import moment from "moment/moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getDateFormatAnotherWay } from "utils/CustomFunctions";

export const formatOrderDeliveredDate = (date, timeFormat) => {
	if (!date) return null;
	if (timeFormat === "12") {
		return moment(date).format("ll hh:mm a");
	}
	return moment(date).format("ll HH:mm");
};

export const hasManualExpectedDelivery = (item) =>
	Boolean(
		item?.manual_expected_delivery_from ||
			item?.manual_expected_delivery_to ||
			item?.manual_expected_delivery_text
	);

export const resolveManualExpectedDeliveryItem = (record) => {
	if (!record) return null;
	if (hasManualExpectedDelivery(record)) return record;
	if (hasManualExpectedDelivery(record.item_details)) return record.item_details;
	if (hasManualExpectedDelivery(record.item)) return record.item;
	return null;
};

export const getStoreIdFromRecord = (record) => {
	if (!record) return null;
	return (
		record.store_id ??
		record.item_details?.store_id ??
		record.item?.store_id ??
		record.store?.id ??
		null
	);
};

export const shouldShowStoreDeliveryOnce = (
	items,
	index,
	resolveRecord = (item) => item
) => {
	const record = resolveRecord(items[index]);
	if (!hasManualExpectedDelivery(resolveManualExpectedDeliveryItem(record))) {
		return false;
	}

	const storeId = getStoreIdFromRecord(items[index]) ?? getStoreIdFromRecord(record);

	for (let i = 0; i < index; i++) {
		const prevRecord = resolveRecord(items[i]);
		if (
			!hasManualExpectedDelivery(resolveManualExpectedDeliveryItem(prevRecord))
		) {
			continue;
		}
		const prevStoreId =
			getStoreIdFromRecord(items[i]) ?? getStoreIdFromRecord(prevRecord);
		if (prevStoreId === storeId) {
			return false;
		}
	}

	return true;
};

const formatDeliveryDateRange = (from, to) => {
	if (from && to) {
		if (from === to) {
			return getDateFormatAnotherWay(from);
		}
		return `${getDateFormatAnotherWay(from)} - ${getDateFormatAnotherWay(to)}`;
	}
	if (from) {
		return getDateFormatAnotherWay(from);
	}
	if (to) {
		return getDateFormatAnotherWay(to);
	}
	return null;
};

const ManualExpectedDeliveryInfo = ({
	item,
	record,
	variant = "default",
	itemName,
	sx,
	showLabel = true,
	footerInset = false,
	deliveredDate,
}) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const { configData } = useSelector((state) => state.configData);

	let label = `${t("Estimated delivery:")}`;
	let displayValue = null;
	const resolvedItem = deliveredDate
		? null
		: resolveManualExpectedDeliveryItem(item ?? record);

	if (deliveredDate) {
		displayValue = formatOrderDeliveredDate(
			deliveredDate,
			configData?.timeformat
		);
		label = `${t("Delivered")}:`;
	} else if (resolvedItem) {
		const from = resolvedItem.manual_expected_delivery_from;
		const to = resolvedItem.manual_expected_delivery_to;
		const text = resolvedItem.manual_expected_delivery_text;
		displayValue = text || formatDeliveryDateRange(from, to);
	}

	if (!displayValue) {
		return null;
	}

	if (variant === "footer") {
		return (
			<Stack
				direction="row"
				alignItems="center"
				spacing={1}
				sx={{
					borderTop: (th) =>
						`1px solid ${alpha(th.palette.neutral[300], 0.45)}`,
					px: footerInset
						? { xs: 1.25, sm: 1.75 }
						: { xs: 1.5, sm: 2 },
					py: 1.25,
					...(footerInset && {
						backgroundColor: (th) =>
							th.palette.mode === "dark"
								? alpha(th.palette.common.white, 0.04)
								: alpha(th.palette.common.black, 0.03),
						borderBottomLeftRadius: "12px",
						borderBottomRightRadius: "12px",
					}),
					...sx,
				}}
			>
				<Truck
					size={16}
					style={{ flexShrink: 0 }}
					color={theme.palette.primary.main}
				/>
				<Typography fontSize="12px" lineHeight={1.4}>
					<Typography
						component="span"
						fontWeight={600}
						color="primary.main"
						fontSize="inherit"
					>
						{label}{" "}
					</Typography>
					<Typography
						component="span"
						fontWeight={400}
						color="customColor.textGray"
						fontSize="inherit"
					>
						{displayValue}
					</Typography>
				</Typography>
			</Stack>
		);
	}

	if (variant === "compact") {
		return (
			<Stack
				direction="row"
				alignItems="flex-start"
				spacing={0.5}
				mt={0.25}
				sx={sx}
			>
				<Truck
					size={14}
					style={{ flexShrink: 0, marginTop: 1 }}
					color={theme.palette.primary.main}
				/>
				<Typography
					fontSize="11px"
					fontWeight="400"
					color="customColor.textGray"
					lineHeight={1.35}
				>
					{itemName ? (
						<Typography
							component="span"
							fontSize="inherit"
							fontWeight="500"
							color="inherit"
						>
							{itemName}:{" "}
						</Typography>
					) : null}
					{showLabel ? (
						<Typography
							component="span"
							fontSize="inherit"
							fontWeight="500"
							color="primary.main"
						>
							{label}{" "}
						</Typography>
					) : null}
					{displayValue}
				</Typography>
			</Stack>
		);
	}

	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={0.75}
			sx={{
				mt: 1,
				display: "inline-flex",
				alignSelf: "flex-start",
				maxWidth: "100%",
				px: 1.25,
				py: 0.75,
				borderRadius: "8px",
				backgroundColor: alpha(theme.palette.primary.main, 0.08),
				border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
				...sx,
			}}
		>
			<Truck
				size={15}
				style={{ flexShrink: 0 }}
				color={theme.palette.primary.main}
			/>
			<Typography fontSize="12px" lineHeight={1.4}>
				<Typography
					component="span"
					fontWeight={600}
					color="primary.main"
					fontSize="inherit"
				>
					{label}{" "}
				</Typography>
				<Typography
					component="span"
					fontWeight={500}
					color="text.primary"
					fontSize="inherit"
				>
					{displayValue}
				</Typography>
			</Typography>
		</Stack>
	);
};

export default ManualExpectedDeliveryInfo;
