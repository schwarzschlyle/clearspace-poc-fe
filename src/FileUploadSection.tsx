import React from "react";
import { Box, Button, Paper, Typography, CircularProgress } from "@mui/material";
import { useIdentify } from "../lib/hooks/useIdentify";

const DROPZONE_BORDER = "2px dotted #2c7083";

interface FileUploadSectionProps {
  file: File | null;
  previewUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  handleDrop: (e: React.DragEvent) => void;
  handleSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setResult: (r: any) => void;
}

import logo from "./assets/clearspace-logo.png";

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  previewUrl,
  inputRef,
  handleDrop,
  handleSelect,
  setResult,
}) => {
  const identifyMutation = useIdentify();

  const handleIdentify = async () => {
    if (!file) return;
    identifyMutation.mutate(file, {
      onSuccess: (data) => {
        console.log("useIdentify success:", data);
        setResult(data);
      },
      onError: (err) => {
        console.log("useIdentify error:", err);
        setResult(err);
      },
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        position: "relative",
        minWidth: 0,
        height: "100%",
        background: "#2c7083",
        p: 0,
      }}
    >
      <Box sx={{ width: "100%", display: "flex", alignItems: "flex-start", justifyContent: "flex-start", mt: 3, mb: 2, ml: 3 }}>
        <img src={logo} alt="Clearspace Logo" style={{ height: 48 }} />
      </Box>
      <Box sx={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper
          elevation={3}
          sx={{
            border: DROPZONE_BORDER,
            borderRadius: 2,
            width: 340,
            height: 340,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8f6f3",
            cursor: "pointer",
            position: "relative",
            transition: "border-color 0.2s",
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleSelect}
          />
          {!previewUrl ? (
            <Typography color="textSecondary" align="center">
              Drag & drop an image here<br />or click to select
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 220,
                  marginBottom: 16,
                  borderRadius: 8,
                }}
              />
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();
                  handleIdentify();
                }}
                disabled={identifyMutation.status === "pending"}
                sx={{
                  width: "80%",
                  backgroundColor: "#2c7083",
                  "&:hover": {
                    backgroundColor: "#25606f",
                  },
                }}
              >
                {identifyMutation.status === "pending" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "IDENTIFY"
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default FileUploadSection;
