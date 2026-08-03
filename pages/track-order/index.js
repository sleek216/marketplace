import React, { useEffect } from "react";
import TrackOrderInput from "../../src/components/track-order/TrackOrderInput";
import CssBaseline from "@mui/material/CssBaseline";
import SEO from "../../src/components/seo";
import MainLayout from "../../src/components/layout/MainLayout";
import { getServerSideProps } from "../index";
import PolicyPage from "../../src/components/policy-page";
import CustomContainer from "../../src/components/container";
import { useDispatch } from "react-redux";
import { setConfigData } from "../../src/redux/slices/configData";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";

const TrackOrder = ({ configData }) => {
  const dispatch = useDispatch();
  const { data: dataConfig, refetch: configRefetch } = useGetConfigData();

  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    } else if (dataConfig) {
      dispatch(setConfigData(dataConfig));
    } else {
      configRefetch();
    }
  }, [configData, dataConfig, dispatch, configRefetch]);

  return (
    <div>
      <CssBaseline />
      <SEO
        image={`${configData?.base_urls?.business_logo_url}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData}>
        <CustomContainer>
          <TrackOrderInput configData={configData} />
        </CustomContainer>
      </MainLayout>
    </div>
  );
};

export default TrackOrder;
export { getServerSideProps };
