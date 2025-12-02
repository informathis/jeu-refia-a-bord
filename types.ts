export enum Phase {
  WELCOME = 'WELCOME',
  GAME = 'GAME',
  SUMMARY = 'SUMMARY',
}

export enum CasePhase {
  DISCOVERY = 'DISCOVERY', // Météo & Situation
  DIAGNOSTIC = 'DIAGNOSTIC', // Questions & Décision
  LOGBOOK = 'LOGBOOK', // Journal de bord & Feedback
}

export enum DecisionType {
  A = 'A', // Pas d'IA
  B = 'B', // Outil standard
  C = 'C', // Projet IA structuré
  D = 'D', // Refus / Report
}

export enum RiskLevel {
  LOW = 'Faible',
  MODERATE = 'Modéré',
  HIGH = 'Élevé',
}

export interface Question {
  id: string;
  category: 'Données' | 'Risques' | 'Métier' | 'Alternatives';
  text: string;
  answer: string;
  relevance: number; // 0 to 10 score impact
}

export interface Stakeholder {
  id: string;
  label: string;
  required: boolean; // If true, must be selected for full points
}

export interface Scenario {
  id: string;
  title: string;
  context: string; // Weather/Location
  team: string;
  demand: string;
  questions: Question[];
  stakeholders: Stakeholder[];
  correctDecision: DecisionType;
  correctRisk: RiskLevel;
  feedbackSuccess: string;
  feedbackPartial: string;
  feedbackFail: string;
  benefits: string[]; // Options for logbook
  vigilancePoints: string[]; // Options for logbook
}

export interface PlayerState {
  currentScenarioIndex: number;
  totalScore: number;
  history: {
    scenarioId: string;
    score: number;
    decision: DecisionType;
    risk: RiskLevel;
    questionsAsked: string[]; // IDs
    logbookBenefits: string[];
    logbookVigilance: string[];
  }[];
}
