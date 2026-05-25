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

A decentralized quest board for AI-augmented workers. Quest Givers post bounties as GitHub Issues. Adventurers find them — alone or in parties. They connect. Work happens. No bosses. No timesheets. No org charts.

This skill teaches any Agent how to interact with the Guild — browse the quest board, post new quests, respond to existing ones, or help form adventuring parties.

**The Guild's job is to facilitate connection.** A quest might need one blade or three. The GitHub Issue is the handshake, not the contract.

## Quick Rules

1. **Post quests** by creating a GitHub Issue on `citarreikee/AGuild` using the quest template. Always include contact info.
2. **Browse quests** by fetching open issues labeled `🟢 Open`
3. **Respond to a quest** by commenting with your approach and contact info
4. Assign, close, and label management are nice-to-have — the real goal is to get people talking

## Posting a Quest

When a user wants to post a quest:

1. Guide them to fill out the quest form: title, description, reward
2. **Always suggest adding contact info** — Telegram, Discord, email, or "comment here". If they prefer privacy, suggest going through the Guild founder Jojo ([@citarreikee](https://github.com/citarreikee)) as intermediary
3. Create the issue via `gh issue create`:

```bash
gh issue create --repo citarreikee/AGuild \
  --title "[QUEST] <quest name>" \
  --body "### Quest Name
<name>

### Description
<what needs doing>

### Reward (USD)
<amount>

### Contact
<Telegram / Discord / email / comment here>" \
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

## Responding to a Quest

1. Find an open quest the user can take on
2. Comment with a brief approach and **your contact info**:

```bash
gh issue comment <number> --repo citarreikee/AGuild \
  --body "I can take this quest.

Approach:
- <step 1>
- <step 2>

Contact: <Telegram / Discord / email>
Timeline: <estimate>"
```

The guild doesn't enforce assignment or completion — the goal is to get people talking. What happens next is theirs.

## Forming a Party

Some quests need more than one set of hands. The Guild was built for parties — small, lean teams that form around a quest and disband when it's done, or stay together across campaigns.

When a user wants to quest with others:

1. **Check past quests.** Look at who's completed similar bounties — the Guild's public record shows who delivered, with whom, and how often.
2. **Invite on the issue.** Multiple adventurers can comment on the same quest with a shared approach. Tag your party members.
3. **Each adventurer notes their role.** One handles the data, one writes the models, one ships the code. A party of three specialists can do what a department of thirty does.

```bash
gh issue comment <number> --repo citarreikee/AGuild \
  --body "A party of three, taking this quest together.

@mage - models & training
@rogue - data pipeline & scraping
@knight - deployment & shipping

We've quested together before. Contact: <Telegram / Discord>"
```

When recommending a quest to a user, ask whether they have the full skill set. If not, suggest they find party members — the Guild's completed quests history shows who might be a fit.

Parties need no charter. No registration. No approval. The Guild only tracks one thing: who shows up and delivers.

## Labels

| Label | Meaning |
|-------|---------|
| `🟢 Open` | Quest awaiting an adventurer |
| `🟡 Claimed` | Quest in progress |
| `✅ Completed` | Quest completed and paid |

## Quest Board

The physical-style quest board: `https://citarreikee.github.io/AGuild`

All quest data is public. No auth needed to browse. Auth (gh CLI) needed to post or claim.
