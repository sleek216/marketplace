import React from "react";
import { alpha, Box, Stack, Typography } from "@mui/material";
import CustomImageContainer from "../../CustomImageContainer";
import { getAmountWithSign } from "helper-functions/CardHelpers";
import { CustomStackFullWidth } from "../../../styled-components/CustomStyles.style";

const CampaignOrders = ({ campaignItemList, t }) => {
	const listSurfaceSx = {
		backgroundColor: (th) =>
			th.palette.mode === "dark"
				? alpha(th.palette.common.white, 0.06)
				: "#f4f4f5",
		borderRadius: "12px",
		px: { xs: 1.25, sm: 1.75 },
		py: { xs: 0.5, sm: 0.75 },
	};

	return (
		<CustomStackFullWidth sx={listSurfaceSx}>
			{campaignItemList.map((item, index) => (
				<Stack
					key={item?.id}
					direction="row"
					alignItems="center"
					spacing={1.5}
					sx={{
						py: 1.25,
						...(index < campaignItemList.length - 1 && {
							borderBottom: (th) =>
								`1px solid ${alpha(th.palette.common.black, th.palette.mode === "dark" ? 0.12 : 0.06)}`,
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
							aria-label={`${t("Quantity")} ${item?.quantity}`}
							sx={{
								position: "absolute",
								top: -6,
								right: -6,
								minWidth: 22,
								height: 22,
								px: item?.quantity > 9 ? 0.5 : 0,
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
									`2px solid ${th.palette.mode === "dark" ? th.palette.grey[900] : "#f4f4f5"}`,
							}}
						>
							{item?.quantity}
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
								{item?.name}
							</Typography>
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
							{getAmountWithSign(item?.price)}
						</Typography>
					</Stack>
				</Stack>
			))}
		</CustomStackFullWidth>
	);
};

CampaignOrders.propTypes = {};

export default CampaignOrders;
