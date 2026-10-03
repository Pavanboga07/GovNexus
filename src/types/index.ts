export type Severity = 'critical' | 'high' | 'medium' | 'info' | 'healthy';

export interface Scheme {
  id: string;
  name: string;
  fullName: string;
  ministry: string;
  category: string;
  beneficiaries: string;
  beneficiariesNum: number; // in millions
  coverage: number;
  utilization: number;
  completion: number;
  allocated: number; // ₹ Cr
  utilized: number; // ₹ Cr
  states: string[];
  trend: { month: string; coverage: number; utilization: number; completion: number }[];
  description: string;
  color: string;
}

export interface District {
  id: string;
  name: string;
  state: string;
  x: number; // 0-100 map coords
  y: number;
  coverage: number;
  utilization: number;
  completion: number;
  efficiency: number;
  anomalyScore: number;
  benchmark: number;
  status: Severity;
  beneficiaries: string;
  fundsAllocated: number;
  fundsUtilized: number;
  schemesActive: number;
  flagReason: string;
  lastUpdated: string;
}

export interface Insight {
  id: string;
  severity: Severity;
  title: string;
  region: string;
  scheme: string;
  schemeId?: string;
  districtId?: string;
  summary: string;
  metric: string;
  metricValue: string;
  secondaryMetric?: string;
  time: string;
  detail: string;
  evidenceId?: string;
}

export interface Relationship {
  id: string;
  type: 'ministry' | 'scheme' | 'district' | 'beneficiary' | 'project';
  label: string;
  sub?: string;
  x: number;
  y: number;
  links: string[];
  color: string;
}

export interface Evidence {
  id: string;
  insight: string;
  districtId: string;
  districtName: string;
  schemeId: string;
  schemeName: string;
  factors: { label: string; value: string; delta?: string; tone: 'bad' | 'good' | 'neutral' }[];
  dataset: string;
  records: number;
  period: string;
  analysis: string;
  confidence: number;
  calculation: string[];
  sourceRows: { district: string; coverage: number; utilization: number; completion: number; benchmark: number; flag: string }[];
}
