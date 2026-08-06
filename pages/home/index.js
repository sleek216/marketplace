import CssBaseline from "@mui/material/CssBaseline";
import Router from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setConfigData, setLandingPageData } from "redux/slices/configData";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";
import useGetLandingPage from "../../src/api-manage/hooks/react-query/useGetLandingPage";
import MainLayout from "../../src/components/layout/MainLayout";
import ModuleWiseLayout from "../../src/components/module-wise-layout";
import ZoneGuard from "../../src/components/route-guard/ZoneGuard";
import SEO from "../../src/components/seo";
import PageBootLoader from "../../src/components/PageBootLoader";

const hasContent = (obj) => obj && Object.keys(obj).length > 0;

const Home = () => {
	const dispatch = useDispatch();
	const {
		data: dataConfig,
		refetch: configRefetch,
		isFetching: configLoading,
	} = useGetConfigData();
	const {
		data: dataLanding,
		refetch: refetchLanding,
		isFetching: landingLoading,
	} = useGetLandingPage();

	const { landingPageData, configData } = useSelector(
		(state) => state.configData
	);

	const resolvedConfig = configData ?? dataConfig;
	const resolvedLanding = landingPageData ?? dataLanding;

	useEffect(() => {
		configRefetch();
		refetchLanding();
	}, []);

	useEffect(() => {
		if (resolvedLanding) {
			dispatch(setLandingPageData(resolvedLanding));
		}
	}, [resolvedLanding, dispatch]);

	useEffect(() => {
		if (!resolvedConfig) return;

		if (resolvedConfig.length === 0) {
			Router.push("/404");
		} else if (resolvedConfig?.maintenance_mode) {
			Router.push("/maintainance");
		} else {
			dispatch(setConfigData(resolvedConfig));
		}
	}, [resolvedConfig, dispatch]);

	const isLoading =
		!hasContent(resolvedConfig) && (configLoading || landingLoading);

	if (isLoading) {
		return (
			<>
				<CssBaseline />
				<PageBootLoader message="Loading home..." />
			</>
		);
	}

	return (
		<>
			<CssBaseline />
			{resolvedConfig && (
				<SEO
					title="Home"
					image={resolvedConfig?.fav_icon_full_url}
					businessName={resolvedConfig?.business_name}
					configData={resolvedConfig}
				/>
			)}

			<MainLayout
				configData={resolvedConfig}
				landingPageData={resolvedLanding}
			>
				<ModuleWiseLayout
					configData={resolvedConfig}
					landingPageData={resolvedLanding}
				/>
			</MainLayout>
		</>
	);
};

export default Home;

Home.getLayout = (page) => <ZoneGuard>{page}</ZoneGuard>;
