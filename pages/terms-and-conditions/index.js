import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import PolicyPage from "../../src/components/policy-page";
import useGetPolicyPage from "../../src/api-manage/hooks/react-query/useGetPolicyPage";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";

const Index = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  const { data, refetch, isFetching } = useGetPolicyPage(
    "/api/v1/terms-and-conditions"
  );
  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <CssBaseline />
      <SEO
        title={t("Terms And Conditions")}
        businessName={configData?.business_name}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
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
