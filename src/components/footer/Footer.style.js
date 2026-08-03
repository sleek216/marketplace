import { Box, alpha, styled } from "@mui/material";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import { getCurrentModuleType } from "../../helper-functions/getCurrentModuleType";
import { ModuleTypes } from "../../helper-functions/moduleTypes";
export const StyledFooterBackground = styled(Box)(
	({ theme, nobottommargin }) => ({
		width: "100%",
		minWidth: 0,
		overflow: "hidden",
		backgroundColor: theme.palette.background.custom4,
		borderRadius: "20px 20px 0 0",
		marginTop: "-16px",
		[theme.breakpoints.down("md")]: {
			marginBottom: nobottommargin === "true" ? "none" : "70px",
			borderRadius: "16px 16px 0 0",
		},
		[theme.breakpoints.down("sm")]: {
			borderRadius: "12px 12px 0 0",
		},
	})
);

export const StyledFooterTop = styled(CustomStackFullWidth)(({ theme }) => ({
	backgroundColor:
		getCurrentModuleType() === ModuleTypes?.FOOD
			? alpha(theme.palette.moduleTheme.food, 0.051)
			: alpha(theme.palette.primary.main, 0.1),
	width: "100%",
	borderRadius: "16px",
	[theme.breakpoints.down("md")]: {
		paddingBottom:"20px"
	},
}));
