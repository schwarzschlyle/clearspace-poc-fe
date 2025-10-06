import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LabelIcon from "@mui/icons-material/Label";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CategoryIcon from "@mui/icons-material/Category";
import StraightenIcon from "@mui/icons-material/Straighten";
import StyleIcon from "@mui/icons-material/Style";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import type { IdentifyAssetResponse } from "../lib/hooks/useIdentify";

interface AssetDescriptionSectionProps {
  result: IdentifyAssetResponse | null;
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 0.9) return "success";
  if (confidence >= 0.7) return "warning";
  return "default";
}

function getConfidenceIcon(confidence: number) {
  if (confidence >= 0.9) return <CheckCircleIcon color="success" />;
  if (confidence >= 0.7) return <ErrorOutlineIcon color="warning" />;
  return <HelpOutlineIcon color="disabled" />;
}

const iconMap: Record<string, React.ReactNode> = {
  sku: <LabelIcon fontSize="small" />,
  product_code: <LabelIcon fontSize="small" />,
  color: <ColorLensIcon fontSize="small" />,
  material: <StyleIcon fontSize="small" />,
  category: <CategoryIcon fontSize="small" />,
  height: <StraightenIcon fontSize="small" />,
  style: <StyleIcon fontSize="small" />,
  intended_use: <InfoIcon fontSize="small" />,
};

const labelMap: Record<string, string> = {
  sku: "SKU",
  product_code: "SKU",
  color: "Color",
  material: "Material",
  category: "Category",
  height: "Height",
  style: "Style",
  intended_use: "Intended Use",
};

const excludeKeys = new Set([
  "manufacturer",
  "brand",
  "model",
  "confidence_score",
  "confidence",
  "design_features",
  "claude_analysis",
  "analysis",
  "description",
  "imageUrl",
  "image",
  "additional_details",
]);

const AssetDescriptionSection: React.FC<AssetDescriptionSectionProps> = ({ result }) => {
  const [expanded, setExpanded] = useState(false);

  if (!result) {
    return (
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
        <Card sx={{ width: "90%", minHeight: 340, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CardContent>
            <Typography color="textSecondary" align="center">
              JSON result will appear here
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Merge top-level and additional_details
  // Merge top-level and additional_details (type safe)
  let details: Record<string, unknown> = { ...result };
  if (result && typeof result.additional_details === "object" && result.additional_details !== null) {
    details = { ...result, ...result.additional_details };
  }

  // Compose header
  const headerTitle = [
    typeof details.manufacturer === "string" ? details.manufacturer : typeof details.brand === "string" ? details.brand : "",
    typeof details.model === "string" ? details.model : "",
  ].filter(Boolean).join(" ");
  const confidenceValue =
    typeof details.confidence_score === "number"
      ? details.confidence_score
      : typeof details.confidence === "number"
      ? details.confidence
      : typeof details.confidence_score === "string"
      ? parseFloat(details.confidence_score)
      : typeof details.confidence === "string"
      ? parseFloat(details.confidence)
      : undefined;
  const confidencePercent = typeof confidenceValue === "number" && !isNaN(confidenceValue)
    ? Math.round(confidenceValue * 100)
    : undefined;

  // Compose analysis text
  const analysisText =
    (typeof details.claude_analysis === "string" && details.claude_analysis) ||
    (typeof details.design_features === "string" && details.design_features) ||
    (typeof details.analysis === "string" && details.analysis) ||
    (typeof details.description === "string" && details.description) ||
    "";

  // Collect all quick facts (excluding header/analysis fields)
  const factEntries = Object.entries(details)
    .filter(
      ([key, value]) =>
        !excludeKeys.has(key) &&
        typeof value === "string" &&
        value.trim() !== ""
    )
    .map(([key, value]) => ({
      key,
      label: labelMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      icon: iconMap[key] || <InfoIcon fontSize="small" />,
      value,
    }));

  // Split into rows of 2 for display
  const factRows = [];
  for (let i = 0; i < factEntries.length; i += 2) {
    factRows.push(factEntries.slice(i, i + 2));
  }

  return (
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
      <Card
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 480,
          minHeight: 340,
          borderRadius: 3,
          boxShadow: 3,
          background: "#fff",
          overflow: "visible",
        }}
      >
        <CardHeader
          avatar={
            typeof details.image === "string" && details.image ? (
              <Avatar src={details.image} alt={headerTitle} sx={{ width: 48, height: 48 }} />
            ) : typeof details.imageUrl === "string" && details.imageUrl ? (
              <Avatar src={details.imageUrl} alt={headerTitle} sx={{ width: 48, height: 48 }} />
            ) : (
              <Avatar sx={{ width: 48, height: 48 }}>
                {typeof details.manufacturer === "string" && details.manufacturer
                  ? details.manufacturer[0]
                  : typeof details.brand === "string" && details.brand
                  ? details.brand[0]
                  : "?"}
              </Avatar>
            )
          }
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {headerTitle || "Unknown Product"}
              </Typography>
              {confidencePercent !== undefined && (
                <Tooltip title={`Confidence: ${confidencePercent}%`}>
                  <Chip
                    icon={getConfidenceIcon(confidenceValue ?? 0)}
                    label={`${confidencePercent}%`}
                    color={getConfidenceColor(confidenceValue ?? 0)}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      ml: 1,
                      borderRadius: 1,
                      px: 1,
                      backgroundColor: (theme) =>
                        confidenceValue !== undefined
                          ? confidenceValue >= 0.9
                            ? theme.palette.success.light
                            : confidenceValue >= 0.7
                            ? theme.palette.warning.light
                            : theme.palette.grey[300]
                          : theme.palette.grey[200],
                      color: (theme) =>
                        confidenceValue !== undefined
                          ? confidenceValue >= 0.9
                            ? theme.palette.success.contrastText
                            : confidenceValue >= 0.7
                            ? theme.palette.warning.contrastText
                            : theme.palette.text.primary
                          : theme.palette.text.secondary,
                    }}
                  />
                </Tooltip>
              )}
            </Box>
          }
        />
        <Divider />
        <CardContent sx={{ pt: 1, pb: 1 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {factRows.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">
                No additional details available.
              </Typography>
            )}
            {factRows.map((row, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 2 }}>
                {row.map(({ key, label, icon, value }) => (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 0,
                      gap: 1,
                    }}
                  >
                    {icon}
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {label}:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden" }}>
                      {value as string}
                    </Typography>
                  </Box>
                ))}
                {row.length === 1 && <Box sx={{ flex: 1 }} />}
              </Box>
            ))}
          </Box>
        </CardContent>
        {analysisText && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Design Highlights
                </Typography>
                <IconButton
                  onClick={() => setExpanded((prev) => !prev)}
                  aria-label={expanded ? "Collapse analysis" : "Expand analysis"}
                  size="small"
                  sx={{
                    transition: "transform 0.2s",
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {analysisText}
                </Typography>
              </Collapse>
            </Box>
          </>
        )}
      </Card>
    </Box>
  );
};

export default AssetDescriptionSection;
