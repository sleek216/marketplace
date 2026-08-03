import React from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MessageCircle } from "lucide-react";
import { alpha } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

const StyledBox = styled(Box)(() => ({
	alignItems: "center",
	display: "flex",
	flexGrow: 1,
	flexDirection: "column",
	justifyContent: "center",
	overflow: "hidden",
	height: "100%",
	padding: "24px",
}));

const EmptyView = () => {
	const { t } = useTranslation();
	const theme = useTheme();
	return (
		<StyledBox>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 72,
					height: 72,
					borderRadius: "2px",
					backgroundColor: alpha(theme.palette.primary.main, 0.1),
					color: theme.palette.primary.main,
					mb: 2,
				}}
			>
				<MessageCircle size={32} strokeWidth={2} />
			</Box>
			<Typography
				color={theme.palette.neutral[1000]}
				variant="subtitle1"
				fontWeight={700}
				fontSize="15px"
				textAlign="center"
			>
				{t("No conversation selected")}
			</Typography>
			<Typography
				fontSize="13px"
				color={theme.palette.neutral[600]}
				textAlign="center"
				maxWidth="280px"
				sx={{ mt: 0.75 }}
			>
				{t("Choose a chat from the list to view messages and reply.")}
			</Typography>
		</StyledBox>
	);
};

export default EmptyView;
