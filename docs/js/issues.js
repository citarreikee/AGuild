const GuildAPI = (() => {
  const OWNER = 'citarreikee';
  const REPO = 'AGuild';
  const BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;
  const ISSUES_URL = `${BASE}/issues`;
  const CACHE_KEY = 'guild_cache_v3';
  const CACHE_TTL = 5 * 60 * 1000;

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
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data })); }
    catch {}
  }

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

    const [active, closed] = await Promise.all([
      fetchAllPages(`${ISSUES_URL}?state=open&`),
      fetchAllPages(`${ISSUES_URL}?state=closed&`),
    ]);

    const guildLabels = ['🟢 Open','🟡 Claimed','✅ Completed'];
    const all = [...active, ...closed].filter(i => {
      if (i.pull_request) return false;
      const names = (i.labels || []).map(l => l.name);
      if (i.state === 'open') return names.some(n => guildLabels.includes(n));
      return names.includes('✅ Completed');
    });

    setCache(all);
    return all;
  }

  function parseQuestBody(body) {
    if (!body) return {};
    const meta = {};
    const rewardMatch = body.match(/Reward.*?(\d[\d,]*)/i);
    if (rewardMatch) meta.reward = parseInt(rewardMatch[1].replace(/,/g, ''));
    return meta;
  }

  function normalizeIssue(issue) {
    const labels = (issue.labels || []).map(l => l.name);
    const meta = parseQuestBody(issue.body);

    let status = 'open';
    if (labels.includes('🟡 Claimed')) status = 'claimed';
    else if (labels.includes('✅ Completed')) status = 'completed';

    return {
      id: issue.number,
      title: issue.title.replace(/^\[QUEST\]\s*/i, ''),
      url: issue.html_url,
      state: issue.state,
      status,
      reward: meta.reward || 0,
      body: issue.body || '',
      assignee: issue.assignee ? { login: issue.assignee.login, avatar: issue.assignee.avatar_url } : null,
      user: issue.user ? { login: issue.user.login, avatar: issue.user.avatar_url } : null,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  }

  async function fetchComments(issueNumber) {
    const res = await fetch(`${ISSUES_URL}/${issueNumber}/comments?per_page=50`);
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return await res.json();
  }

  return { fetchIssues, fetchComments, normalizeIssue, REPO_OWNER: OWNER, REPO_NAME: REPO };
})();
