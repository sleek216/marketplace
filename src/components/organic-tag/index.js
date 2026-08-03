import React from "react";
import { CustomBadgeWrapepr } from "../cards/CustomBadge";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";

const OrganicTag = (props) => {
  const { status, top, left, layout } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isInline = layout === "inline";
  return (
    <>
      {status === 1 ? (
        <CustomBadgeWrapepr
          layout={layout}
          bg_color={theme.palette.primary.main}
          top={isInline ? undefined : top}
          left={isInline ? undefined : left}
        >
          {t("Organic")}
        </CustomBadgeWrapepr>
      ) : null}
    </>
  );
};

OrganicTag.propTypes = {};

export default OrganicTag;
