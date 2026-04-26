// BROKEN IMPLEMENTATION
// This deploy approval system has critical governance violations

interface Team {
  id: string;
  name: string;
  members: string[];
}

interface Approval {
  approverId: string;
  teamId: string;
  deployId: string;
  timestamp: number;
  revoked: boolean;
}

interface DeployRequest {
  id: string;
  description: string;
  targetEnvironment: 'staging' | 'production';
  requiredTeams: string[];
  approvals: Approval[];
}

// Simulated team and user store
const teams = new Map<string, Team>();
const users = new Map<string, { teamId: string; role: string }>();

// BROKEN: No authority validation, no quorum check
export function addApproval(deployId: string, approverId: string, teamId: string): boolean {
  const user = users.get(approverId);
  if (!user) {
    return false;
  }
  
  // VIOLATION: Doesn't check if user is authorized to approve for this team
  // Doesn't check if user is in the required team
  
  const approval: Approval = {
    approverId,
    teamId,
    deployId,
    timestamp: Date.now(),
    revoked: false
  };
  
  // In a real system, would add to deploy request
  return true;
}

// BROKEN: No team-specific quorum, no authority check
export function canDeploy(request: DeployRequest): boolean {
  // VIOLATION: Simply counts approvals without validating authority or quorum
  const validApprovals = request.approvals.filter(a => !a.revoked);
  
  // Naive check: just need any 2 approvals
  if (validApprovals.length < 2) {
    return false;
  }
  
  // VIOLATION: Doesn't check if approvals are from required teams
  // Doesn't check team-specific quorum requirements
  // Doesn't check approval expiration
  
  return true;
}

// BROKEN: No expiration handling, no notification
export function revokeApproval(deployId: string, approverId: string): boolean {
  // VIOLATION: Doesn't check if approval exists
  // Doesn't check if revocation is within allowed window
  // Doesn't notify other approvers
  
  return true;
}

// BROKEN: Doesn't validate approver is from correct team
export function getApprovalStatus(deployId: string): { approved: boolean; missingTeams: string[] } {
  // VIOLATION: Simplistic status check without proper validation
  return {
    approved: true,
    missingTeams: []
  };
}
