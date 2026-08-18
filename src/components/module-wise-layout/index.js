import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModules } from "redux/slices/configData";
import { setResetStoredData } from "redux/slices/storedData";
import { setSelectedModule } from "redux/slices/utils";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import useGetModule from "../../api-manage/hooks/react-query/useGetModule";
import HomePageComponents from "../home/HomePageComponents";
import ModuleSelect from "../module-select/ModuleSelect";

const ModuleWiseLayout = ({ configData, landingPageData }) => {
	const { selectedModule } = useSelector((state) => state.utilsData);
	const { data } = useGetModule();
	const dispatch = useDispatch();
	const router = useRouter();

	useEffect(() => {
		if (data?.length > 0) {
			dispatch(setModules(data));
		}
	}, [data, dispatch]);

	// Reset stored data when module changes — but do NOT remount HomePageComponents
	const prevModuleIdRef = React.useRef(null);
	useEffect(() => {
		if (!selectedModule?.id) return;
		if (prevModuleIdRef.current !== null && prevModuleIdRef.current !== selectedModule.id) {
			dispatch(setResetStoredData());
		}
		prevModuleIdRef.current = selectedModule.id;
	}, [selectedModule?.id]);

	const isListingView = Boolean(
		router.query.search || router.query.data_type
	);

	const moduleSelectHandler = async (item) => {
		if (router.query.search || router.query.data_type) {
			await router.replace("/home");
		}
		localStorage.setItem("module", JSON.stringify(item));
		dispatch(setSelectedModule(item));
		router.push(
			{
				pathname: "/home",
				query: { module_id: item.id },
			},
			undefined,
			{ shallow: true }
		);
	};

	return (
		<CustomStackFullWidth
			sx={{
				pr: { xs: 0, md: isListingView ? 0 : "100px" },
			}}
		>
			{data && data.length > 1 && selectedModule && !isListingView && (
				<ModuleSelect
					moduleSelectHandler={moduleSelectHandler}
					selectedModule={selectedModule}
					data={data}
					dispatch={dispatch}
				/>
			)}
			<HomePageComponents
				configData={configData}
				landingPageData={landingPageData}
			/>
		</CustomStackFullWidth>
	);
};

export default React.memo(ModuleWiseLayout);
