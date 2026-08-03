import React, { useEffect, useMemo, useRef, useState } from "react";
import FilePreviewer2 from "../file-previewer/FilePreviewer2";
import FileInputField from "../form-fields/FileInputField";
import { Grid, Stack, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { CustomTypographyForMultiImagePreviewer } from "./MultiFileUploader.style";
import { useTranslation } from "react-i18next";

const MultiFileUploader = (props) => {
  const { t } = useTranslation();
  const {
    width,
    fileImagesHandler,
    maxFileSize,
    supportedFileFormats,
    acceptedFileInput,
    acceptedFileInputFormat,
    labelText,
    titleText,
    hintText,
    totalFiles,
    gridControl,
    prescription,
    maxFiles = 6,
  } = props;
  const [files, setFiles] = useState(totalFiles ? totalFiles : []);
  const [error, setError] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");

  // const { businessInfoImageReset } = useSelector(
  //     (state) => state.multiStepForm
  // )
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  // Keep internal state in sync when parent changes totalFiles
  const getFilesKey = (list) => {
    if (!Array.isArray(list) || list.length === 0) return "";
    return list
      .map((f) => {
        if (!f) return "";
        // File objects
        if (typeof f?.name === "string") return `${f.name}:${f.size || ""}`;
        // API objects (if any)
        if (typeof f?.file_name === "string") return f.file_name;
        if (typeof f?.original_name === "string") return f.original_name;
        return String(f?.id || "");
      })
      .join("|");
  };

  const totalFilesKey = useMemo(() => getFilesKey(totalFiles), [totalFiles]);
  const filesKey = useMemo(() => getFilesKey(files), [files]);

  useEffect(() => {
    // Avoid infinite loops when parent passes a new array reference each render.
    if (totalFilesKey === filesKey) return;
    setFiles(totalFiles ? totalFiles : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalFilesKey]);

  useEffect(() => {
    fileImagesHandler(files);
    // dispatch(setBusinessInfoImageReset(false))
  }, [files]);
  // useEffect(() => {
  //     setFiles([])
  // }, [businessInfoImageReset])
  const FileSelectedHandler = (e) => {
    let file = e.target.files[e.target.files.length - 1];
    let fileExtension = file.name.split(".").pop();
    if (
      supportedFileFormats.indexOf(fileExtension) !== -1 &&
      file.type.split("/")[0] === "image"
    ) {
      if (file.size <= maxFileSize) {
        setError(false);
        if (maxFiles === 1) {
          setFiles([file]);
        } else {
          const next = [...files, ...e.target.files].slice(0, maxFiles);
          setFiles(next);
        }
      } else {
        setError(true);
        setErrorAlert(t("Chose an image max size 2mb"));
      }
    } else {
      setError(true);
      setErrorAlert(t("Unsupported file format chosen"));
    }
  };
  const DeleteImageFromFiles = (id) => {
    let remainingFiles = files.filter((item, index) => index !== id);
    setFiles(remainingFiles);
  };
  const replaceFilesByIndex = (indexNumber) => { };

  return (
    <Stack width="100%" spacing={1}>
      {files.length > 0 ? (
        <>
          <FilePreviewer2
            anchor={fileInputRef}
            errorStatus={error}
            titleText={titleText}
            acceptedFileInput={acceptedFileInput}
            file={files}
            width={width}
            onChange={FileSelectedHandler}
            onDelete={DeleteImageFromFiles}
            supportedFileFormats={supportedFileFormats}
            replaceFiles={replaceFilesByIndex}
            gridControl={gridControl}
            prescription={prescription}
      maxFiles={maxFiles}
          />
        </>
      ) : (
        <FileInputField
          titleText={titleText}
          labelText={labelText}
          hintText={hintText}
          errorStatus={error}
        acceptedFileInput={acceptedFileInput || acceptedFileInputFormat}
          width={width}
          onChange={FileSelectedHandler}
          text="Upload identity file"
          maxFileSize={maxFileSize || 200000}
          maxWidth="248px"
        multiple={maxFiles > 1}
        />
      )}
      {error && (
        <CustomTypographyForMultiImagePreviewer>
          {errorAlert}
        </CustomTypographyForMultiImagePreviewer>
      )}
    </Stack>
  );
};

export default MultiFileUploader;
