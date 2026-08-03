import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { alpha } from "@mui/material";
import { Stack } from "@mui/system";
import { PrimaryToolTip } from "components/cards/QuickView";

const ProductShareAction = ({ onClick, iconSize = "16px", size = "30px", sx }) => {
  return (
    <PrimaryToolTip text="Share">
      <Stack
        onClick={onClick}
        alignItems="center"
        justifyContent="center"
        sx={(theme) => ({
          width: size,
          height: size,
          borderRadius: "8px",
          cursor: "pointer",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
          backgroundColor: alpha(theme.palette.common.white, 0.35),
          backdropFilter: "blur(6px)",
          color: theme.palette.text.secondary,
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.5),
            color: theme.palette.primary.main,
          },
          ...sx,
        })}
      >
        <ShareOutlinedIcon sx={{ fontSize: iconSize }} />
      </Stack>
    </PrimaryToolTip>
  );
};

export default ProductShareAction;
