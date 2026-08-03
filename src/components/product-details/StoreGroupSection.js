import { alpha, Box, Stack, Typography } from "@mui/material";
import useGetStoreDetails from "api-manage/hooks/react-query/store/useGetStoreDetails";
import React from "react";
import CustomImageContainer from "../CustomImageContainer";

export const StoreGroupHeader = ({ storeName, storeLogo, storeId, sx }) => {
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
				py: 1,
				borderBottom: (theme) =>
					`1px solid ${alpha(theme.palette.neutral[300], 0.45)}`,
				...sx,
			}}
		>
			{resolvedLogo ? (
				<Box
					sx={{
						width: 36,
						height: 36,
						borderRadius: "2px",
						overflow: "hidden",
						flexShrink: 0,
						border: (theme) =>
							`1px solid ${alpha(theme.palette.neutral[300], 0.35)}`,
					}}
				>
					<CustomImageContainer
						src={resolvedLogo}
						width="36px"
						height="36px"
						objectfit="cover"
						borderRadius="2px"
					/>
				</Box>
			) : null}
			{resolvedName ? (
				<Typography fontWeight={600} fontSize={{ xs: "15px", sm: "16px" }}>
					{resolvedName}
				</Typography>
			) : null}
		</Stack>
	);
};
