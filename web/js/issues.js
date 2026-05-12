/**
 * GitHub Issues API wrapper for the Adventurer's Guild quest board.
 * No auth needed — public repo read-only access.
 */
const GuildAPI = (() => {
  const OWNER = 'citarreikee';
  const REPO = 'AGuild';
  const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
  const ISSUES_URL = `${BASE}/issues`;
  const CACHE_KEY = 'guild_quest_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // ---- Cache ----

  function getCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) return null;
      return data;
    } catch { return null; }
  }

  function setCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch { /* localStorage full — ignore */ }
  }

  // ---- Fetch ----

  async function fetchAllPages(url) {
    let results = [];
    let page = 1;
    while (true) {
      const res = await fetch(`${url}&page=${page}&per_page=100`);
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
      const data = await res.json();
      if (!data.length) break;
      results = results.concat(data);
      if (data.length < 100) break;
      page++;
    }
    return results;
  }

  async function fetchIssues() {
    const cached = getCache();
    if (cached) return cached;

    // Fetch quests in parallel: open + claimed/review + recently completed
    const [active, completed] = await Promise.all([
      fetchAllPages(`${ISSUES_URL}?state=open&labels=📋 Open,⚡ Claimed,🔍 Review&`),
      fetchAllPages(`${ISSUES_URL}?state=closed&labels=✅ Completed&`),
    ]);

    // Remove pull requests (GitHub Issues API includes PRs)
    const all = [...active, ...completed].filter(i => !i.pull_request);
    setCache(all);
    return all;
  }

  // ---- Parse quest metadata from issue body ----

  function parseQuestBody(body) {
    if (!body) return {};
    const meta = {};

    // Extract quest type
    const typeMatch = body.match(/Quest Type.*?([⚔️🎨📜🔮🧪🛡️🎵]\s*(?:Code|Design|Writing|AI\/ML|Data|Strategy|Media))/);
    if (typeMatch) meta.type = typeMatch[1].trim();

    // Extract reward
    const rewardMatch = body.match(/Reward.*?(\d[\d,]*)/);
    if (rewardMatch) meta.reward = parseInt(rewardMatch[1].replace(/,/g, ''));

    // Extract difficulty
    const diffMatch = body.match(/Difficulty.*?(⭐+\s*\w+)/);
    if (diffMatch) meta.difficulty = diffMatch[1].trim();

    // Extract deadline
    const deadlineMatch = body.match(/Deadline.*?(\d{4}-\d{2}-\d{2})/);
    if (deadlineMatch) meta.deadline = deadlineMatch[1];

    // Extract deliverables section
    const delivMatch = body.match(/###\s*📦\s*Deliverables[\s\S]*?(?=###|$)/);
    if (delivMatch) meta.deliverables = delivMatch[0].replace(/###\s*📦\s*Deliverables[^\n]*\n*/, '').trim();

    return meta;
  }

  // ---- Normalize issues into quest objects ----

  function normalizeIssue(issue) {
    const labels = (issue.labels || []).map(l => l.name);
    const meta = parseQuestBody(issue.body);

    // Determine status from labels
    let status = 'open';
    if (labels.includes('⚡ Claimed')) status = 'claimed';
    else if (labels.includes('🔍 Review')) status = 'review';
    else if (labels.includes('✅ Completed')) status = 'completed';
    else if (labels.includes('❌ Expired')) status = 'expired';

    // Find rank label
    const rankLabel = labels.find(l => l.startsWith('💰'));
    // Find type label
    const typeLabels = ['⚔️ Code','🎨 Design','📜 Writing','🔮 AI/ML','🧪 Data','🛡️ Strategy','🎵 Media'];
    const typeLabel = labels.find(l => typeLabels.includes(l)) || meta.type;
    // Difficulty label
    const diffLabels = labels.filter(l => l.startsWith('⭐'));
    const difficulty = diffLabels.length > 0 ? diffLabels[0] : (meta.difficulty || '');

    return {
      id: issue.number,
      title: issue.title.replace(/^\[QUEST\]\s*/i, ''),
      url: issue.html_url,
      state: issue.state,
      status,
      type: typeLabel || 'Unknown',
      rank: rankLabel || '',
      reward: meta.reward || 0,
      difficulty,
      deadline: meta.deadline || '',
      body: issue.body || '',
      deliverables: meta.deliverables || '',
      labels,
      assignee: issue.assignee ? {
        login: issue.assignee.login,
        avatar: issue.assignee.avatar_url,
      } : null,
      user: issue.user ? {
        login: issue.user.login,
        avatar: issue.user.avatar_url,
      } : null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      closed_at: issue.closed_at,
      comments: issue.comments,
    };
  }

  // ---- Leaderboard ----

  function buildLeaderboard(quests) {
    const adventurerMap = new Map();

    for (const q of quests) {
      if (q.status !== 'completed') continue;
      const login = q.assignee ? q.assignee.login : (q.user ? q.user.login : null);
      if (!login) continue;

      if (!adventurerMap.has(login)) {
        adventurerMap.set(login, {
          login,
          avatar: q.assignee ? q.assignee.avatar : q.user.avatar,
          completed: 0,
          totalReward: 0,
        });
      }

      const a = adventurerMap.get(login);
      a.completed++;
      a.totalReward += q.reward || 0;
    }

    return [...adventurerMap.values()]
      .sort((a, b) => b.completed - a.completed || b.totalReward - a.totalReward)
      .slice(0, 20);
  }

  // ---- Public API ----

  return {
    fetchIssues,
    normalizeIssue,
    buildLeaderboard,
    REPO_OWNER: OWNER,
    REPO_NAME: REPO,
  };
})();
