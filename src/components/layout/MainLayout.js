import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "react-query";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import { setSelectedModule } from "../../redux/slices/utils";
import { setConfigData } from "../../redux/slices/configData";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import FooterComponent from "../footer";
import HeaderComponent from "../header";
import BottomNav from "../header/BottomNav";
import ModuleLayoutRoot from "./ModuleLayoutRoot";
import useGetLandingPage from "api-manage/hooks/react-query/useGetLandingPage";

const MainLayout = ({ children, configData }) => {
	const [rerenderUi, setRerenderUi] = useState(false);
	const queryClient = useQueryClient();
	const { data, refetch } = useGetModule();
	const theme = useTheme();
	const isSmall = useMediaQuery("(max-width:1180px)");
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const router = useRouter();
	const { page } = router.query;
	// Hide footer on mobile when viewing the chat/inbox page
	const hideMobileFooter = isMobile && page === "inbox";
	const dispatch = useDispatch();
	useEffect(() => {
		if (configData) {
			dispatch(setConfigData(configData));
		}
	}, [configData, dispatch]);
	useEffect(() => {
		if (router.pathname === "/home") {
			refetch();
		}
	}, []);
	useEffect(() => {
		if (!data) return;

		if (data.length === 0) {
			refetch();
			return;
		}

		let storedModule;
		try {
			storedModule = JSON.parse(localStorage.getItem("module"));
		} catch (e) {
			storedModule = null;
		}

		const queryModuleId = router.query.module_id;
		const currentModule =
			(queryModuleId && data.find((item) => String(item.id) === String(queryModuleId))) ||
			(storedModule?.id && data.find((item) => String(item.id) === String(storedModule.id))) ||
			(storedModule?.module_type && data.find((item) => item.module_type === storedModule.module_type)) ||
			data[0];

		if (currentModule) {
			if (storedModule?.id !== currentModule.id) {
				localStorage.setItem("module", JSON.stringify(currentModule));
			}
			dispatch(setSelectedModule(currentModule));
		}

		// Make sure the stored zone actually serves the active module,
		// otherwise content APIs respond with 403 / empty data.
		const moduleZoneIds = currentModule?.zones?.map((zone) => zone.id) || [];
		let storedZone = null;
		try {
			storedZone = JSON.parse(localStorage.getItem("zoneid"));
		} catch (e) {
			storedZone = null;
		}
		const zoneOk =
			Array.isArray(storedZone) &&
			storedZone.length > 0 &&
			(moduleZoneIds.length === 0 ||
				storedZone.some((id) => moduleZoneIds.includes(id)));
		if (!zoneOk && moduleZoneIds.length > 0) {
			localStorage.setItem("zoneid", JSON.stringify(moduleZoneIds));
			// Refetch everything with the corrected zone header.
			queryClient.invalidateQueries();
			setRerenderUi((prevState) => !prevState);
		}
	}, [data]);
	const { landingPageData } = useSelector((state) => state.configData);
	const { data: landing, refetch: landingRefetch } = useGetLandingPage();
	useEffect(() => {
		if (!landingPageData) {
			landingRefetch();
		}
	}, []);

	return (
		<ModuleLayoutRoot justifyContent="space-between" key={rerenderUi}>
			<header>
				<HeaderComponent />
			</header>
			<CustomStackFullWidth
				mt={!isSmall ? "5.9rem" : isMobile ? "5.5rem" : "3.5rem"}
			>
				<CustomStackFullWidth sx={{ minHeight: router.pathname === "/track-order" ? "35vh" : "70vh" }}>
					{children}
				</CustomStackFullWidth>
			</CustomStackFullWidth>
			<footer>
				{!hideMobileFooter && (
					<FooterComponent
						configData={configData}
						landingPageData={landingPageData ?? landing}
					/>
				)}
			</footer>
			{isSmall && page !== "parcel" && <BottomNav />}
		</ModuleLayoutRoot>
	);
};

MainLayout.propTypes = {
	children: PropTypes.node,
};

export default React.memo(MainLayout);
