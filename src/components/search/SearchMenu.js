import React, { useEffect, useState, useRef } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import {
  Box,
  Stack,
  Grid,
  Skeleton,
  styled,
  useMediaQuery,
  useTheme,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import HighToLow from "../../sort/HighToLow";
import { Grid3x3 as WindowIcon, List as ViewListIcon } from "lucide-react";
import Body2 from "../typographies/Body2";
import Filter from "../home/stores/Filter";
import Funnel from "../svg-components/Funnel";
import { t } from "i18next";
import NewSortBy from "components/search/NewSortBy";

const ToggleGroup = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: alpha(theme.palette.neutral[400], 0.12),
  borderRadius: "8px",
  padding: "3px",
  gap: "2px",
  width: "fit-content",
}));

const ToggleOption = styled(Box)(({ theme, active }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  cursor: "pointer",
  borderRadius: "6px",
  padding: "5px 10px",
  transition: "all 0.2s ease",
  userSelect: "none",
  backgroundColor:
    active === "true" ? theme.palette.background.paper : "transparent",
  color:
    active === "true"
      ? theme.palette.primary.main
      : theme.palette.neutral[500],
  boxShadow:
    active === "true"
      ? `0 1px 3px ${alpha(theme.palette.neutral[1000], 0.15)}`
      : "none",
  "&:hover": {
    color:
      active !== "true" && theme.palette.primary.main,
    backgroundColor:
      active !== "true" && alpha(theme.palette.background.paper, 0.5),
  },
}));

const SearchMenu = (props) => {
	const {
		currentView,
		setCurrentView,
		handleSortBy,
		sortBy,
		totalDataCount,
		currentTab,
		tabs,
		isRefetching,
		setOpenSideDrawer,
		priceRange,
		filterDataAndFunctions,
		filterData,
		setFilterData,
		setIsClicked,
		isFetchingNextPage,
		minMax,
		setMinMax,
		handleSortByNew,
		newSort,
	} = props;
	const total = 1000;
	const [showView, setShowView] = useState(true);
	const [isSticky, setIsSticky] = useState(false);
	const stickyRef = useRef(null);
	const theme = useTheme();
	const isSmallSize = useMediaQuery(theme.breakpoints.down("sm"));
	useEffect(() => {
		if (currentTab === 0) {
			setShowView(true);
		} else {
			setShowView(false);
		}
	}, [currentTab]);

	useEffect(() => {
		const handleScroll = () => {
			if (stickyRef.current) {
				const rect = stickyRef.current.getBoundingClientRect();
				// Element is sticky when it's at the top position (63px from viewport top)
				setIsSticky(rect.top <= 63);
			}
		};

		window.addEventListener('scroll', handleScroll);
		handleScroll(); // Check initial state

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	const found = t("Found");
	const textHandler = () => {
		return `${totalDataCount ?? 0} ${tabs[currentTab]?.value} ${found}`;
	};

	return (
		<CustomBoxFullWidth
			ref={stickyRef}
			sx={{
				position: "sticky",
				top: { xs: "55px", sm: "72px" },
				zIndex: 10,
				backgroundColor: isSticky
					? (theme) => alpha(theme.palette.background.paper, 0.96)
					: "background.paper",
				backdropFilter: isSticky ? "blur(8px)" : "none",
				py: isSticky ? 1 : 0,
				mx: isSticky ? -0.5 : 0,
				px: isSticky ? 0.5 : 0,
				borderBottom: (theme) =>
					isSticky
						? `1px solid ${alpha(theme.palette.divider, 0.5)}`
						: "none",
				transition: "all 0.2s ease",
			}}
		>
		<Grid
			container
			alignItems="center"
			justifyContent="space-between"
			columnSpacing={1.5}
			rowSpacing={1}
		>
			<Grid item xs={12} sm="auto" sx={{ minWidth: 0 }}>
				{isFetchingNextPage ? (
					<Skeleton variant="text" width="160px" height="28px" />
				) : (
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: { xs: "15px", sm: "16px", md: "18px" },
							lineHeight: 1.3,
							color: "text.primary",
							letterSpacing: "-0.02em",
							whiteSpace: "nowrap",
						}}
					>
						{totalDataCount ?? 0} {t(tabs[currentTab]?.value || "Items")} {t("Found")}
					</Typography>
				)}
			</Grid>
			<Grid item xs={12} sm>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent={{ xs: "flex-start", sm: "flex-end" }}
					spacing={0.75}
					flexWrap="wrap"
					useFlexGap
				>
					{/* Grid / List toggle */}
					{showView && (
						<ToggleGroup sx={{ flexShrink: 0 }}>
							<Tooltip title="Grid view" placement="bottom" arrow>
								<ToggleOption
									active={currentView === 0 ? "true" : "false"}
									onClick={() => setCurrentView(0)}
								>
									<WindowIcon size={16} />
									{!isSmallSize && (
										<Body2 text="Grid" sx={{ fontSize: "12px", lineHeight: 1 }} />
									)}
								</ToggleOption>
							</Tooltip>
							<Tooltip title="List view" placement="bottom" arrow>
								<ToggleOption
									active={currentView === 1 ? "true" : "false"}
									onClick={() => setCurrentView(1)}
								>
									<ViewListIcon size={16} />
									{!isSmallSize && (
										<Body2 text="List" sx={{ fontSize: "12px", lineHeight: 1 }} />
									)}
								</ToggleOption>
							</Tooltip>
						</ToggleGroup>
					)}

					{/* Sort By — desktop only */}
					{!isSmallSize && showView && (
						<HighToLow handleSortBy={handleSortBy} sortBy={sortBy} />
					)}
					{!isSmallSize && currentTab === 1 && (
						<NewSortBy handleSortBy={handleSortByNew} newSort={newSort} />
					)}

					{/* Filter button */}
					<Box sx={{ flexShrink: 0 }}>
						{isSmallSize ? (
							<Box
								onClick={() => setOpenSideDrawer(true)}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "primary.main",
									border: (theme) =>
										`1px solid ${theme.palette.primary.main}`,
									borderRadius: { xs: "3px", sm: "8px" },
									paddingTop: "5px",
									cursor: "pointer",
									"&:hover": {
										backgroundColor: (theme) =>
											theme.palette.primary.secondary,
									},
									// width: "40px",
								}}
							>
								<Funnel />
							</Box>
						) : (
						<Filter
							minMax={minMax}
							setMinMax={setMinMax}
							border
							priceRange={priceRange}
							filterDataAndFunctions={filterDataAndFunctions}
							filterData={filterData}
							setFilterData={setFilterData}
							currentTab={currentTab}
						/>
					)}
				</Box>
				</Stack>
			</Grid>
		</Grid>
	</CustomBoxFullWidth>
);
};

SearchMenu.propTypes = {};

export default SearchMenu;
