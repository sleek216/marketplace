import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../../src/components/layout/MainLayout";
import Categories from "../../../src/components/categories";
import { getServerSideProps } from "../../index";
import SEO from "../../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";
import { useTranslation } from "react-i18next";

const CategoriesDetailPage = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `${t("Category Details")}` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <Categories configData={configData} t={t} />
      </MainLayout>
    </>
  );
};

export default CategoriesDetailPage;
export { getServerSideProps };
