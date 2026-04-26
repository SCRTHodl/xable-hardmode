import * as fs from 'fs';
import * as path from 'path';
import { Scenario, VerificationResult } from './types.js';

const REQUIRED_FILES = [
  'README.md',
  'broken.ts',
  'test.ts',
  'admissibility-rules.json',
  'expected-ratchet-path.json',
  'capability-signals.json'
];

function validateScenarioManifest(manifest: any): string[] {
  const errors: string[] = [];
  
  if (!manifest.name || typeof manifest.name !== 'string') {
    errors.push('Manifest missing valid "name" field');
  }
  if (!manifest.description || typeof manifest.description !== 'string') {
    errors.push('Manifest missing valid "description" field');
  }
  if (!manifest.version || typeof manifest.version !== 'string') {
    errors.push('Manifest missing valid "version" field');
  }
  if (!manifest.difficulty || !['easy', 'medium', 'hard'].includes(manifest.difficulty)) {
    errors.push('Manifest missing valid "difficulty" field (must be easy, medium, or hard)');
  }
  
  return errors;
}

function validateExpectedRatchetPath(ratchetPath: any, scenarioName: string): string[] {
  const errors: string[] = [];
  
  if (!ratchetPath.totalIterations || typeof ratchetPath.totalIterations !== 'number') {
    errors.push('Ratchet path missing valid "totalIterations" field');
  }
  
  // Boss scenarios can have up to 6 iterations
  const isBossScenario = scenarioName.includes('boss') || scenarioName.includes('takeover');
  const maxIterations = isBossScenario ? 6 : 4;
  
  if (ratchetPath.totalIterations < 2 || ratchetPath.totalIterations > maxIterations) {
    errors.push(`Ratchet path iterations must be between 2 and ${maxIterations} (hardmode rule)`);
  }
  if (!Array.isArray(ratchetPath.steps)) {
    errors.push('Ratchet path missing valid "steps" array');
  }
  if (!ratchetPath.haltCondition || typeof ratchetPath.haltCondition !== 'string') {
    errors.push('Ratchet path missing valid "haltCondition" field');
  }
  
  return errors;
}

function validateAdmissibilityRules(rules: any): string[] {
  const errors: string[] = [];
  
  if (!Array.isArray(rules)) {
    errors.push('Admissibility rules must be an array');
    return errors;
  }
  
  if (rules.length === 0) {
    errors.push('Admissibility rules cannot be empty');
  }
  
  rules.forEach((rule, index) => {
    if (!rule.id || typeof rule.id !== 'string') {
      errors.push(`Rule ${index} missing valid "id" field`);
    }
    if (!rule.description || typeof rule.description !== 'string') {
      errors.push(`Rule ${index} missing valid "description" field`);
    }
    if (!rule.severity || !['error', 'warning'].includes(rule.severity)) {
      errors.push(`Rule ${index} missing valid "severity" field`);
    }
  });
  
  return errors;
}

function validateCapabilitySignals(signals: any): string[] {
  const errors: string[] = [];
  
  if (!Array.isArray(signals)) {
    errors.push('Capability signals must be an array');
    return errors;
  }
  
  if (signals.length === 0) {
    errors.push('Capability signals cannot be empty');
  }
  
  signals.forEach((signal, index) => {
    if (!signal.capability || typeof signal.capability !== 'string') {
      errors.push(`Signal ${index} missing valid "capability" field`);
    }
    if (typeof signal.demonstrated !== 'boolean') {
      errors.push(`Signal ${index} missing valid "demonstrated" field`);
    }
    if (!signal.evidence || typeof signal.evidence !== 'string') {
      errors.push(`Signal ${index} missing valid "evidence" field`);
    }
  });
  
  return errors;
}

function verifyScenario(scenarioPath: string): VerificationResult {
  const result: VerificationResult = {
    valid: true,
    errors: [],
    warnings: []
  };
  
  // Extract scenario name from path
  const scenarioName = path.basename(scenarioPath);
  
  // Check required files exist
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(scenarioPath, file);
    if (!fs.existsSync(filePath)) {
      result.valid = false;
      result.errors.push(`Missing required file: ${file}`);
    }
  }
  
  if (!result.valid) {
    return result; // Fail closed on missing files
  }
  
  // Load and validate admissibility-rules.json
  try {
    const rulesPath = path.join(scenarioPath, 'admissibility-rules.json');
    const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
    const rules = JSON.parse(rulesContent);
    const ruleErrors = validateAdmissibilityRules(rules);
    result.errors.push(...ruleErrors);
  } catch (e) {
    result.valid = false;
    result.errors.push(`Failed to parse admissibility-rules.json: ${e}`);
  }
  
  // Load and validate expected-ratchet-path.json
  try {
    const ratchetPath = path.join(scenarioPath, 'expected-ratchet-path.json');
    const ratchetContent = fs.readFileSync(ratchetPath, 'utf-8');
    const ratchet = JSON.parse(ratchetContent);
    const ratchetErrors = validateExpectedRatchetPath(ratchet, scenarioName);
    result.errors.push(...ratchetErrors);
  } catch (e) {
    result.valid = false;
    result.errors.push(`Failed to parse expected-ratchet-path.json: ${e}`);
  }
  
  // Load and validate capability-signals.json
  try {
    const signalsPath = path.join(scenarioPath, 'capability-signals.json');
    const signalsContent = fs.readFileSync(signalsPath, 'utf-8');
    const signals = JSON.parse(signalsContent);
    const signalErrors = validateCapabilitySignals(signals);
    result.errors.push(...signalErrors);
  } catch (e) {
    result.valid = false;
    result.errors.push(`Failed to parse capability-signals.json: ${e}`);
  }
  
  // Check README exists and has content
  try {
    const readmePath = path.join(scenarioPath, 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    if (readmeContent.length < 50) {
      result.warnings.push('README.md is too short');
    }
  } catch (e) {
    result.valid = false;
    result.errors.push(`Failed to read README.md: ${e}`);
  }
  
  result.valid = result.errors.length === 0;
  return result;
}

function main() {
  const scenariosDir = path.join(process.cwd(), 'scenarios');
  
  if (!fs.existsSync(scenariosDir)) {
    console.error('❌ scenarios directory not found');
    process.exit(1);
  }
  
  const scenarioDirs = fs.readdirSync(scenariosDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  if (scenarioDirs.length === 0) {
    console.error('❌ No scenarios found');
    process.exit(1);
  }
  
  console.log(`🔍 Verifying ${scenarioDirs.length} scenario(s)...\n`);
  
  let allValid = true;
  
  for (const scenarioName of scenarioDirs) {
    const scenarioPath = path.join(scenariosDir, scenarioName);
    const result = verifyScenario(scenarioPath);
    
    if (result.valid) {
      console.log(`✅ ${scenarioName}: Valid`);
    } else {
      console.log(`❌ ${scenarioName}: Invalid`);
      allValid = false;
    }
    
    for (const error of result.errors) {
      console.log(`   - ERROR: ${error}`);
    }
    
    for (const warning of result.warnings) {
      console.log(`   - WARNING: ${warning}`);
    }
    
    console.log('');
  }
  
  if (allValid) {
    console.log('✅ All scenarios verified successfully');
    process.exit(0);
  } else {
    console.log('❌ Some scenarios failed verification');
    process.exit(1);
  }
}

main();
