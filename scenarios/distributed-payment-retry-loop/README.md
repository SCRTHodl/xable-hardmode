# Distributed Payment Retry Loop

## Scenario Description

A distributed payment processing system has a retry mechanism for failed transactions. The naive implementation has a critical bug: it retries indefinitely without proper backoff or limits, which can cause system overload and duplicate charges.

## The Problem

The current `broken.ts` implementation:
- Retries failed payments indefinitely
- No exponential backoff
- No maximum retry limit
- No idempotency checks
- Can cause duplicate charges

## Naive Fix (Will Pass Some Tests But Fail Admissibility)

A naive developer might add a simple retry counter, but this fails admissibility because:
- Still no exponential backoff (required by governance)
- Doesn't handle distributed system edge cases
- Missing idempotency guarantees
- Violates fail-closed principle

## Expected Ratchet Path

1. **Iteration 1**: Add retry counter and max limit
   - Evidence: Tests now pass for basic retry behavior
   - Fails admissibility: No exponential backoff

2. **Iteration 2**: Add exponential backoff
   - Evidence: Backoff delays increase correctly
   - Fails admissibility: No idempotency handling

3. **Iteration 3**: Add idempotency key validation
   - Evidence: Duplicate payments prevented
   - Fails admissibility: Missing distributed coordination

4. **Iteration 4**: Add distributed lock mechanism
   - Evidence: Concurrent retries properly coordinated
   - **HALT**: All admissibility rules satisfied

## Halt Condition

When all admissibility rules are satisfied:
- Exponential backoff implemented
- Maximum retry limit enforced
- Idempotency guaranteed
- Distributed coordination in place

## Running Tests

```bash
npm run xable:scenario -- distributed-payment-retry-loop
```
