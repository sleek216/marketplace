import React from "react";
import { CustomStackFullWidth } from "styled-components/CustomStyles.style";
import TabsTypeOne from "../custom-tabs/TabsTypeOne";
import { useSelector } from "react-redux";
import { Stack } from "@mui/system";
import CustomEmptyResult from "../custom-empty-result";
import nodataimage from "../../../public/static/no_wish_list.svg";
import { getItemsOrFoods } from "helper-functions/getItemsOrFoods";
import { getStoresOrRestaurants } from "helper-functions/getStoresOrRestaurants";
import WishListCard from "./WishListCard";
import StoreWishCard from "./StoreWishCard";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import RentalWishListCard from "components/home/module-wise-components/rental/components/global/RentalWishlistCard";
import ProviderWishCard from "components/home/module-wise-components/rental/components/global/ProviderWishCard";
import { Box } from "@mui/material";

const WishLists = (props) => {
  const { t, setSideDrawerOpen } = props;
  const { currentTab } = useSelector((state) => state.utilsData);
  const { wishLists } = useSelector((state) => state.wishList);

  const allItems = [...(wishLists?.item || []), ...(wishLists?.vehicles || [])];
  const allStores = [
    ...(wishLists?.store || []),
    ...(wishLists?.providers || []),
  ];

  const itemsTabTitle = getItemsOrFoods();
  const storesTabTitle = getStoresOrRestaurants();

  const tabsData = [
    {
      title: itemsTabTitle,
      value: itemsTabTitle,
      badgeCount: allItems.length,
    },
    {
      title: storesTabTitle,
      value: storesTabTitle,
      badgeCount: allStores.length,
    },
  ];

  const empty_items_text = `No favourite ${itemsTabTitle} found`;
  const empty_stores_text = `No favourite ${storesTabTitle} found`;
  const isStoresTab = currentTab === storesTabTitle;

  return (
    <CustomStackFullWidth
      sx={{
        flex: 1,
        minHeight: 0,
        height: "100%",
        px: { xs: 1.5, md: 2 },
        pt: 1.5,
        pb: 2,
      }}
    >
      <TabsTypeOne tabs={tabsData} currentTab={currentTab} t={t} />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          mt: 1.5,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {isStoresTab ? (
          <Stack spacing={1.25} width="100%">
            {allStores?.map((item) =>
              getCurrentModuleType() === "rental" ? (
                <ProviderWishCard
                  setSideDrawerOpen={setSideDrawerOpen}
                  data={item}
                  key={item?.id}
                />
              ) : (
                <StoreWishCard
                  setSideDrawerOpen={setSideDrawerOpen}
                  data={item}
                  key={item?.id}
                />
              )
            )}
            {allStores?.length === 0 && (
              <CustomEmptyResult
                label={t(empty_stores_text)}
                image={nodataimage}
                width="150px"
                height="none"
              />
            )}
          </Stack>
        ) : (
          <Stack spacing={1} width="100%">
            {allItems?.map((item) =>
              getCurrentModuleType() === "rental" ? (
                <RentalWishListCard key={item?.id} item={item} />
              ) : (
                <WishListCard key={item?.id} item={item} />
              )
            )}
            {allItems?.length === 0 && (
              <CustomEmptyResult
                label={t(empty_items_text)}
                image={nodataimage}
                width="150px"
                height="none"
              />
            )}
          </Stack>
        )}
      </Box>
    </CustomStackFullWidth>
  );
};

export default WishLists;
