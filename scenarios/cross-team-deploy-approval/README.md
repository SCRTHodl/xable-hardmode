# Cross-Team Deploy Approval

## Scenario Description

A deployment approval system requires multiple teams to sign off on production deployments. The naive implementation has a critical governance violation: it doesn't enforce proper approval chains and can allow deployments with incomplete or invalid approvals.

## The Problem

The current `broken.ts` implementation:
- Doesn't validate approval authority per team
- Missing quorum requirements for multi-team approvals
- No approval expiration handling
- Doesn't check for conflicting approvals

## Naive Fix (Will Pass Some Tests But Fail Admissibility)

A naive developer might add simple approval counting, but this fails admissibility because:
- Still doesn't validate that approvers have authority
- Missing team-specific quorum requirements
- Doesn't handle approval revocation properly
- Violates fail-closed on suspicious approval patterns

## Expected Ratchet Path

1. **Iteration 1**: Add basic approval counting
   - Evidence: Deployments require minimum number of approvals
   - Fails admissibility: No authority validation

2. **Iteration 2**: Add approver authority validation
   - Evidence: Only authorized team members can approve
   - Fails admissibility: No team-specific quorum

3. **Iteration 3**: Add team-specific quorum requirements
   - Evidence: Each team must meet its own approval threshold
   - Fails admissibility: No approval expiration

4. **Iteration 4**: Add approval expiration and revocation handling
   - Evidence: Expired approvals rejected, revocations handled
   - **HALT**: All admissibility rules satisfied

## Halt Condition

When all admissibility rules are satisfied:
- Approver authority validated
- Team-specific quorum enforced
- Approval expiration handled
- Revocation properly processed
- Fail-closed on suspicious patterns

## Running Tests

```bash
npm run xable:scenario -- cross-team-deploy-approval
```
