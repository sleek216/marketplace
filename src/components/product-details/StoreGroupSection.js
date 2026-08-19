import { alpha, Box, Stack, Typography } from "@mui/material";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import React from "react";
import { t } from "i18next";
import CustomImageContainer from "../CustomImageContainer";

export const StoreGroupHeader = ({ storeName, storeLogo, storeId, itemCount, sx }) => {
	const canFetchStore = Boolean(storeId && storeId !== "__default__");
	const { data: storeData } = useGetStoreDetails(storeId, {
		enabled: canFetchStore && !storeLogo,
	});
	const resolvedLogo = storeLogo || storeData?.logo_full_url;
	const resolvedName = storeName || storeData?.name;

	if (!resolvedName && !resolvedLogo && !canFetchStore) {
		return null;
	}

	return (
		<Stack
			direction="row"
			alignItems="center"
			spacing={1.5}
			sx={{
				px: { xs: 1.5, sm: 2 },
				py: 1.25,
				borderBottom: (theme) =>
					`1px solid ${alpha(theme.palette.divider, 0.4)}`,
				...sx,
			}}
		>
			{resolvedLogo ? (
				<Box
					sx={{
						width: 40,
						height: 40,
						borderRadius: "8px",
						overflow: "hidden",
						flexShrink: 0,
						border: (theme) =>
							`1px solid ${alpha(theme.palette.divider, 0.25)}`,
						boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
					}}
				>
					<CustomImageContainer
						src={resolvedLogo}
						width="40px"
						height="40px"
						objectfit="cover"
						borderRadius="8px"
					/>
				</Box>
			) : null}
			<Stack spacing={0.25} minWidth={0} flex={1}>
				{resolvedName ? (
					<Typography fontWeight={700} fontSize={{ xs: "15px", sm: "16px" }} noWrap color="text.primary">
						{resolvedName}
					</Typography>
				) : null}
				{itemCount > 0 ? (
					<Typography fontSize="12px" color="text.secondary">
						{itemCount} {itemCount === 1 ? t("item") : t("items")}
					</Typography>
				) : null}
			</Stack>
		</Stack>
	);
};
