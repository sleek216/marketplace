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
import { RTL } from "components/rtl";

const hasContent = (obj) => obj && Object.keys(obj).length > 0;

const Root = (props) => {
	const { configData, landingPageData } = props;
	const { data, refetch } = useGetLandingPage();
	const dispatch = useDispatch();
	const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

	// Render immediately with server-fetched data; client refetch only fills gaps.
	const pageData = data ?? (hasContent(landingPageData) ? landingPageData : undefined);
	const config = dataConfig ?? (hasContent(configData) ? configData : undefined);

	useEffect(() => {
		if (!hasContent(configData)) configRefetch();
		if (!hasContent(landingPageData)) refetch();
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
	}, [config, pageData]);
	let lanDirection = undefined;

	if (typeof window !== "undefined") {
		lanDirection = JSON.parse(localStorage.getItem("settings"));
		// languageSetting = JSON.parse(localStorage.getItem("language-setting"));
	}
	// console.log({ lanDirection })
	return (
		<>
			<CssBaseline />
			{/* <DynamicFavicon configData={configData} /> */}
			<SEO
				image={landingPageData?.meta_image || configData?.fav_icon_full_url}
				businessName={configData?.business_name}
				configData={configData}
				title={landingPageData?.meta_title || configData?.business_name}
				description={landingPageData?.meta_description || configData?.meta_description}
			/>
			{pageData && (
				<LandingLayout configData={config} landingPageData={pageData}>

					<LandingPage
						configData={config}
						landingPageData={pageData}
					/>

				</LandingLayout>
			)}
		</>
	);
};
export default Root;
export const getServerSideProps = async (context) => {
	const { req, res } = context;
	const language = req.cookies?.languageSetting;
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

	const headers = {
		"X-software-id": 33571750,
		"X-server": "server",
		"X-localization": language,
		origin: process.env.NEXT_CLIENT_HOST_URL,
	};

	const timeoutMs = Number(process.env.NEXT_PUBLIC_SSP_FETCH_TIMEOUT_MS) || 25000;
	const fetchSignal =
		typeof AbortSignal !== "undefined" && AbortSignal.timeout
			? AbortSignal.timeout(timeoutMs)
			: undefined;

	const fetchJson = async (path) => {
		if (!baseUrl) {
			throw new Error("NEXT_PUBLIC_BASE_URL is not set");
		}
		const response = await fetch(`${baseUrl}${path}`, {
			method: "GET",
			headers,
			...(fetchSignal ? { signal: fetchSignal } : {}),
		});
		if (!response.ok) {
			throw new Error(`${path} failed: ${response.status} ${response.statusText}`);
		}
		return response.json();
	};

	const [configResult, landingResult] = await Promise.allSettled([
		fetchJson("/api/v1/config"),
		fetchJson("/api/v1/react-landing-page"),
	]);

	const config = configResult.status === "fulfilled" ? configResult.value : null;
	const landingPageData = landingResult.status === "fulfilled" ? landingResult.value : null;

	if (configResult.status === "rejected") {
		console.warn(
			"[getServerSideProps] /api/v1/config:",
			configResult.reason?.cause?.message || configResult.reason?.message || configResult.reason
		);
	}
	if (landingResult.status === "rejected") {
		console.warn(
			"[getServerSideProps] /api/v1/react-landing-page:",
			landingResult.reason?.cause?.message || landingResult.reason?.message || landingResult.reason
		);
	}

	// Set cache control headers for 1 hour (3600 seconds)
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=3600, stale-while-revalidate"
	);

	return {
		props: {
			configData: config ?? {},
			landingPageData: landingPageData ?? {},
		},
	};
};