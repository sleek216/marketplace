import React, { useEffect, useState, useRef } from "react";
import { CustomBoxFullWidth } from "styled-components/CustomStyles.style";
import { Grid, Skeleton, styled, useMediaQuery, useTheme, Tooltip } from "@mui/material";
import H1 from "../typographies/H1";
import HighToLow from "../../sort/HighToLow";
import { Box, Stack } from "@mui/system";
import { Grid3x3 as WindowIcon, List as ViewListIcon } from "lucide-react";
import Body2 from "../typographies/Body2";
import Filter from "../home/stores/Filter";
import Funnel from "../svg-components/Funnel";
import { t } from "i18next";
import NewSortBy from "components/search/NewSortBy";
import { alpha } from "@mui/material";

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
				marginBottom: "20px",
				position: "sticky",
				top: {xs:"55px",sm:"63px"},
				zIndex: 10,
				backgroundColor: isSticky ? "background.paper" : "transparent",
				paddingY: isSticky ? "10px" : "0px",
				paddingX: isSticky ? "10px" : "0px",
				transition: "all 0.2s ease"
			}}
		>
		<Grid container alignItems="center" justifyContent="space-between">
			<Grid item xs={6} md={6}>
				{isFetchingNextPage ? (
					<Skeleton variant="text" width="150px" />
				) : (
					<H1
						textTransform="capitalize"
						textAlign="start"
						text={textHandler()}
					/>
				)}
			</Grid>
			<Grid item xs={6} md={6}>
				<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.75} flexWrap="nowrap">
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
