export interface AnomalyItem {
  title: string;
  category: "Facial Face/Edge" | "Lighting/Shadow" | "Texture consistency" | "Frequency/Noise" | "Geometric Warping" | "Metadata warning" | "Semantic Anomaly";
  description: string;
  severity: "low" | "medium" | "high";
  coordinates?: string; // e.g. "Upper left quadrant", "Focus on eyes"
  xPercent?: number; // 0 to 100 percentage from left
  yPercent?: number; // 0 to 100 percentage from top
}

export interface ForensicResult {
  trustScore: number; // 0 to 100
  isAI: boolean;
  aiConfidence: number; // 0 to 100
  classification: "Authentic" | "Highly Suspicious" | "AI-Manipulated" | "Digitally Altered";
  
  // Scoring parameters (0-100 where higher means MORE consistent, i.e., authentic)
  facialsScore: number; 
  lightingScore: number;
  texturesScore: number;
  metadataScore: number;

  anomalies: AnomalyItem[];
  verdictSummary: string;
  reconstructionNotes: string;

  // Metadata extracted mechanically (if any)
  analysisTimestamp: string;
  imageDimensions?: string;
}

export interface LinguisticBreakdownItem {
  viewpoint_type: string;
  typical_headlines: string[];
  spin_focus: string;
  charged_keywords: string[];
  bias_level_score: number;
}

export interface NeutralGroundResult {
  topic: string;
  neutral_summary: string;
  key_facts: string[];
  linguistic_breakdown: LinguisticBreakdownItem[];
  spin_deconstruction_tip: string;
  sourceCount: number;
  isRealtimeFetched: boolean;
  timestamp: string;
  isHeuristicFallback?: boolean;
}
