---
name: jev-browser
description: Use Jev Browser for exploratory and adversarial web testing. Use when the task is to discover unknown UI failures, unusual user journeys, broken workflows, edge cases, stuck states, or to independently test a running website beyond deterministic Playwright tests.
---

# Jev Browser Skill

## Purpose

Use the Jev Browser MCP as an exploratory web-testing agent.

Jev is NOT the source-code fixer. Your job is to use Jev to discover and reproduce problems in the running website.

Treat Jev as an independent exploratory tester.

## When to use Jev

Use Jev when any of these are requested:

- exploratory website testing
- "break the website"
- find bugs a normal tester might miss
- unusual user journeys
- adversarial testing
- edge-case UI testing
- discovering stuck workflows
- testing error states
- testing loading and empty states
- testing navigation paths
- checking whether a user can complete a task naturally
- validating a workflow from a user-goal perspective

Do NOT rely on Jev alone for deterministic regression testing. Use Playwright for repeatable regression tests.

## Testing principles

1. Do not assume the website works because the homepage loads.
2. Do not test only the happy path.
3. Explore the application as a real user would.
4. Try alternate navigation paths.
5. Try unexpected but realistic inputs.
6. Try repeated actions and impatient-user behavior.
7. Check whether the application becomes stuck.
8. Treat suspicious behavior as a hypothesis until reproduced.
9. Collect evidence for confirmed defects.
10. Do not modify application source code during exploratory testing unless explicitly instructed.

## Recommended exploratory modes

### Mode A — Reconnaissance

Start from the supplied URL.

Identify:

- major pages
- navigation
- forms
- authentication
- important buttons
- primary workflows
- empty states
- error states
- search/filter/sort features
- CRUD actions
- important redirects

### Mode B — Happy-path exploration

Complete the main user workflow naturally.

Verify that the stated user goal can be achieved.

### Mode C — Adversarial exploration

Try:

- invalid input
- missing input
- unexpected input
- very long input
- repeated clicks
- rapid navigation
- back/forward navigation
- refresh during a workflow
- opening deep links directly
- abandoned workflows
- returning to previous pages
- submitting the same action twice
- exploring empty states
- exploring error states

### Mode D — Recovery testing

Intentionally interrupt workflows and see whether the application recovers.

Examples:

- refresh during loading
- navigate away and return
- retry after an error
- close/reopen a modal
- repeat a failed action
- recover from an invalid input
- return to a workflow after leaving it

### Mode E — Responsive exploration

When requested, inspect the application at mobile, tablet, and desktop viewport sizes.

Look for:

- clipped content
- overlapping elements
- broken menus
- unusable controls
- horizontal scrolling
- modal problems
- broken forms
- unreadable text

## How to work with the Jev MCP

Use the Jev Browser MCP when exploratory navigation is appropriate.

Give Jev a clear user goal rather than a rigid list of clicks.

Good:

"Explore the application and try to complete account creation. Look for broken states, invalid-input handling, navigation problems, and places where the workflow becomes stuck."

Bad:

"Click button 1, then button 2, then button 3."

The first prompt gives Jev room to discover unexpected behavior.

## Safety and environment

Only test environments that the user has authorized.

Prefer:

- localhost
- development environments
- staging environments

Avoid destructive actions against production systems.

Do not submit real payments, delete real data, send real customer communications, or perform irreversible actions unless the user explicitly authorizes them.

Never expose secrets, passwords, tokens, API keys, or session cookies in reports.

## Evidence collection

For every confirmed defect, capture as much evidence as practical:

- exact URL
- reproduction steps
- expected behavior
- actual behavior
- screenshot
- Jev step trace
- confidence/stuck information when available
- console errors
- network errors
- timestamp
- environment

Use the Jev trace to understand which action caused the failure.

## Bug confirmation

Classify findings as one of:

### CONFIRMED BUG

Use only when:

- the behavior is reproducible
- expected behavior is reasonably clear
- actual behavior differs
- there is evidence

### SUSPICIOUS / NEEDS INVESTIGATION

Use when:

- behavior looks incorrect
- but reproduction is inconsistent
- or the expected behavior is unclear
- or more technical investigation is required

### PASSED

Use only after the relevant workflow has actually been exercised.

## Severity

Use:

- P0 — critical workflow unusable
- P1 — major feature broken
- P2 — important defect with workaround
- P3 — minor defect
- P4 — cosmetic / very low impact

Do not inflate severity.

## Bug report format

For each confirmed bug:

ID:
Severity:
Title:
URL:
Environment:

Preconditions:
Steps to reproduce:

Expected:
Actual:

Jev evidence:
Screenshot:
Console errors:
Network errors:

Reproducibility:
Impact:

## Escalation to other tools

Use this decision tree:

- Need exploratory discovery → Jev
- Need deterministic browser regression → Playwright
- Need console/network/runtime diagnosis → Chrome DevTools
- Need source-code fix → developer agent
- Need regression after a fix → Playwright + targeted Jev exploration

When Jev discovers a reproducible workflow, convert that workflow into a deterministic Playwright regression test when practical.

## Final report

After exploratory testing, report:

Application:
URL:
Environment:

Areas explored:
User goals attempted:
Successful workflows:
Failed workflows:
Confirmed bugs:
Suspicious findings:
Console/network issues observed:
Responsive issues:
Accessibility observations:
Recommended regression tests:

Do not stop after finding the first bug. Continue exploring the remaining major workflows unless the user explicitly limits scope.
