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
  try {
    const configRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
      {
        method: "GET",
        headers: {
          "X-software-id": 33571750,
          "X-server": "server",
          origin: process.env.NEXT_CLIENT_HOST_URL || "http://localhost:3000",
        },
      }
    );

    if (configRes.ok) {
      const config = await configRes.json();
      return {
        props: {
          configData: config,
        },
      };
    }
  } catch (error) {
    // console.error("Error fetching config in getServerSideProps:", error);
  }

  return {
    props: {
      configData: null,
    },
  };
};

export default Root;
