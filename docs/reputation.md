# 🏅 Reputation System · 声望系统

> ⚠️ In the MVP phase, reputation is tracked manually. Automated on-chain reputation (soulbound NFTs) is planned for v3.

---

## Why Reputation Matters · 为什么声望重要

In a guild, your reputation is your resume. It determines:

- Which quests you can claim (some S-Rank quests require Master+)
- How much Quest Givers trust you
- Your negotiating power on reward and timeline
- Your standing in the Guild community

---

## Rank Progression · 等级晋升

| Rank | Title | Requirements |
|------|-------|-------------|
| ⭐ | **Novice** · 新手 | 1 completed quest |
| ⭐⭐ | **Adventurer** · 冒险家 | 5 completed quests |
| ⭐⭐⭐ | **Veteran** · 老兵 | 15 completed quests + 1 A-Rank or higher |
| ⭐⭐⭐⭐ | **Master** · 大师 | 30 completed quests + 3 S-Rank quests |
| ⭐⭐⭐⭐⭐ | **Legend** · 传奇 | 50+ completed quests, S-Rank specialist, community contributions |

---

## Earning Reputation · 获取声望

| Action | Reputation Points |
|--------|------------------|
| Complete a D-Rank quest | 1 pt |
| Complete a C-Rank quest | 3 pts |
| Complete a B-Rank quest | 8 pts |
| Complete an A-Rank quest | 20 pts |
| Complete an S-Rank quest | 50 pts |
| Pro Bono contribution | 5 pts |
| Quest Giver praise (in-thread) | +1 bonus |
| Mentoring a Novice | 10 pts |

---

## Losing Reputation · 声望扣除

| Action | Penalty |
|--------|---------|
| Abandoned quest (no communication) | -10 pts |
| Late delivery (without notice) | -3 pts |
| Dispute found against you | -20 pts |
| Guild rule violation | Up to permanent ban |

---

## Reputation Tracking (Current MVP) · 声望追踪（当前）

For now, reputation is tracked through:

1. **Your GitHub profile** — completed quests = closed issues with `✅ Completed` label where you were assigned
2. **The Leaderboard** — the [Guild Hall](https://citarreikee.github.io/AGuild) page shows top adventurers by completed quests
3. **Self-reported flair** — add your rank to your GitHub bio/profile README

### Claim Your Rank · 领取你的头衔

Once you've met the requirements for a rank, open a Discussion with the `🏅 Rank Up` tag. A Guild moderator will verify your quest history and confirm.

---

## Future: On-Chain Reputation · 未来：链上声望

In v3, reputation will be represented as **soulbound NFTs** on-chain:

- Non-transferable (tied to your address)
- Automatically issued when quests are marked complete
- Verifiable by any platform, not just GitHub
- Portable across guilds and platforms

This GitHub-based system is the prototype that proves the model works before we build the on-chain version.
