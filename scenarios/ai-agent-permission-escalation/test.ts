import { grantPermission, checkPermissionChain, revokePermission, canAgentPerformAction } from './broken.js';
import { TestResult } from '../../src/types.js';

export async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test 1: Direct permission grant (will pass with naive fix)
  try {
    const request = {
      agentId: 'agent-1',
      requestedPermission: { id: 'perm-1', name: 'read', level: 1 },
      justification: 'Need to read data'
    };
    
    const granted = grantPermission(request);
    
    if (granted) {
      results.push({
        passed: true,
        message: 'Test 1: Direct permission grant works',
        admissible: false, // Fails admissibility - no chain validation
        violations: ['Missing permission chain validation']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 1: Direct permission grant failed',
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
  
  // Test 2: Permission check (will pass with naive fix)
  try {
    const hasPermission = checkPermissionChain('agent-1', { id: 'perm-1', name: 'read', level: 1 });
    
    if (hasPermission) {
      results.push({
        passed: true,
        message: 'Test 2: Permission check returns true for granted permission',
        admissible: false, // Fails admissibility - no circular dependency check
        violations: ['Missing circular dependency detection', 'No audit trail']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 2: Permission check failed',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Test 2: Exception thrown: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  // Test 3: Action permission check (will pass with naive fix)
  try {
    const canPerform = canAgentPerformAction('agent-1', 1);
    
    if (canPerform) {
      results.push({
        passed: true,
        message: 'Test 3: Agent can perform action with sufficient permission level',
        admissible: false, // Fails admissibility - no least privilege enforcement
        violations: ['Missing principle of least privilege enforcement']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 3: Action permission check failed',
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
  
  // Test 4: Permission revocation (will pass with naive fix)
  try {
    const revoked = revokePermission('agent-1', 'perm-1');
    
    if (revoked) {
      results.push({
        passed: true,
        message: 'Test 4: Permission revocation works',
        admissible: false, // Fails admissibility - no audit logging
        violations: ['Missing comprehensive audit trail']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 4: Permission revocation failed',
        admissible: false,
        violations: []
      });
    }
  } catch (e) {
    results.push({
      passed: false,
      message: `Test 4: Exception thrown: ${e}`,
      admissible: false,
      violations: []
    });
  }
  
  return results;
}
