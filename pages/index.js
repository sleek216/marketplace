import { LandingLayout } from "components/layout/LandingLayout";
import LandingPage from "../src/components/landing-page";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setConfigData, setLandingPageData } from "redux/slices/configData";
import Router from "next/router";
import SEO from "../src/components/seo";
import useGetLandingPage from "../src/api-manage/hooks/react-query/useGetLandingPage";
import { useGetConfigData } from "../src/api-manage/hooks/useGetConfigData";
import PageBootLoader from "../src/components/PageBootLoader";

const hasContent = (obj) => obj && Object.keys(obj).length > 0;

const Root = () => {
	const { data, refetch, isFetching: landingLoading } = useGetLandingPage();
	const dispatch = useDispatch();
	const {
		data: dataConfig,
		refetch: configRefetch,
		isFetching: configLoading,
	} = useGetConfigData();

	const pageData = data;
	const config = dataConfig;

	useEffect(() => {
		configRefetch();
		refetch();
	}, []);

	useEffect(() => {
		if (pageData) {
			dispatch(setLandingPageData(pageData));
		}
		if (config) {
			if (config.length === 0) {
				Router.push("/404");
			} else if (config?.maintenance_mode) {
				Router.push("/maintainance");
			} else {
				dispatch(setConfigData(config));
			}
		}
	}, [config, pageData, dispatch]);

	const isLoading =
		(!pageData || !config) && (landingLoading || configLoading);

	if (isLoading) {
		return (
			<>
				<CssBaseline />
				<PageBootLoader message="Loading marketplace..." />
			</>
		);
	}

	if (!hasContent(pageData) || !hasContent(config)) {
		return (
			<>
				<CssBaseline />
				<PageBootLoader message="Unable to load. Please refresh the page." />
			</>
		);
	}

	return (
		<>
			<CssBaseline />
			<SEO
				image={pageData?.meta_image || config?.fav_icon_full_url}
				businessName={config?.business_name}
				configData={config}
				title={pageData?.meta_title || config?.business_name}
				description={pageData?.meta_description || config?.meta_description}
			/>
			<LandingLayout configData={config} landingPageData={pageData}>
				<LandingPage configData={config} landingPageData={pageData} />
			</LandingLayout>
		</>
	);
};

export const getServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default Root;
