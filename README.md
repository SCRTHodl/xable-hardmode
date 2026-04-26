# Xable Hardmode

A governed decision challenge repo where success requires admissibility, evidence, ratchet depth, and correct halting.

## Purpose

This is not a coding puzzle repo. It is a governed decision challenge designed to test your ability to:

1. **Identify admissibility violations** - Recognize when a solution violates governance rules
2. **Trace ratchet paths** - Follow the required iterations to reach a valid solution
3. **Provide evidence** - Justify each decision with concrete evidence
4. **Halt correctly** - Know when to stop and not over-fix

## What This Proves

Xable Hardmode proves that **admissibility under governance constraints** is required for safe system operation. Success requires:

- **Request → Decision → Execution → Proof**: Every action must follow a traceable path where the decision is admissible under governance rules, the execution is verified, and proof is bound to the final state.

- **Governance constraints are not optional**: Naive fixes that pass ordinary tests will fail adversarial and admissibility checks because they violate governance rules.

- **Evidence is required**: Each ratchet step must produce evidence that the fix satisfies the corresponding admissibility rule.

- **Halting is a decision**: Correct halting means stopping when the halt condition is met, not over-fixing beyond admissibility requirements.

## Hardmode Rules

- Naive fixes must pass some tests but fail admissibility
- Each scenario requires 2–4 ratchet iterations
- Every scenario must have a halt condition
- No LLM calls
- No randomness
- No backend
- No accounts
- No Stripe
- Fully local and forkable

## Passing Tests Is Not Enough

Hardmode scenarios are designed so that naive fixes may pass ordinary tests but fail adversarial and admissibility checks. This is intentional: passing unit tests is necessary but not sufficient for admissibility.

- **Ordinary tests** verify basic functionality (e.g., payment executes, refund processes)
- **Adversarial tests** verify the system resists attack vectors (e.g., duplicate payments, unauthorized refunds)
- **Admissibility tests** verify governance constraints are satisfied (e.g., authority validation, state verification)

A solution is admissible only when all three test categories pass.

## Structure

```
.
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── verify.ts          # Scenario validation
│   ├── scenarioRunner.ts  # Test execution
│   └── types.ts           # Shared types
└── scenarios/
    ├── distributed-payment-retry-loop/
    ├── ai-agent-permission-escalation/
    ├── cross-team-deploy-approval/
    └── distributed-agent-payment-takeover/ (boss scenario)
```

Each scenario includes:
- `README.md` - Scenario description and goals
- `broken.ts` - The broken implementation
- `test.ts` - Tests (naive fix passes some, fails admissibility)
- `admissibility-rules.json` - Governance rules for the scenario
- `expected-ratchet-path.json` - Required iterations
- `capability-signals.json` - What capabilities are signaled

## Getting Started

```bash
npm install
npm test                    # Run all tests
npm run xable:verify        # Validate scenario structure
npm run xable:scenario -- distributed-payment-retry-loop
```

## The Challenge

For each scenario:

1. Read the scenario README to understand the problem
2. Examine the broken implementation
3. Run the tests to see what passes
4. Check admissibility-rules.json for governance constraints
5. Follow expected-ratchet-path.json for required iterations
6. Fix the implementation correctly
7. Verify with capability-signals.json
8. Halt when the halt condition is met

## Verification

The `xable:verify` script validates:
- Scenario manifest structure
- Expected ratchet path
- Admissibility rules exist
- Capability signals exist
- Fails closed on missing files

## Philosophy

This repo teaches that:
- Passing tests is not enough
- Governance rules matter
- Evidence is required
- Knowing when to stop is a skill

## Trust Boundary

**Local demo verification is not production authority.**

This repo provides local demo evidence only. Production authority requires signed trusted-gate decisions. Unsigned or local decisions are demo evidence, not production-grade authority.

- Local verification demonstrates understanding of admissibility concepts
- Production authority requires signed decisions from trusted gates
- This repo is for learning and demonstration, not for production deployment
- A system may appear to succeed (tests pass), but Xable enforces that actions are not allowed to exist unless they are admissible
