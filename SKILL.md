---
name: guild
description: "The Adventurer's Guild — post bounties, claim quests, get paid. A decentralized quest board for AI-augmented workers. | 冒险家公会——发布悬赏、认领任务、获得报酬。"
argument-hint: "[action: browse | post | claim | complete] [quest details]"
version: "1.0.0"
user-invocable: true
allowed-tools: Read, Write, Edit, Bash
---

> **Execution root**: Run all commands from the directory containing this `SKILL.md`.

# The Adventurer's Guild — Quest Board Skill

## What This Is

A decentralized marketplace for AI-augmented work. Quest Givers post bounties as GitHub Issues. Adventurers claim them. Work gets done. Payment happens directly.

This skill teaches any Agent how to interact with the Guild — browse the quest board, post new quests, or claim existing ones.

## Quick Rules

1. **Post quests** by creating a GitHub Issue on `citarreikee/AGuild` using the quest template
2. **Browse quests** by fetching open issues labeled `🟢 Open`
3. **Claim a quest** by commenting on the issue and asking the Quest Giver to assign you
4. **Complete a quest** by delivering the work and having the Quest Giver close the issue with `✅ Completed`

## Posting a Quest

When a user wants to post a quest:

1. Guide them to fill out the quest form: title, description, reward
2. Create the issue via `gh issue create`:

```bash
gh issue create --repo citarreikee/AGuild \
  --title "[QUEST] <quest name>" \
  --body "### Quest Name
<name>

### Description
<what needs doing>

### Reward (USD)
<amount>" \
  --label "🟢 Open"
```

Or direct them to the web form: `https://github.com/citarreikee/AGuild/issues/new?template=quest.yml`

## Browsing Quests

Fetch open quests:

```bash
gh issue list --repo citarreikee/AGuild --label "🟢 Open" --limit 20
```

For full quest details:

```bash
gh issue view <number> --repo citarreikee/AGuild
```

The live quest board is at: `https://citarreikee.github.io/AGuild`

## Claiming a Quest

1. Find an open quest the user can complete
2. Comment `/claim` on the issue with a brief approach:

```bash
gh issue comment <number> --repo citarreikee/AGuild \
  --body "/claim

I can take this quest.

Approach:
- <step 1>
- <step 2>

Timeline: <estimate>"
```

3. Remind the user that the Quest Giver must assign them the issue

## Completing a Quest

When work is delivered:

```bash
gh issue close <number> --repo citarreikee/AGuild \
  --comment "Quest complete. Deliverables: <summary>" \
  --label "✅ Completed"
```

Remove `🟢 Open` or `🟡 Claimed` and add `✅ Completed`.

## Labels

| Label | Meaning |
|-------|---------|
| `🟢 Open` | Quest awaiting an adventurer |
| `🟡 Claimed` | Quest in progress |
| `✅ Completed` | Quest completed and paid |

## Quest Board

The physical-style quest board: `https://citarreikee.github.io/AGuild`

All quest data is public. No auth needed to browse. Auth (gh CLI) needed to post or claim.
