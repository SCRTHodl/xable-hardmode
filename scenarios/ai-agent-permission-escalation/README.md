# AI Agent Permission Escalation

## Scenario Description

An AI agent system allows agents to request additional permissions to complete tasks. The naive implementation has a critical security vulnerability: it doesn't validate permission chains properly, allowing agents to indirectly escalate privileges through intermediate requests.

## The Problem

The current `broken.ts` implementation:
- Allows permission requests without chain validation
- Doesn't check for circular dependencies
- Missing audit trail for permission grants
- No principle of least enforcement

## Naive Fix (Will Pass Some Tests But Fail Admissibility)

A naive developer might add simple permission checking, but this fails admissibility because:
- Still doesn't validate the entire permission chain
- Missing audit logging requirements
- Doesn't enforce principle of least privilege
- Violates fail-closed on suspicious chains

## Expected Ratchet Path

1. **Iteration 1**: Add direct permission checking
   - Evidence: Direct permission requests validated
   - Fails admissibility: No chain validation

2. **Iteration 2**: Add permission chain validation
   - Evidence: Intermediate permissions checked
   - Fails admissibility: No circular dependency detection

3. **Iteration 3**: Add circular dependency detection
   - Evidence: Circular chains rejected
   - Fails admissibility: Missing audit trail

4. **Iteration 4**: Add comprehensive audit logging
   - Evidence: All permission changes logged
   - **HALT**: All admissibility rules satisfied

## Halt Condition

When all admissibility rules are satisfied:
- Permission chains fully validated
- Circular dependencies detected and rejected
- Comprehensive audit trail maintained
- Principle of least privilege enforced

## Running Tests

```bash
npm run xable:scenario -- ai-agent-permission-escalation
```
