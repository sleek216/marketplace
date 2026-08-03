import React, { useEffect, useState } from "react";
import {
  CustomBoxForFilePreviewer,
  CustomBoxImageText,
  FilePreviewerWrapper,
  IconButtonImagePreviewer,
} from "./FilePreviewer.style";
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
// import { CustomBoxImageText } from "../form-fields/FileInputField";
import { Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import FileInputField from "../form-fields/FileInputField";
import pdfIcon from "./assets/pdf.png";
import docIcon from "./assets/docx.png";
import txtIcon from "./assets/txt-file.png";
import folderIcon from "./assets/folder.png";
import CustomImageContainer from "../CustomImageContainer";
import DescriptionIcon from '@mui/icons-material/Description';
import { alpha, Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import CloseIcon from '@mui/icons-material/Close';

const FilePreviewer = (props) => {
  const {
    file,
    anchor,
    deleteImage,
    hintText,
    width,
    onChange,
    onDelete,
    errorStatus,
    acceptedFileInput,
    label,
    titleText,
    prescription,
    maxFiles = 5,
  } = props;
  const { t } = useTranslation();

  const theme = useTheme();
  const [multipleImages, setMultipleImages] = useState([]);
  const matches = useMediaQuery("(min-width:400px)");
  useEffect(() => {
    // Cleanup previous object URLs to prevent memory leaks
    return () => {
      multipleImages.forEach((image) => {
        if (image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Cleanup existing URLs before creating new ones
    multipleImages.forEach((image) => {
      if (image.url) {
        URL.revokeObjectURL(image.url);
      }
    });

    if (file?.length > 0) {
      const newImages = [];
      file.forEach((image) => {
        // Validate that image is a valid File object
        if (image && image instanceof File && image.name && image.size > 0) {
          try {
            newImages.push({
              url: URL.createObjectURL(image),
              type: image.name.split(".").pop().toLowerCase(),
              name: image.name,
            });
          } catch (error) {
            console.error("Error creating object URL for file:", image.name, error);
            // Skip this file if createObjectURL fails
          }
        }
      });
      setMultipleImages(newImages);
    } else {
      // Clear images when no files
      setMultipleImages([]);
    }
  }, [file]);

  const truncateFilename = (filename, maxLength = 25) => {
    if (filename.length <= maxLength) return filename;

    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return filename.substring(0, maxLength - 3) + '...';
    }

    const extension = filename.substring(lastDotIndex);
    const nameWithoutExt = filename.substring(0, lastDotIndex);
    const availableLength = maxLength - extension.length - 3;

    if (availableLength <= 0) {
      return '...' + extension;
    }

    return nameWithoutExt.substring(0, availableLength) + '...' + extension;
  };

  const renderFilePreview = () => {
    if (file?.length > 0) {
      return (
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {multipleImages.map((image, index) => {
            return (
                <CustomBoxForFilePreviewer key={index} width={width} maxWidth="248px">
                  {previewBasedOnType(image, index)}
                  <IconButtonImagePreviewer onClick={() => onDelete(index)}>
                    <CloseIcon
                      sx={{
                        width: "15px",
                        height: "15px",
                        color: theme.palette.neutral[100],
                      }}
                    />
                  </IconButtonImagePreviewer>
                </CustomBoxForFilePreviewer>
            );
          })}
          {multipleImages?.length < maxFiles && (
            <FileInputField
                titleText={titleText}
                label={label}
                hintText={hintText}
                errorStatus={errorStatus}
                width={width}
                maxWidth="248px"
                onChange={onChange}
                acceptedFileInput={acceptedFileInput}
                multiple={maxFiles > 1}
              />
          )}
        </Stack>
      );
    } else {
      const previewImage = {
        url: URL.createObjectURL(file),
        type: file.name.split(".").pop(),
      };
      return (
        <CustomBoxForFilePreviewer>
          {previewBasedOnType(previewImage)}
          <IconButtonImagePreviewer onClick={() => deleteImage()}>
            <DeleteIcon
              sx={{
                width: "15px",
                height: "15px",
                color: theme.palette.error.light,
              }}
            />
          </IconButtonImagePreviewer>
        </CustomBoxForFilePreviewer>
      );
    }
  };
  const previewBasedOnType = (file, fileIndex) => {
    if (
      file.type === "jpg" ||
      file.type === "jpeg" ||
      file.type === "gif" ||
      file.type === "png"
    ) {
      return (
        <FilePreviewerWrapper>
          <CustomImageContainer src={file.url} alt="preview" height="7.75rem" />
        </FilePreviewerWrapper>
      );
    } else {
      // PDF and other document types preview
      return (
        <Box sx={{ position: "relative", width: "100%" }}>
          {/* Top Section - Preview with Dark Overlay */}
          <Box
            onClick={() => window.open(file.url, "_blank")}
            sx={{
              position: "relative",
              height: "74px",
              backgroundColor: alpha(theme.palette.neutral[400], 0.1),
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {file.type === "pdf" ? (
              <object
                data={`${file.url}#toolbar=0&navpanes=0&scrollbar=0`}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{
                  pointerEvents: "none",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DescriptionIcon
                    sx={{
                      fontSize: "3rem",
                      color: alpha(theme.palette.neutral[400], 0.3),
                    }}
                  />
                </Box>
              </object>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomImageContainer
                  src={
                    file.type === "docx" || file.type === "doc"
                      ? docIcon
                      : file.type === "txt"
                      ? txtIcon
                      : folderIcon
                  }
                  alt="doc"
                  height="50px"
                  width="50px"
                  objectFit="contain"
                />
              </Box>
            )}

            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />
          </Box>

          {/* Bottom Section - Filename and Text */}
          <Box
            onClick={() => window.open(file.url, "_blank")}
            sx={{
              padding: "0.5rem",
              backgroundColor: theme.palette.background.paper,
              borderRadius: "0 0 8px 8px",
              cursor: "pointer",
              border: `1px solid ${theme.palette.neutral[200]}`,
              borderTop: "none",
              "&:hover": {
                backgroundColor: alpha(theme.palette.neutral[100], 0.5),
              },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <DescriptionIcon
                sx={{
                  fontSize: "2rem",
                  color: alpha(theme.palette.neutral[600], 0.3),
                }}
              />
              <Stack spacing={0} sx={{ flex: 1, overflow: "hidden" }}>
                <Typography
                  fontSize="12px"
                  fontWeight="500"
                  sx={{
                    color: theme.palette.neutral[1000],
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {truncateFilename(file.name || "Document")}
                </Typography>
                <Typography
                  fontSize="10px"
                  sx={{
                    color: alpha(theme.palette.neutral[600], 0.8),
                  }}
                >
                  {t("Click to view")}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      );
    }
  };
  return (
    <Stack width="100%" spacing={3}>
      {renderFilePreview()}
      {hintText && (
        <CustomBoxImageText>
          <Typography>{hintText}</Typography>
        </CustomBoxImageText>
      )}
    </Stack>
  );
};
FilePreviewer.propTypes = {};
export default FilePreviewer;
