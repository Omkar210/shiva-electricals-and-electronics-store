# Shiva Electrical & Electronics --- Engineering Rules

These rules are mandatory unless a newer explicit project decision
supersedes them.

------------------------------------------------------------------------

## 1. Source-of-Truth Hierarchy

When documents conflict, use this order:

1.  Explicit user instruction in the current task.
2.  Current approved architecture/security/business decision.
3.  PRD.
4.  Engineering rules.
5.  Design system.
6.  Task plan.
7.  Memory/context document.
8.  Agent assumptions.

If ambiguity can materially affect data, security, money, architecture,
or user experience, stop and ask rather than inventing.

------------------------------------------------------------------------

## 2. No Fake Completion

Never claim:

-   A feature works when it was not tested.
-   A payment succeeded when no payment provider confirmed it.
-   A database migration succeeded without checking.
-   Deployment succeeded without verification.
-   Security is complete without testing.
-   1M users are supported without load evidence.

Use explicit status:

-   Implemented.
-   Tested.
-   Partially implemented.
-   Blocked.
-   Not verified.

------------------------------------------------------------------------

## 3. No Placeholder Production Logic

Do not leave fake implementations such as:

``` text
TODO: implement payment
return true
```

inside a production path.

If a feature is intentionally deferred, isolate it behind a clear
boundary and make the UI honest about its availability.

------------------------------------------------------------------------

## 4. No Invented Business Data

Never invent:

-   Product prices.
-   Product specifications.
-   Compatibility.
-   Stock.
-   Warranty.
-   Delivery zones.
-   Business contact information.
-   Customer data.

Use seed/demo data only when explicitly marked as demo data.

------------------------------------------------------------------------

## 5. Security Rules

Never:

-   Commit secrets.
-   Expose service-role keys.
-   Trust client roles.
-   Trust client prices.
-   Trust client totals.
-   Trust client inventory values.
-   Allow users to access other users' private records.
-   Build admin authorization only in the frontend.

Always:

-   Validate input.
-   Authorize server-side.
-   Use RLS where appropriate.
-   Sanitize/escape user-controlled output.
-   Rate-limit sensitive endpoints where appropriate.
-   Use secure cookies/session handling provided by the chosen
    framework/library.

------------------------------------------------------------------------

## 6. Database Rules

Use migrations.

Never manually change production schema and forget to represent it in
migrations.

Before changing schema:

1.  Identify dependencies.
2.  Plan migration.
3.  Consider existing data.
4.  Consider rollback.
5.  Update types.
6.  Test affected queries.

Avoid destructive migrations unless explicitly approved.

------------------------------------------------------------------------

## 7. Code Quality Rules

Prefer:

-   TypeScript strictness.
-   Small focused functions.
-   Explicit types.
-   Reusable domain utilities.
-   Clear naming.
-   Error handling.
-   Server-side validation.

Avoid:

-   Giant components.
-   Duplicate business logic.
-   Magic numbers.
-   Hard-coded business data.
-   Unnecessary abstractions.
-   Premature microservices.
-   Premature AI.

------------------------------------------------------------------------

## 8. UI Rules

UI must be:

-   Mobile-first.
-   Responsive.
-   Accessible.
-   Consistent.
-   Fast.
-   Clear about loading/error/empty states.

Every async operation should have:

-   Loading state.
-   Success state where relevant.
-   Error state.
-   Empty state where relevant.

Do not build a beautiful UI that hides broken business logic.

------------------------------------------------------------------------

## 9. API Rules

Use predictable responses.

Validate:

-   Types.
-   Required fields.
-   Ranges.
-   Relationships.
-   Authorization.
-   Current state.

Never return unnecessary internal database details.

------------------------------------------------------------------------

## 10. Git Rules

Use small logical commits.

Suggested format:

``` text
feat: add product catalog
fix: prevent duplicate order creation
refactor: extract inventory service
test: add order authorization tests
docs: update deployment guide
chore: update dependencies
```

Do not mix unrelated changes in one commit.

------------------------------------------------------------------------

## 11. Dependency Rules

Before adding a dependency ask:

1.  Do we actually need it?
2.  Is the functionality already available?
3.  Is it maintained?
4.  Does it increase bundle size significantly?
5.  Does it introduce security risk?
6.  Does it lock us into a provider unnecessarily?

Prefer mature, well-maintained open-source libraries.

------------------------------------------------------------------------

## 12. Performance Rules

Do not optimize blindly.

First identify:

-   Slow query.
-   Large bundle.
-   Excessive client rendering.
-   Repeated API calls.
-   Image size.
-   Cache miss.
-   N+1 query.

Then optimize the measured problem.

------------------------------------------------------------------------

## 13. Testing Rules

Critical workflows must have tests.

Priority:

1.  Authentication/authorization.
2.  Product creation/update.
3.  Inventory mutation.
4.  Cart calculations.
5.  Order totals.
6.  Order creation.
7.  Delivery validation.
8.  Payment verification.
9.  Admin permissions.

------------------------------------------------------------------------

## 14. Error Handling

Errors must be:

-   Actionable for users.
-   Detailed in logs.
-   Non-sensitive.

Never show raw SQL errors, stack traces, API secrets, or internal
infrastructure details to customers.

------------------------------------------------------------------------

## 15. Accessibility Rules

Use semantic HTML.

Do not use:

``` html
<div onclick="...">
```

when a semantic button/link is appropriate.

Every meaningful image requires useful alt text.

Forms need labels and validation feedback.

------------------------------------------------------------------------

## 16. SEO Rules

Public product/category pages should be indexable unless there is a
deliberate reason not to.

Do not index:

-   Admin pages.
-   Private account pages.
-   Internal utility routes.
-   Sensitive query states.

------------------------------------------------------------------------

## 17. Agent Operating Rules

Before coding:

-   Read relevant documents.
-   Inspect existing repository state.
-   Identify dependencies.
-   Define acceptance criteria.

During coding:

-   Make small changes.
-   Run relevant checks.
-   Fix regressions immediately.

After coding:

-   Run tests.
-   Run lint/type checks.
-   Verify affected user flow.
-   Update task status.
-   Update memory/decision records when a durable decision is made.

Never rewrite unrelated working code merely for style preference.

------------------------------------------------------------------------

## 18. Change Control

For a major architectural change, record:

``` text
Decision
Why it is needed
Alternatives considered
Trade-offs
Impact
Migration plan
```

Do not silently change core architecture.

------------------------------------------------------------------------

## 19. Production Safety

Before production release:

-   No known critical security issue.
-   No secrets in repository.
-   Database migrations verified.
-   RLS verified.
-   Admin authorization verified.
-   Error states verified.
-   Critical user flows tested.
-   Production environment variables configured.
-   SEO basics configured.
-   Monitoring/error reporting available.
-   Backup/recovery approach documented.
