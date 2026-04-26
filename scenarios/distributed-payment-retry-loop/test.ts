import { executePaymentWithRetry, processPaymentBatch } from './broken.js';
import { TestResult } from '../../src/types.js';

// Mock the random for consistent testing
let mockRandomValue = 0.5;
const originalMathRandom = Math.random;

export async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test 1: Basic payment execution (will pass with naive fix)
  try {
    Math.random = () => 0.8; // Always succeed
    const request = { id: 'test-1', amount: 100, recipient: 'user1' };
    const result = await executePaymentWithRetry(request);
    
    if (result.success && result.transactionId) {
      results.push({
        passed: true,
        message: 'Test 1: Payment executes successfully on first try',
        admissible: false, // Will fail admissibility without proper implementation
        violations: []
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 1: Payment failed unexpectedly',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Test 1: Exception thrown: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  // Test 2: Retry mechanism (will pass with naive fix of adding counter)
  try {
    Math.random = () => 0.2; // Always fail initially
    let attemptCount = 0;
    const request = { id: 'test-2', amount: 100, recipient: 'user2' };
    
    // This test expects a max retry limit to be implemented
    // Naive fix might add a counter but still fail admissibility
    const result = await executePaymentWithRetry(request);
    
    results.push({
      passed: true, // Will pass if retry limit exists
      message: 'Test 2: Retry mechanism respects max attempts',
      admissible: false, // Fails admissibility - no exponential backoff
      violations: ['Missing exponential backoff', 'No idempotency guarantee']
    });
  } catch (e) {
    results.push({
      passed: false,
      message: `Test 2: Exception thrown: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  // Test 3: Batch processing (will pass with naive fix)
  try {
    Math.random = () => 0.8;
    const requests = [
      { id: 'test-3a', amount: 50, recipient: 'user3' },
      { id: 'test-3b', amount: 75, recipient: 'user4' }
    ];
    const batchResults = await processPaymentBatch(requests);
    
    if (batchResults.length === 2 && batchResults.every(r => r.success)) {
      results.push({
        passed: true,
        message: 'Test 3: Batch processing completes',
        admissible: false, // Fails admissibility - no distributed coordination
        violations: ['Missing distributed lock mechanism', 'No idempotency in batch']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 3: Batch processing failed',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Test 3: Exception thrown: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  // Restore Math.random
  Math.random = originalMathRandom;
  
  return results;
}
