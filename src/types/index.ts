export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'normal';

export interface StressHistoryPoint {
  date: string;
  score: number;
}

export interface Personnel {
  id: string;
  name: string;
  unit: string;
  role: string;
  deployments: number;
  leaveUtil: number; // Percentage 0-100
  riskScore: number; // 0-100
  status: RiskLevel;
  stressHistory: StressHistoryPoint[];
  lastAssessment: string;
  phone?: string;
  email?: string;
  location?: string;
  psychEvaluationDue?: boolean;
}

export interface AlertItem {
  id: string;
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  timestamp: string;
  personnelId?: string;
  unit?: string;
  actionRequired: string;
  status: 'unresolved' | 'acknowledged' | 'resolved';
}

export interface SystemStats {
  totalPersonnel: number;
  atRisk: number;
  criticalCases: number;
  interventions: number;
  trends: {
    total: number;
    risk: number;
    critical: number;
    interventions: number;
  };
}

export interface MonthlyTrendData {
  month: string;
  riskCount: number;
  criticalCount: number;
  interventions: number;
}

export interface RiskDistributionData {
  name: string;
  value: number;
  color: string;
}

export interface UnitStressData {
  unit: string;
  avgStress: number;
  personnelCount: number;
  criticalCount: number;
}

export interface InterventionEffectivenessData {
  month: string;
  counseling: number;
  leaveRotation: number;
  dutyReassignment: number;
}

export interface Recommendation {
  id: string;
  title: string;
  unit: string;
  targetPersonnel: number;
  type: 'leave' | 'rotation' | 'counseling' | 'workload';
  urgency: 'high' | 'medium' | 'low';
  impact: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface DetectedFace {
  bbox: [number, number, number, number];
  top_emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
  engine?: 'gemini' | 'local';
  micro_expression?: string;
  stress_score?: number;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
  timestamp: number;
  isStressed: boolean;
}

export type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

