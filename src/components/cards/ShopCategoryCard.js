import { Skeleton, Tooltip, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { getModuleId } from "../../helper-functions/getModuleId";
import { textWithEllipsis } from "../../styled-components/TextWithEllipsis";
import NextImage from "components/NextImage";
import useTextEllipsis from "api-manage/hooks/custom-hooks/useTextEllipsis";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";

const ShopCategoryCard = (props) => {
  const { item, imageUrl, onlyshimmer } = props;
  const theme = useTheme();
  const { ref: textRef, isEllipsed } = useTextEllipsis(item?.name);
  const classes = textWithEllipsis();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        height: "100%",
        p: { xs: 1, sm: 1.25 },
        borderRadius: "12px",
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        transition: "border-color 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 6px 16px rgba(0,0,0,0.28)"
              : "0 6px 16px rgba(0,0,0,0.08)",
        },
      }}
    >
      <Link
        href={{
          pathname: "/home",
          query: {
            search: "category",
            id: `${item?.id}`,
            module_id: `${getModuleId()}`,
            name: item?.name && item?.name,
            data_type: "category",
          },
        }}
        passHref
        style={{ width: "100%", textDecoration: "none" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: "10px",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "action.hover"
                  : theme.palette.neutral?.[100] || "#f5f5f5",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              "& img": { transition: "transform 0.3s ease" },
              "&:hover img": { transform: "scale(1.05)" },
            }}
          >
            {onlyshimmer ? (
              <Skeleton variant="rounded" width="100%" height="100%" />
            ) : imageUrl ? (
              <Box
                sx={{
                  width: "78%",
                  height: "78%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NextImage
                  height={56}
                  width={56}
                  src={imageUrl}
                  objectFit="contain"
                  bg="transparent"
                />
              </Box>
            ) : (
              <StorefrontOutlinedIcon
                sx={{ fontSize: 28, color: "text.secondary" }}
              />
            )}
          </Box>
          <Tooltip
            title={isEllipsed ? item?.name : ""}
            placement="bottom"
            arrow
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: (t) => t.palette.toolTipColor,
                  "& .MuiTooltip-arrow": {
                    color: (t) => t.palette.toolTipColor,
                  },
                },
              },
            }}
          >
            <Typography
              ref={textRef}
              className={classes.singleLineEllipsis}
              sx={{
                mt: 1,
                fontSize: { xs: "11px", md: "12px" },
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.25,
                width: "100%",
                textAlign: "center",
              }}
            >
              {onlyshimmer ? <Skeleton variant="text" width="50px" /> : item?.name}
            </Typography>
          </Tooltip>
        </Box>
      </Link>
    </Box>
  );
};

export default ShopCategoryCard;
