import React from "react";
import { alpha, Button, Typography, useTheme } from "@mui/material";
import {
  Circle as RadioButtonUncheckedIcon,
  CircleDot as RadioButtonCheckedIcon,
} from "lucide-react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const CustomMessageReasonBox = ({
  handleClick,
  automateMessageData,
  selected,
}) => {
  const theme = useTheme();

  return (
    <SimpleBar
      style={{ maxHeight: 240, overflowX: "hidden", paddingInlineEnd: "4px" }}
    >
      {automateMessageData?.map((data, index) => {
        const isSelected = selected === data?.id;
        return (
          <Button
            key={data?.id ?? index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              textTransform: "none",
              borderRadius: "2px",
              border: "1px solid",
              borderColor: isSelected
                ? theme.palette.primary.main
                : alpha(theme.palette.divider, 0.85),
              bgcolor: isSelected
                ? alpha(theme.palette.primary.main, 0.08)
                : theme.palette.background.paper,
              padding: "10px 14px",
              boxShadow: "none",
              mb: 1,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
            }}
            onClick={() => handleClick(data)}
          >
            <Typography
              fontSize="13px"
              fontWeight={isSelected ? 600 : 400}
              color={
                isSelected
                  ? theme.palette.primary.main
                  : theme.palette.neutral[700]
              }
              textAlign="left"
              sx={{ flex: 1, pr: 1 }}
            >
              {data?.message}
            </Typography>
            {isSelected ? (
              <RadioButtonCheckedIcon
                size={18}
                color={theme.palette.primary.main}
                strokeWidth={2.2}
              />
            ) : (
              <RadioButtonUncheckedIcon
                size={18}
                color={theme.palette.neutral[400]}
                strokeWidth={2}
              />
            )}
          </Button>
        );
      })}
    </SimpleBar>
  );
};

export default CustomMessageReasonBox;
