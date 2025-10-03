import React, { useRef, useState } from "react";
import { Box, Divider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FileUploadSection from "./FileUploadSection";
import AssetDescriptionSection from "./AssetDescriptionSection";

const BG_COLOR = "#d8ccc0";
const DIVIDER_COLOR = "#2c7083";

const queryClient = new QueryClient();

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handlers that do not depend on TanStack Query
  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Box
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: BG_COLOR,
          overflowX: "hidden",
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: "100vh",
            width: "100vw",
            minWidth: 0,
            overflowX: "hidden",
            display: "flex",
            flexDirection: "row",
            p: 0,
            m: 0,
          }}
        >
          <Box
            sx={{
              width: "50vw",
              minWidth: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileUploadSection
              file={file}
              previewUrl={previewUrl}
              inputRef={inputRef as React.RefObject<HTMLInputElement>}
              handleDrop={handleDrop}
              handleSelect={handleSelect}
              setResult={setResult}
            />
          </Box>
          {/* Vertical Divider, absolutely centered */}
          <Divider
            orientation="vertical"
            sx={{
              position: "absolute",
              left: "50vw",
              top: 0,
              height: "100%",
              borderColor: DIVIDER_COLOR,
              borderRightWidth: 4,
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              width: "50vw",
              minWidth: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AssetDescriptionSection result={result} />
          </Box>
        </Box>
      </Box>
    </QueryClientProvider>
  );
}

/* (DropZone component removed, now in FileUploadSection.tsx) */

export default App;
