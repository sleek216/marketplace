import {
	alpha,
	Box,
	Grid,
	styled,
	Tooltip,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import CustomContainer from "components/container";
import DollarSignHighlighter from "components/DollarSignHighlighter";
import { t } from "i18next";
import { CheckCircle2, Truck, Clock, Package } from "lucide-react";
import React from "react";

const ComponentTwoContainer = styled(Box)(
	({ theme, paddingTop, paddingBottom }) => ({
		marginTop: ".6rem",
		paddingTop: paddingTop ? paddingTop : "1.5rem",
		paddingBottom: paddingBottom ? paddingBottom : "1rem",
		background: theme.palette.background.default,
	})
);
// Function to replace emojis with Lucide icons in HTML content
const replaceEmojisInHTML = (htmlString, theme) => {
	if (!htmlString) return htmlString;
	
	const emojiMap = {
		'✅': `<span style="display: inline-flex; align-items: center; margin-right: 4px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.palette.primary.main}" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></span>`,
		'🚚': `<span style="display: inline-flex; align-items: center; margin-right: 4px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.palette.primary.main}" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 0-1.131.628L18 14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg></span>`,
		'⏱': `<span style="display: inline-flex; align-items: center; margin-right: 4px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.palette.primary.main}" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>`,
		'📦': `<span style="display: inline-flex; align-items: center; margin-right: 4px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${theme.palette.primary.main}" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></span>`,
	};
	
	let result = htmlString;
	for (const [emoji, svg] of Object.entries(emojiMap)) {
		result = result.replace(new RegExp(emoji, 'g'), svg);
	}
	
	return result;
};

const AvailableZoneSection = ({ zoneSection }) => {
	const theme = useTheme();
	const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
	const toolTipsContent = (zone) => {
		return (
			<>
				<Stack>
					<Typography paddingX="7px">{zone?.display_name}</Typography>
					<Stack direction="row" p="7px" flexWrap="wrap" gap="4px">
						{zone?.modules?.length > 0 ? (
							<Typography fontSize="12px">
								{t("Modules are")}{" "}
							</Typography>
						) : (
							<Typography fontSize="12px">
								{t("No module available")}
							</Typography>
						)}

						{/* Add a space after the text */}
						{zone?.modules?.map((item, index) => (
							<Typography key={index} fontSize="12px">
								{item}
								{index !== zone.modules.length - 1 ? "," : "."}
							</Typography>
						))}
					</Stack>
				</Stack>
			</>
		);
	};

	return (
		<ComponentTwoContainer
			background
			paddingTop={isSmall ? "0rem" : "1rem"}
			paddingBottom={{ xs: "0rem", md: "3rem" }}
		>
			<CustomContainer>
				<Grid
					container
					alignItems="center"
					justifyContent="center"
					spacing={{ xs: 2, md: 3 }}
				>
					<Grid
						item
						xs={12}
						sm={12}
						md={6}
						align={isSmall ? "center" : "left"}
					>
						<Box
							sx={{
								paddingTop: "1rem",
								maxHeight: "270px",
								overflowY: "auto",
								"&::-webkit-scrollbar": {
									width: "3px",
								},
								"&::-webkit-scrollbar-track": {
									backgroundColor: "#f0f0f0",
								},
								"&::-webkit-scrollbar-thumb": {
									backgroundColor: "#c1c1c1",
									borderRadius: "3px",
								},
								"&::-webkit-scrollbar-thumb:hover": {
									backgroundColor: "#003638",
								},
							}}
						>
							<Typography
								fontSize={{ xs: "18px", md: "30px" }}
								fontWeight={{ xs: "600", md: "700" }}
								component="h2"
								align={isSmall ? "center" : "left"}
							>
								<DollarSignHighlighter text={zoneSection?.available_zone_title} theme={theme} />
							</Typography>
							<Typography
								component="div"
								fontSize={{ xs: "12px", md: "16px" }}
								fontWeight={{ xs: "400", }}
								color={theme.palette.neutral[400]}
								paddingTop={isSmall ? "10px" : "0rem"}
								align={isSmall ? "center" : "left"}
								dangerouslySetInnerHTML={{ __html: replaceEmojisInHTML(zoneSection?.available_zone_short_description, theme) }}
							/>
						</Box>
					</Grid>
					<Grid
						item
						xs={12}
						sm={12}
						md={6}
						align={isSmall ? "center" : "right"}
					>
						<Box sx={{
							position: "relative",
							marginTop: { xs: "10px", md: "35px" },
							backgroundColor: theme => theme.palette.neutral[100],
							padding: { xs: ".5rem", md: "1rem" },
							borderRadius: "10px",
							boxShadow: "0px 3px 10px 0px #0000000F",



						}}>
							<Box
								sx={{
									height: 200,
									overflowY: "auto",
									paddingRight: "10px",
									"&::-webkit-scrollbar": {
										width: "3px",
									},
									"&::-webkit-scrollbar-track": {
										backgroundColor: "#f0f0f0",
									},
									"&::-webkit-scrollbar-thumb": {
										backgroundColor: "#c1c1c1",
										borderRadius: "3px",
									},
									"&::-webkit-scrollbar-thumb:hover": {
										backgroundColor: "#003638",
									},
									alignItems: "center",
									justifyContent: "center",
									display: "flex",
								}}
							>
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: "12px",
										maxWidth: "543px",
										justifyContent: { xs: "center", md: "flex-start" },

									}}
								>
									{zoneSection?.available_zone_list
										?.filter((item) => item?.modules?.length > 0)
										.map((zone, index) => (
											<Tooltip
												arrow
												placement="top"
												title={toolTipsContent(zone)}
												key={index}
											>
												<Box
													sx={{
														borderRadius: "10px",
														border: "1px solid",
														borderColor: alpha(
															theme.palette.neutral[400],
															0.2
														),
														backgroundColor: (theme) =>
															theme.palette.neutral[100],
														padding: { xs: "10px 15px", md: "10px 20px" },
														cursor: "pointer",
														fontSize: { xs: "16px", md: "18px" },
														fontWeight: 400,
														textAlign: "center",
														textDecoration: "none",
														"&:hover": {
															boxShadow: `0px 4px 12px 0px #0000001A;`,
															color: theme.palette.neutral[1000],
															fontWeight: 500,
														},
													}}
												>
													{zone?.display_name}
												</Box>
											</Tooltip>
										))}
								</Box>
							</Box>

							{/* The gradient overlay at the bottom */}

							{/* <Box
								sx={{
									position: "absolute",
									height: "62px",
									bottom: 0,
									left: 0,
									width: "100%",
									background: `linear-gradient(180deg, ${alpha(
										theme.palette.background.default,
										0.0
									)} 43.03%,  ${alpha(
										theme.palette.background.default,
										0.72
									)} 55.48%,  ${alpha(
										theme.palette.background.default,
										0.9
									)} 100%)`,
									pointerEvents: "none",
								}}
							/> */}
						</Box>
					</Grid>
				</Grid>
			</CustomContainer>
		</ComponentTwoContainer >
	);
};

export default AvailableZoneSection;
