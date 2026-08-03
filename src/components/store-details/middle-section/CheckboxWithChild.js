import React, { useState } from "react";
import { Stack } from "@mui/system";
import { alpha, IconButton } from "@mui/material";
import {
  CustomBoxFullWidth,
  CustomStackFullWidth,
} from "styled-components/CustomStyles.style";
import CustomCheckbox from "../../CustomCheckbox";
import {
  ChevronDown as KeyboardArrowDownIcon,
  ChevronUp as KeyboardArrowUpIcon,
} from "lucide-react";

const CheckboxWithChild = (props) => {
  const { item, checkHandler, selectedItems } = props;
  const [open, setOpen] = useState(true);

  const clickHandler = () => {
    setOpen((prev) => !prev);
  };

  const isCheckedHandler = (id) => {
    const isExist = selectedItems?.find((item) => item === id);
    return !!isExist;
  };

  return (
    <CustomBoxFullWidth
      sx={{
        borderRadius: "2px",
        px: 0.5,
        py: 0.15,
        "&:hover": {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <CustomCheckbox
          item={item}
          checkHandler={checkHandler}
          isChecked={() => isCheckedHandler(item?.id)}
        />
        {item?.childes?.length > 0 && (
          <IconButton
            size="small"
            onClick={clickHandler}
            aria-label={open ? "Collapse category" : "Expand category"}
            sx={{
              p: 0.4,
              borderRadius: "2px",
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            {open ? (
              <KeyboardArrowUpIcon size={16} />
            ) : (
              <KeyboardArrowDownIcon size={16} />
            )}
          </IconButton>
        )}
      </Stack>

      {open && item?.childes?.length > 0 && (
        <CustomStackFullWidth
          sx={{
            pl: 2,
            ml: 0.75,
            borderLeft: (theme) =>
              `1px solid ${alpha(theme.palette.divider, 0.55)}`,
          }}
        >
          {item.childes.map((childItem, childIndex) => (
            <CustomBoxFullWidth
              key={childItem?.id || childIndex}
              sx={{
                borderRadius: "2px",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <CustomCheckbox
                item={childItem}
                checkHandler={checkHandler}
                isChecked={() => isCheckedHandler(childItem?.id)}
              />
            </CustomBoxFullWidth>
          ))}
        </CustomStackFullWidth>
      )}
    </CustomBoxFullWidth>
  );
};

CheckboxWithChild.propTypes = {};

export default CheckboxWithChild;
