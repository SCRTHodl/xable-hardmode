import { addApproval, canDeploy, revokeApproval, getApprovalStatus } from './broken.js';
import { TestResult } from '../../src/types.js';

export async function runTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  // Test 1: Add approval (will pass with naive fix)
  try {
    const added = addApproval('deploy-1', 'user-1', 'team-1');
    
    if (added) {
      results.push({
        passed: true,
        message: 'Test 1: Approval can be added',
        admissible: false, // Fails admissibility - no authority validation
        violations: ['Missing approver authority validation']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 1: Failed to add approval',
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
  
  // Test 2: Deploy with sufficient approvals (will pass with naive fix)
  try {
    const request = {
      id: 'deploy-2',
      description: 'Feature release',
      targetEnvironment: 'production' as const,
      requiredTeams: ['team-1', 'team-2'],
      approvals: [
        { approverId: 'user-1', teamId: 'team-1', deployId: 'deploy-2', timestamp: Date.now(), revoked: false },
        { approverId: 'user-2', teamId: 'team-2', deployId: 'deploy-2', timestamp: Date.now(), revoked: false }
      ]
    };
    
    const canDeployNow = canDeploy(request);
    
    if (canDeployNow) {
      results.push({
        passed: true,
        message: 'Test 2: Deploy allowed with 2 approvals',
        admissible: false, // Fails admissibility - no team-specific quorum
        violations: ['Missing team-specific quorum requirements', 'No approval expiration check']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 2: Deploy not allowed with 2 approvals',
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
  
  // Test 3: Approval revocation (will pass with naive fix)
  try {
    const revoked = revokeApproval('deploy-1', 'user-1');
    
    if (revoked) {
      results.push({
        passed: true,
        message: 'Test 3: Approval can be revoked',
        admissible: false, // Fails admissibility - no expiration handling
        violations: ['Missing approval expiration handling', 'No revocation window check']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 3: Failed to revoke approval',
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
  
  // Test 4: Approval status check (will pass with naive fix)
  try {
    const status = getApprovalStatus('deploy-1');
    
    if (status.approved) {
      results.push({
        passed: true,
        message: 'Test 4: Approval status returns approved',
        admissible: false, // Fails admissibility - no proper validation
        violations: ['Missing comprehensive approval validation']
      });
    } else {
      results.push({
        passed: false,
        message: 'Test 4: Approval status not approved',
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
