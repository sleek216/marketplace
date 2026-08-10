import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import ProductSearchPage from "../../src/components/search";
import { getServerSideProps } from "../index";
import SEO from "../../src/components/seo";
import { getImageUrl } from "utils/CustomFunctions";
import { useTranslation } from "react-i18next";

const SearchPage = ({ configData, landingPageData }) => {
  const { t } = useTranslation();
  return (
    <>
      <CssBaseline />
      <SEO
        title={configData ? `${t("Search")}` : "Loading..."}
        image={`${getImageUrl(
          { value: configData?.logo_storage },
          "business_logo_url",
          configData
        )}/${configData?.fav_icon}`}
        businessName={configData?.business_name}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <ProductSearchPage configData={configData} />
      </MainLayout>
    </>
  );
};

export default SearchPage;
export { getServerSideProps };
