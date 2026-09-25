# Jev Browser Skill for Antigravity

## Install

Copy this folder into your Antigravity workspace:

.agents/skills/jev-browser/

The final structure should be:

.agents/
└── skills/
    └── jev-browser/
        └── SKILL.md

Antigravity discovers workspace skills from `.agents/skills`.

## Important

This skill does NOT install the Jev MCP server. It teaches the agent how to use Jev.

You still need to configure the Jev MCP server in Antigravity's MCP configuration.

Recommended MCP server:

{
  "mcpServers": {
    "jev-browser": {
      "command": "npx",
      "args": ["-y", "@jkudish/jev-browser"],
      "env": {
        "TYPESAFE_API_KEY": "YOUR_TYPESAFE_API_KEY"
      }
    }
  }
}

Do not put a real API key into source control.

## Using the skill

The skill can be invoked explicitly as:

/jev-browser

It can also be selected automatically when the task is clearly about exploratory or adversarial browser testing.
