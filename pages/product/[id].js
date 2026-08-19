import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import MainLayout from "../../src/components/layout/MainLayout";
import ProductDetails from "../../src/components/product-details/ProductDetails";
import { useDispatch, useSelector } from "react-redux";
import { setConfigData } from "redux/slices/configData";
import SEO from "../../src/components/seo";
import CustomContainer from "../../src/components/container";
import {NoSsr} from "@mui/material";

const Index = ({ configData, productDetailsData, landingPageData }) => {
  const dispatch = useDispatch();
  const { cartList, campaignItem } = useSelector((state) => state.cart);
  const [productDetails, setProductDetails] = useState([]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (configData) {
      dispatch(setConfigData(configData));
    }
  }, [configData, dispatch]);
  useEffect(() => {
    handleProductDetails();
  }, [productDetailsData, cartList]);

  const handleProductDetails = () => {
    if (productDetailsData) {
      if (cartList?.length > 0) {
        const isExist = cartList?.find(
          (item) => item?.id === productDetailsData?.id
        );

        if (isExist) {
          let tempData = {
            ...isExist,
            store_details: productDetailsData?.store_details,
          };
          setProductDetails([tempData]);
        } else {
          setProductDetails([productDetailsData]);
        }
      } else {
        setProductDetails([productDetailsData]);
      }
    } else {
      //productDetailsData only be null if this page is for campaign
      setProductDetails([{ ...campaignItem, isCampaignItem: true }]);
    }
  };
  return (
    <>
      <CssBaseline />
      <SEO
        title={
          configData
            ? `${productDetailsData?.name || productDetails[0]?.name}`
            : "Loading..."
        }
        image={`${configData?.base_urls?.item_image_url}/${productDetailsData?.image}`}
        businessName={configData?.business_name}
        description={`${productDetailsData?.description}`}
        configData={configData}
      />
      <MainLayout configData={configData} landingPageData={landingPageData}>
        <CustomContainer>
          {productDetails.length > 0 && (
            <NoSsr>
            <ProductDetails
              productDetailsData={productDetails[0]}
              configData={configData}
            />
            </NoSsr>
          )}
        </CustomContainer>
      </MainLayout>
    </>
  );
};

export default Index;
export const getServerSideProps = async (context) => {
  const productId = context.query.id;
  const moduleId = context.query.module_id;
  const productType = context.query?.product_type;


  const { req } = context;
  const language = req.cookies.languageSetting;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://marketplace.aibit.services";
  const configRes = await fetch(
    `${baseUrl}/api/v1/config`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
        "X-localization": language,
      },
    }
  );
  const config = await configRes.json();
  const landingPageRes = await fetch(
    `${baseUrl}/api/v1/react-landing-page`,
    {
      method: "GET",
      headers: {
        "X-software-id": 33571750,
        "X-server": "server",
        origin: process.env.NEXT_CLIENT_HOST_URL,
        "X-localization": language,
      },
    }
  );
  const landingPageData = await landingPageRes.json();

  let productDetailsData = null;
  try {
    let productDetailsRes = await fetch(
      `${baseUrl}/api/v1/items/details/${productId}`,
      {
        method: "GET",
        headers: {
          "X-software-id": 33571750,
          "X-server": "server",
          origin: process.env.NEXT_CLIENT_HOST_URL,
          "X-localization": language,
        },
      }
    );
    if (!productDetailsRes.ok && productId) {
      const match = String(productId).match(/-(\d+)$/);
      const numericId = match ? match[1] : (/^\d+$/.test(String(productId)) ? String(productId) : null);
      if (numericId && numericId !== String(productId)) {
        productDetailsRes = await fetch(
          `${baseUrl}/api/v1/items/details/${numericId}`,
          {
            method: "GET",
            headers: {
              "X-software-id": 33571750,
              "X-server": "server",
              origin: process.env.NEXT_CLIENT_HOST_URL,
              "X-localization": language,
            },
          }
        );
      }
    }
    if (productDetailsRes.ok) {
      productDetailsData = await productDetailsRes.json();
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
  }

  return {
    props: {
      configData: config,
      productDetailsData: productDetailsData,
      landingPageData: landingPageData,
    },
  };
};
