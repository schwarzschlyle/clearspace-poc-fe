import React from "react";
import { Box, Button, Paper, Typography, CircularProgress } from "@mui/material";
import { useIdentify } from "../lib/hooks/useIdentify";

const DROPZONE_BORDER = "2px dotted #2c7083";

import type { IdentifyAssetResponse, IdentifyAssetError } from "../lib/hooks/useIdentify";

interface FileUploadSectionProps {
  file: File | null;
  previewUrl: string | null;
  inputRef: React.RefObject<HTMLInputElement>;
  handleDrop: (e: React.DragEvent) => void;
  handleSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setResult: (r: IdentifyAssetResponse | IdentifyAssetError) => void;
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
        overflow: "hidden",
      }}
    >
      {/* Always show logo in upper left */}
      <Box
        sx={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <img
          src={logo}
          alt="Clearspace Logo"
          style={{
            height: 48,
            border: "3px solid #d8ccc0",
            borderRadius: 12,
            background: "#fff",
            boxSizing: "border-box",
          }}
        />
      </Box>
      {!previewUrl ? (
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
            <Typography color="textSecondary" align="center">
              Drag & drop an image here<br />or click to select
            </Typography>
          </Paper>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Blurred border effect using pseudo-background */}
          <Box
            sx={{
              width: "60%",
              height: "60%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                borderRadius: 16,
                boxShadow: "0 0 32px 0 rgba(44,112,131,0.15)",
                opacity: 0.85,
                background: "#222",
                display: "block",
                position: "relative",
                zIndex: 2,
              }}
            />
            {/* Tapered gradient border overlay */}
            <Box
              sx={{
                pointerEvents: "none",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: 16,
                zIndex: 3,
                background: `radial-gradient(circle, rgba(44,112,131,0) 60%, rgba(44,112,131,0.15) 80%, rgba(44,112,131,0.35) 100%)`,
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
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 4,
                width: "70%",
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
        </Box>
      )}
    </Box>
  );
};

export default FileUploadSection;
