import React, { useEffect, useState } from "react";
import { CustomStackFullWidth } from "../../styled-components/CustomStyles.style";
import {
  alpha,
  Skeleton,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { Scrollbar } from "../srollbar";
//import CheckboxWithChild from "../store-details/middle-section/CheckboxWithChild";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
//import CustomCheckbox from "../CustomCheckbox";
import { VIEW_ALL_TEXT } from "../../utils/staticTexts";
import { setStoreSelectedItems } from "redux/slices/categoryIds";
import { useDispatch, useSelector } from "react-redux";
import CustomCheckbox from "../CustomCheckbox";
import CheckboxWithChild from "../store-details/middle-section/CheckboxWithChild";
export const CustomPaperBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.04)",
  borderRadius: "14px",
  border: `2px solid ${alpha(theme.palette.divider, 0.65)}`,
  overflow: "hidden",
  color: theme.palette.neutral[900],
  transition: "box-shadow 0.2s ease",
  "&:hover": {
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.07)",
  },
}));

const MultipleCheckboxWithTitle = (props) => {
  const {
    title,
    data,
    isFetching,
    showAll,
    searchValue,
    id,
    selectedCategoriesHandler,
  } = props;

  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const dispatch = useDispatch();
  const storeSelectedItems = useSelector(
    (state) => state.categoryIds.storeSelectedItems
  );

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    setSelectedId(id);
  }, [id]);
  useEffect(() => {
    selectedCategoriesHandler?.(isSmall ? storeSelectedItems : selectedItems,isAllSelected);
  }, [selectedItems, storeSelectedItems]);
  useEffect(() => {
    if (searchValue === VIEW_ALL_TEXT.allCategories && data?.length > 0) {
      let checkData = { checked: true, id: "all" };
      allCheckHandler(checkData);
    } else if (searchValue === "category") {
      const selectedCategory = {
        checked: true,
        id: parseInt(id),
      };
      checkHandler(selectedCategory);
    }
  }, [data, searchValue, id]);
  useEffect(() => {
    const totalLength = data.length + data.reduce((acc, item) => acc + (item.childes?.length || 0), 0);
    const checkDuplicate = Array.isArray(selectedItems) ? [...new Set(selectedItems)] : [];

    if (totalLength === checkDuplicate.length && !isAllSelected) {
      setIsAllSelected(true); // Only run if not already selected
      allCheckHandler({ checked: true, id: "all" });
    }

    if (totalLength !== checkDuplicate.length && isAllSelected) {
      // Optional: reset flag if something is unchecked
      setIsAllSelected(false);
    }
  }, [data, selectedItems]);

  const checkHandler = (checkedData) => {

    setIsAllSelected(false )
    if (isSmall) {
      const parent = data?.find((item) => item?.id === checkedData?.id);
      let ids = [];
      if (parent) {
        ids =
          parent?.childes.length > 0
            ? [parent.id, ...parent.childes.map((child) => child.id)]
            : [parent.id];
      } else {
        ids.push(checkedData.id);
      }
      let newSelectedItems;
      if (checkedData.checked) {
        newSelectedItems = [
          ...storeSelectedItems,
          ...ids.filter((id) => !storeSelectedItems.includes(id)),
        ];
      } else {
        newSelectedItems = storeSelectedItems.filter(
          (item) => !ids.includes(item)
        );
      }
      dispatch(setStoreSelectedItems(newSelectedItems));
    } else {
      const parent = data?.find((item) => item?.id === checkedData?.id);
      let ids = [];
      if (parent) {
        if (parent?.childes.length > 0) {
          ids = [parent?.id, ...parent?.childes?.map((childId) => childId?.id)];
        } else {
          ids.push(parent?.id);
        }
      } else {
        ids.push(checkedData?.id);
      }
      if (checkedData?.checked) {
        setSelectedId(parent?.id);
        setSelectedItems((prevState) => [...prevState, ...ids]);
      } else {
        setSelectedItems((prevState) =>
          prevState.filter((item) => ids?.every((id) => id !== item))
        );
      }
    }
  };
  const allCheckHandler = (itemData) => {
    if (isSmall) {
      let allIds = data.reduce((acc, item) => {
        acc.push(item.id);
        if (item.childes && item.childes.length > 0) {
          item.childes.forEach((child) => acc.push(child.id));
        }
        return acc;
      }, []);
      if (itemData.checked) {
        setIsAllSelected(true);
        dispatch(setStoreSelectedItems(allIds));
      } else {
        setIsAllSelected(false);
        dispatch(setStoreSelectedItems([]));
      }
    } else {
      if (itemData?.checked) {
        setIsAllSelected(true);
        let allIds = [];
        if (data?.length > 0) {
          data.forEach((item) => {
            allIds.push(item.id);
            if (item?.childes?.length > 0) {
              item?.childes?.forEach((childItem) => allIds.push(childItem.id));
            }
          });
        }
        setSelectedItems((prevState) => [...prevState, ...allIds]);
      } else {
        setIsAllSelected(false);
        setSelectedItems((prevState) => []);
      }
    }
  };

  return (
    <CustomStackFullWidth>
      <CustomPaperBox>
        <Box
          sx={{
            p: "14px 18px",
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.paper, 0.4)
                : alpha(theme.palette.neutral[100] || "#F8FAFC", 0.7),
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "15px",
              color: theme.palette.text.primary,
              letterSpacing: "-0.2px",
            }}
          >
            {t(title)}
          </Typography>
        </Box>
        <CustomStackFullWidth p="12px 14px">
          <Scrollbar style={{ maxHeight: "380px" }} scrollbarMinSize={1}>
            {showAll && (
              <Box
                sx={{
                  borderRadius: "2px",
                  px: 0.5,
                  py: 0.15,
                  "&:hover": {
                    bgcolor: (th) => alpha(th.palette.primary.main, 0.04),
                  },
                }}
              >
                <CustomCheckbox
                  item={{ name: "All", id: "all" }}
                  checkHandler={allCheckHandler}
                  isChecked={isAllSelected}
                  selectedId={selectedId}
                  setSelectedId={setSelectedId}
                />
              </Box>
            )}
            {data?.map((item, index) => {
              return (
                <React.Fragment key={item?.id || index}>
                  {isSmall ? (
                    <CheckboxWithChild
                      key={index}
                      item={item}
                      checkHandler={checkHandler}
                      selectedItems={storeSelectedItems}
                    />
                  ) : (
                    <CheckboxWithChild
                      key={index}
                      item={item}
                      checkHandler={checkHandler}
                      selectedItems={selectedItems}
                    />
                  )}
                </React.Fragment>
              );
            })}
            {isFetching &&
              [...Array(4)].map((item, index) => {
                return (
                  <ListItemButton key={index}>
                    <ListItemText>
                      <Skeleton
                        variant="rectangle"
                        height="10px"
                        width="100%"
                      />
                    </ListItemText>
                  </ListItemButton>
                );
              })}
          </Scrollbar>
        </CustomStackFullWidth>
      </CustomPaperBox>
    </CustomStackFullWidth>
  );
};

MultipleCheckboxWithTitle.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  // Include other PropTypes as necessary
};

export default MultipleCheckboxWithTitle;
