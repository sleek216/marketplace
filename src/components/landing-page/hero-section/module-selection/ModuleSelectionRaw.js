import { Typography, alpha, styled } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { ChevronRight as ArrowForwardIosIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { getCurrentModuleType } from "helper-functions/getCurrentModuleType";
import { setSelectedModule } from "redux/slices/utils";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
  SliderCustom,
} from "styled-components/CustomStyles.style";
import { IsSmallScreen } from "utils/CommonValues";

import { settings } from "./sliderSettings";
import useGetModule from "api-manage/hooks/react-query/useGetModule";
import { setModules } from "redux/slices/configData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NextImage from "components/NextImage";
import EastIcon from '@mui/icons-material/East';

const CardWrapper = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: "inherit",
  padding: "10px 12px",
  border: `1px solid ${alpha(theme.palette.neutral[400], 0.2)}`,
  borderRadius: "4px",
  cursor: "pointer",
  transition: "all ease 0.5s",
  position: "relative",
  zIndex: "99",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  boxShadow: "0px 8px 15px 0px #1C1E2008, 0px 0px 2px 0px #1C1E2014",
  // Mobile: 2 cards per row
  [theme.breakpoints.down('sm')]: {
    minWidth: "155px",
    flex: "none",
  },
  // Desktop: fixed width
  [theme.breakpoints.up('sm')]: {
    minWidth: "170px",
    flex: "none",
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.whiteContainer.main,
    ".text": {
      color: theme.palette.whiteContainer.main,
    },
    ".arrow": {
      color: theme.palette.whiteContainer.main,
    },
  },
}));

const LeftSection = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  flexDirection: "row",
  gap: "10px",
  minWidth: 0,
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  width: "34px",
  height: "34px",
  position: "relative",
  borderRadius: "4px",
  boxShadow: "0px 2px 5px 0px #00000014",
  overflow: "hidden",
}));

const ArrowWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
  transition: "color 0.3s ease",
  flexShrink: 0,
}));
const Card = ({ item, handleClick }) => {
  const { t } = useTranslation();

  return (
    <CardWrapper onClick={() => handleClick(item)}>
      <LeftSection>
        <ImageWrapper>
          <NextImage
            src={item?.icon_full_url}
            alt={item?.module_name}
            height={34}
            width={34}
            objectFit="contain"
            borderRadius="4px"
            priority
          />
        </ImageWrapper>

        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              fontSize: { xs: "14px", md: "16px" },
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { xs: "110px", sm: "130px" },
            }}

          >
            {item?.module_name}
          </Typography>
          <Typography
            variant="caption"
            className="text"
            sx={{
              fontSize: { xs: "10px", md: "11px" },
              color: "text.secondary",
              lineHeight: 1.15,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { xs: "110px", sm: "130px" },
              visibility:
                item?.module_type === "parcel" ? "hidden" : "visible",
              minHeight: "12px",
            }}
          >
            {item?.module_type !== "parcel" &&
              (item?.module_type === "ecommerce" ? (
                <>
                  {t("Over")}{" "}
                  {item?.items_count > 2
                    ? item?.items_count - 1
                    : item?.items_count}
                  {item?.items_count > 2 && "+"} {t("Items")}
                </>
              ) : (
                <>
                  {t("Over")}{" "}
                  {item?.stores_count > 2
                    ? item?.stores_count - 1
                    : item?.stores_count}
                  {item?.stores_count > 2 && "+"}{" "}
                  {item?.module_type === "food"
                    ? t("Restaurants")
                    : item?.module_type === "rental"
                      ? t("Providers")
                      : t("Stores")}
                </>
              ))}
          </Typography>
        </Stack>
      </LeftSection>

      <ArrowWrapper className="arrow">
        <EastIcon sx={{
          fontSize: "20px",
          color: "primary",
          transform: (theme) => theme.direction === 'rtl' ? 'scaleX(-1)' : 'none'
        }} />
      </ArrowWrapper>
    </CardWrapper>
  );
};

const ModuleSelectionRaw = (props) => {
  const { isSmall } = props;
  const dispatch = useDispatch();
  const { modules } = useSelector((state) => state.configData);
  const [isSelected, setIsSelected] = useState(getCurrentModuleType());
  const { data, refetch } = useGetModule();
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (data) {
      dispatch(setModules(data));
    }
  }, [data]);

  const router = useRouter();

  const handleClick = (item) => {
    setIsSelected(item?.module_type);
    dispatch(setSelectedModule(item));
    localStorage.setItem("module", JSON.stringify(item));
    router.replace("/home");
  };

  return (
    <>
      <CustomStackFullWidth
        justifyContent={{
          xs: "flex-start",
          sm: "center"
        }}
        flexDirection="row"
        alignItems="center"
        flexWrap="nowrap"
        gap="10px"
        mt="10px"
        sx={{
          overflowX: "auto",
          overflowY: "hidden",
          pb: 0.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {modules?.length > 0 &&
          modules.map((item, index) => {
            return (
              <Card
                key={index}
                item={item}
                isSelected={isSelected}
                handleClick={handleClick}
              />
            );
          })}
      </CustomStackFullWidth>
    </>
  );
};

ModuleSelectionRaw.propTypes = {};

export default ModuleSelectionRaw;
