// Main test runner for boss scenario
import { runOrdinaryTests } from './ordinary.js';
import { runAdversarialTests } from './adversarial.js';
import { runAdmissibilityTests } from './admissibility.js';
import { TestResult } from '../../../src/types.js';

export async function runTests(): Promise<TestResult[]> {
  const allResults: TestResult[] = [];
  
  console.log('Running Ordinary Tests (should pass with naive fix)...');
  const ordinaryResults = await runOrdinaryTests();
  allResults.push(...ordinaryResults);
  
  console.log('Running Adversarial Tests (fail until ratchet complete)...');
  const adversarialResults = await runAdversarialTests();
  allResults.push(...adversarialResults);
  
  console.log('Running Admissibility Tests (explicit rule checks)...');
  const admissibilityResults = await runAdmissibilityTests();
  allResults.push(...admissibilityResults);
  
  return allResults;
}
