import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import { alpha, styled, useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { getLanguage } from "../../../helper-functions/getLanguage";
import { RTL } from "../../rtl";

const ButtonContainer = styled(Box)(
	({ theme, right, isdisabled, noBackground, isRtl, rightSpace }) => ({
		top: 0,
		height: "100%",
		width: "42px",
		transition:
			"background-image 0.3s ease-in-out, transform 0.3s ease-in-out", // Adding transitions for smooth background image and transform changes
		transform: "translateX(0)", // Initial transform,
		background: "none",

		zIndex: 1,
		right: right === "true" && "-8px",
		left: right !== "true" && 0,
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		display: isdisabled ? "none" : "flex",
		borderTopRightRadius: "12px",
		borderBottomRightRadius: "12px",
		[theme.breakpoints.down("sm")]: {
			display: "none",
		},
	})
);
const PrevWrapper = styled(Box)(({ theme, isdisabled }) => ({
	zIndex: 1,
	top: "50%",
	transform: "translateY(-50%)",
	left: 0,
	display: isdisabled ? "none" : "flex",
	alignItems: "center",
	justifyContent: "center",
	// backgroundColor: "rgba(255, 255, 255, 0.8)",
	backgroundColor: theme.palette.primary.main,
	boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
	height: "35px",
	width: "35px",
	borderRadius: "50%",
	border: `1px solid ${alpha(theme.palette.whiteContainer.main, 0.45)}`,
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},
}));
const NextWrapper = styled(Box)(({ theme, isdisabled }) => ({
	top: "50%",
	transform: "translateY(-50%)",
	zIndex: 1,
	right: 8,
	display: isdisabled ? "none" : "flex",
	// backgroundColor: "rgba(255, 255, 255, 0.8)",
	backgroundColor: theme.palette.primary.main,
	borderRadius: "50%",
	boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
	alignItems: "center",
	justifyContent: "center",
	height: "35px",
	width: "35px",
	border: `1px solid ${alpha(theme.palette.whiteContainer.main, 0.45)}`,
	"&:hover": {
		backgroundColor: theme.palette.primary.deep,
	},
}));
export const NextFood = ({
	onClick,
	className,
	displayNoneOnMobile,
	noBackground,
	rightSpace,
}) => {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
	return (
		<ButtonContainer
			isdisabled={displayNone || className?.includes("slick-disabled")}
			right="true"
			noBackground={noBackground ? "true" : "false"}
			isRtl={getLanguage()}
			rightSpace={rightSpace}
		>
			<NextWrapper
				className={`client-nav client-next ${className}`}
				onClick={onClick}
				isdisabled={className?.includes("slick-disabled")}
			>
				{getLanguage() === "rtl" ? (
					<ChevronLeftIcon
						size={20}
						style={{ color: theme.palette.whiteContainer.main }}
					/>
				) : (
					<ChevronRightIcon
						size={20}
						style={{ color: theme.palette.whiteContainer.main }}
					/>
				)}
			</NextWrapper>
		</ButtonContainer>
	);
};
export const PrevFood = ({
	onClick,
	className,
	displayNoneOnMobile,
	noBackground,
	lanDirection,
}) => {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const displayNone = isSmall ? (displayNoneOnMobile ? true : false) : false;
	const rtl = getLanguage();

	return (
		<ButtonContainer
			isdisabled={displayNone || className?.includes("slick-disabled")}
			noBackground={noBackground ? "true" : "false"}
			isRtl={rtl}
		>
			<PrevWrapper
				className={`client-nav client-prev ${className}`}
				onClick={onClick}
				isdisabled={className?.includes("slick-disabled")}
			>
				{getLanguage() === "rtl" ? (
					<ChevronRightIcon
						size={20}
						style={{ color: theme.palette.whiteContainer.main }}
					/>
				) : (
					<ChevronLeftIcon
						size={20}
						style={{ color: theme.palette.whiteContainer.main }}
					/>
				)}
			</PrevWrapper>
		</ButtonContainer>
	);
};
