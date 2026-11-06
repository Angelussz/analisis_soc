// src/types/log.types.ts

export interface LogEntry {
  logId: string;
  timestamp: Date;
  hostname: string;
  eventId: number | string;
  user: string;
  sourceIp: string;
  destination: string;
  logSource: string;
  eventDescription: string;
  processCommandLine?: string;
  result: string;
  severity: 'Informational' | 'Warning' | 'Medium' | 'High';
}

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentCategory =
  | 'BRUTE_FORCE'
  | 'SUSPICIOUS_LOGIN'
  | 'ESCALATION'
  | 'MALICIOUS_COMMAND'
  | 'LATERAL_MOVEMENT'
  | 'EXFILTRATION'
  | 'PERSISTENCE'
  | 'WEBSHELL'
  | 'ANOMALY';

export interface Incident {
  id: string;
  category: IncidentCategory;
  risk: RiskLevel;
  title: string;
  justification: string;
  technicalDetail: string;
  impact: string;
  affectedUsers: string[];
  affectedHosts: string[];
  relatedLogs: LogEntry[];
  timestamp: Date;
  correlatedWith?: string[];
}

export interface ReportFinding {
  incident: Incident;
  confirmed: boolean;
}

export interface ReportState {
  // Sección 1 - Manual
  caseNumber: string;
  analyst: string;
  organization: string;
  classification: 'CONFIDENCIAL' | 'INTERNO' | 'PÚBLICO';
  // Secciones 2-9 - Auto + editables
  executiveSummary: string;
  findings: ReportFinding[];
  technicalExplanation: string;
  critique: string;
  organizationalImpact: string;
  actionInvestigate: string;
  actionContain: string;
  actionRemediate: string;
  recommendations: string[];
}

export interface WorkerProgressMessage {
  type: 'PROGRESS';
  progress: number;
  stage: string;
}

export interface WorkerSuccessMessage {
  type: 'SUCCESS';
  logs: LogEntry[];
  incidents: Incident[];
}

export interface WorkerErrorMessage {
  type: 'ERROR';
  error: string;
}

export type WorkerResponse = WorkerProgressMessage | WorkerSuccessMessage | WorkerErrorMessage;
