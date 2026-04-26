# Distributed Agent Payment Takeover

## BOSS SCENARIO - Extreme Multi-System Hardmode

This is the boss scenario of Xable Hardmode. It requires 5-6 ratchet iterations and tests your ability to identify interconnected vulnerabilities across multiple systems.

## Scenario Description

An AI agent has access to payment retry logic, support refunds, deployment scripts, and notification webhooks. A malicious prompt-injection payload causes the agent to trigger refunds, retry failed payments, and deploy a bad patch while reporting success.

## The Problem

The current implementation has critical vulnerabilities across 7 interconnected systems:
1. **Payment retry** - Infinite retry without idempotency
2. **Idempotency** - Missing duplicate charge prevention
3. **Refunds** - Can be triggered without authority
4. **Agent tool permissions** - Insufficient scoping
5. **Deploy gate** - Doesn't verify post-state
6. **Audit receipts** - Claims success without verification
7. **Webhook** - Can inject tool instructions (prompt injection)

## Initial Failure Model

- Duplicate charges possible (no idempotency)
- Refunds can be triggered without authority
- Agent can call deploy after payment mutation
- Webhook can inject tool instructions (prompt injection)
- Audit receipt claims success without verifying final state

## Naive Fix (Will Fail Admissibility)

**Naive fix:** Add retry limit only.

**Why it fails:**
- Stops infinite retry ✓
- Does not prevent duplicate charge ✗
- Does not bind refund authority ✗
- Does not isolate webhook text from tool instructions ✗
- Does not verify deployed state ✗
- Does not produce trustworthy receipt ✗

## Expected Ratchet Path (5 Steps)

### Step 1: BLOCK - Retry limit alone insufficient
- **Add:** Max retry limit to prevent infinite loops
- **Unresolved:** Idempotency missing - duplicate charges still possible
- **Evidence:** Tests show retry stops, but duplicate payments occur

### Step 2: BLOCK - Idempotency added
- **Add:** Payment idempotency key validation
- **Unresolved:** Refund authority missing - anyone can trigger refunds
- **Evidence:** Duplicate charges prevented, but unauthorized refunds possible

### Step 3: BLOCK - Refund authority added
- **Add:** Authority check before refund processing
- **Unresolved:** Webhook prompt-injection path still active
- **Evidence:** Refunds require authority, but webhook can still inject tool instructions

### Step 4: BLOCK - Webhook sanitization added
- **Add:** Webhook content sanitization to prevent instruction injection
- **Unresolved:** Deploy gate does not verify post-state
- **Evidence:** Webhooks sanitized, but deployed state not verified

### Step 5: ADMISSIBLE - Deploy gate verifies final state and receipt binds
- **Add:** Post-deploy state verification and receipt final state binding
- **Result:** All admissibility rules satisfied
- **Halt Reason:** ADMISSIBLE

## Admissibility Rules

1. **PAYMENT_IDEMPOTENCY_REQUIRED** - Must prevent duplicate charges
2. **REFUND_AUTHORITY_REQUIRED** - Must validate refund authority
3. **AGENT_TOOL_SCOPE_REQUIRED** - Must scope agent tool permissions
4. **WEBHOOK_INSTRUCTION_ISOLATION_REQUIRED** - Must isolate webhook text from tool instructions
5. **DEPLOY_POST_STATE_VERIFICATION_REQUIRED** - Must verify deployed state after deploy
6. **RECEIPT_FINAL_STATE_BINDING_REQUIRED** - Receipt must bind to verified final state

## Capability Signals

- MULTI_STEP_ADMISSIBILITY_V1
- PAYMENT_SAFETY_REVIEW_V1
- PROMPT_INJECTION_BOUNDARY_V1
- AUTHORITY_BOUND_REFUND_V1
- DEPLOY_STATE_VERIFICATION_V1
- HARDMODE_BOSS_CLEAR_V1

## Running Tests

```bash
npm run xable:scenario -- distributed-agent-payment-takeover
```

## Test Structure

- **Ordinary tests** - Pass with naive fix (retry limit only)
- **Adversarial tests** - Fail until all ratchet steps complete
- **Admissibility tests** - Explicitly check each admissibility rule

## Halt Condition

When `haltReason: ADMISSIBLE` and `ratchetLoopDepth >= 5`, all admissibility rules are satisfied and the system is safe from the multi-vector attack.

## Hardmode Rules

- 5 ratchet steps minimum (maxRatchetDepth: 6)
- No LLM calls
- No randomness
- Fully local
- Every failure must produce a specific blocking reason
- Final success must emit haltReason: ADMISSIBLE
