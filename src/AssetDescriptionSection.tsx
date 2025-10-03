import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface AssetDescriptionSectionProps {
  result: any;
}

const AssetDescriptionSection: React.FC<AssetDescriptionSectionProps> = ({ result }) => (
  <Box
    sx={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
      minWidth: 0,
    }}
  >
    <Paper
      elevation={1}
      sx={{
        width: "90%",
        minHeight: 340,
        background: "#fff",
        p: 2,
        overflow: "auto",
        fontFamily: "monospace",
        fontSize: 15,
        wordBreak: "break-all",
      }}
    >
      {result ? (
        <pre style={{ margin: 0 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      ) : (
        <Typography color="textSecondary" align="center">
          JSON result will appear here
        </Typography>
      )}
    </Paper>
  </Box>
);

export default AssetDescriptionSection;
