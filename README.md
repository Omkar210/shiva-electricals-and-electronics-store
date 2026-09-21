# Shiva Electrical & Electronics --- Antigravity Engineering Pack

## Files

-   `00_MASTER_PROMPT.md` --- paste/load this into Antigravity as the
    master operating instruction.
-   `01_PRD.md` --- product requirements.
-   `02_ARCHITECTURE.md` --- technical architecture and database
    direction.
-   `03_RULES.md` --- engineering, security, quality, and agent rules.
-   `04_DESIGN.md` --- UI/UX/design system.
-   `05_TASKS.md` --- implementation backlog and definition of done.
-   `06_MEMORY.md` --- durable project context and decisions.

## Recommended repository placement

``` text
docs/
  PRD.md
  ARCHITECTURE.md
  RULES.md
  DESIGN.md
  TASKS.md
  MEMORY.md
```

Keep `00_MASTER_PROMPT.md` available to the agent as the top-level
instruction/reference. The six project documents should live inside the
repository under `docs/`.

## How to use

1.  Give Antigravity the master prompt.
2.  Make the six documents available in the repository.
3.  Tell the agent to inspect the repository before modifying anything.
4.  Let it execute tasks incrementally.
5.  Require verification before marking tasks complete.
6.  Update the living documents as the project evolves.

## Important

The documents intentionally do not contain real business information
such as phone numbers, exact address, delivery pincodes, actual product
prices, inventory, or payment credentials. Those must be supplied by the
business owner and should never be invented by the agent.
