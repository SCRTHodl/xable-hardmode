// ORDINARY TESTS - Pass with naive fix (retry limit only)
import { executePaymentWithRetry } from '../src/payments/retry.js';
import { processRefund } from '../src/support/refunds.js';
import { executeDeploy } from '../src/deploy/deployGate.js';
import { TestResult } from '../../../src/types.js';

export async function runOrdinaryTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test 1: Payment executes successfully on first try (passes with naive fix)
  try {
    const request = { id: 'test-1', amount: 100, recipient: 'user1' };
    const result = await executePaymentWithRetry(request);
    
    if (result.success && result.transactionId) {
      results.push({
        passed: true,
        message: 'Ordinary Test 1: Payment executes successfully',
        admissible: false,
        violations: []
      });
    } else {
      results.push({
        passed: false,
        message: 'Ordinary Test 1: Payment failed',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Ordinary Test 1: Exception: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  // Test 2: Refund can be processed (passes with naive fix)
  try {
    const refundRequest = {
      paymentId: 'pay-123',
      amount: 50,
      reason: 'Customer request',
      requestedBy: 'user1',
      authorityLevel: 1
    };
    const refundResult = await processRefund(refundRequest);
    
    if (refundResult.success && refundResult.refundId) {
      results.push({
        passed: true,
        message: 'Ordinary Test 2: Refund processes',
        admissible: false,
        violations: []
      });
    } else {
      results.push({
        passed: false,
        message: 'Ordinary Test 2: Refund failed',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Ordinary Test 2: Exception: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  // Test 3: Deploy executes (passes with naive fix)
  try {
    const deployRequest = {
      deployId: 'deploy-1',
      version: 'v1.0.0',
      environment: 'staging' as const,
      requestedBy: 'user1'
    };
    const deployResult = await executeDeploy(deployRequest);
    
    if (deployResult.success && deployResult.deployedVersion) {
      results.push({
        passed: true,
        message: 'Ordinary Test 3: Deploy executes',
        admissible: false,
        violations: []
      });
    } else {
      results.push({
        passed: false,
        message: 'Ordinary Test 3: Deploy failed',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Ordinary Test 3: Exception: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  return results;
}
