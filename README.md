# Xable Hardmode

A governed decision challenge repo where success requires admissibility, evidence, ratchet depth, and correct halting.

## Purpose

This is not a coding puzzle repo. It is a governed decision challenge designed to test your ability to:

1. **Identify admissibility violations** - Recognize when a solution violates governance rules
2. **Trace ratchet paths** - Follow the required iterations to reach a valid solution
3. **Provide evidence** - Justify each decision with concrete evidence
4. **Halt correctly** - Know when to stop and not over-fix

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
