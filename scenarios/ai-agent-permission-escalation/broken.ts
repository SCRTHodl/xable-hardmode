// BROKEN IMPLEMENTATION
// This permission system has critical security violations

interface Permission {
  id: string;
  name: string;
  level: number; // 1-10, higher = more powerful
}

interface Agent {
  id: string;
  permissions: Permission[];
}

interface PermissionRequest {
  agentId: string;
  requestedPermission: Permission;
  justification: string;
  requestingAgentId?: string; // If another agent is requesting on behalf
}

// Simulated permission store
const permissionStore = new Map<string, Permission[]>();
const agents = new Map<string, Agent>();

// BROKEN: No chain validation, no circular dependency check
export function grantPermission(request: PermissionRequest): boolean {
  const agent = agents.get(request.agentId);
  if (!agent) {
    return false;
  }
  
  // VIOLATION: No validation of permission chain
  // If agent A requests permission for agent B, we don't check
  // if A has the right to request that permission
  if (request.requestingAgentId) {
    const requestingAgent = agents.get(request.requestingAgentId);
    if (!requestingAgent) {
      return false;
    }
    // Should check if requestingAgent has permission to grant this
    // Currently bypasses this check
  }
  
  // Simply grant the permission without proper validation
  agent.permissions.push(request.requestedPermission);
  return true;
}

// BROKEN: No circular dependency detection
export function checkPermissionChain(agentId: string, targetPermission: Permission): boolean {
  const agent = agents.get(agentId);
  if (!agent) {
    return false;
  }
  
  // VIOLATION: Only checks direct permissions
  // Doesn't validate the chain of how permissions were granted
  return agent.permissions.some(p => p.id === targetPermission.id);
}

// BROKEN: No audit trail
export function revokePermission(agentId: string, permissionId: string): boolean {
  const agent = agents.get(agentId);
  if (!agent) {
    return false;
  }
  
  const index = agent.permissions.findIndex(p => p.id === permissionId);
  if (index === -1) {
    return false;
  }
  
  agent.permissions.splice(index, 1);
  return true;
}

// BROKEN: Missing principle of least privilege enforcement
export function canAgentPerformAction(agentId: string, requiredLevel: number): boolean {
  const agent = agents.get(agentId);
  if (!agent) {
    return false;
  }
  
  // VIOLATION: Returns true if ANY permission meets the level
  // Should enforce that the agent has the MINIMUM necessary permission
  return agent.permissions.some(p => p.level >= requiredLevel);
}
