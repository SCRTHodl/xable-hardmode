export interface ScenarioManifest {
  name: string;
  description: string;
  version: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AdmissibilityRule {
  id: string;
  description: string;
  severity: 'error' | 'warning';
  check: string; // Reference to what should be checked
}

export interface RatchetStep {
  iteration: number;
  description: string;
  requiredChange: string;
  evidenceRequired: string;
}

export interface ExpectedRatchetPath {
  totalIterations: number;
  steps: RatchetStep[];
  haltCondition: string;
}

export interface CapabilitySignal {
  capability: string;
  demonstrated: boolean;
  evidence: string;
}

export interface Scenario {
  manifest: ScenarioManifest;
  admissibilityRules: AdmissibilityRule[];
  expectedRatchetPath: ExpectedRatchetPath;
  capabilitySignals: CapabilitySignal[];
}

export interface TestResult {
  passed: boolean;
  message: string;
  admissible: boolean;
  violations: string[];
}

export interface VerificationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
