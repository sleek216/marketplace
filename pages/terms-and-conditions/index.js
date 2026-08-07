import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import { useSelector } from "react-redux";
import { useGetConfigData } from "../../src/api-manage/hooks/useGetConfigData";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const { configData: reduxConfigData } = useSelector(
    (state) => state.configData
  );
  const { data: apiConfigData, refetch: configRefetch } = useGetConfigData();

  const resolvedConfig = configData || reduxConfigData || apiConfigData;

  const { data, refetch, isFetching } = useGetPolicyPage(
    "/api/v1/terms-and-conditions"
  );
  useEffect(() => {
    refetch();
    if (!resolvedConfig) {
      configRefetch();
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <SEO
        title={t("Terms And Conditions")}
        businessName={resolvedConfig?.business_name}
        configData={resolvedConfig}
      />
      <MainLayout configData={resolvedConfig} landingPageData={landingPageData}>
        <PolicyPage
          data={data}
          title={t("Terms And Conditions")}
          isFetching={isFetching}
        />
      </MainLayout>
    </>
  );
};

export default Index;
export { getServerSideProps };
