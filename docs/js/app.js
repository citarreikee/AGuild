/**
 * Adventurer's Guild — Quest Board UI
 */
const App = (() => {
  let allQuests = [];
  let activeFilters = { type: null, rank: null, difficulty: null, status: null };
  let sortBy = 'newest';

  // ---- DOM refs ----

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ---- Init ----

  async function init() {
    renderLoading();
    try {
      const issues = await GuildAPI.fetchIssues();
      allQuests = issues.map(GuildAPI.normalizeIssue);
      render();
      bindFilters();
    } catch (err) {
      console.error('Failed to load quests:', err);
      showError('Failed to load quest board. GitHub API may be rate-limited. Try again in a minute.');
    }
  }

  // ---- Filter & Sort ----

  function getFiltered() {
    let quests = [...allQuests];

    if (activeFilters.type) {
      quests = quests.filter(q => q.type === activeFilters.type);
    }
    if (activeFilters.rank) {
      quests = quests.filter(q => q.rank === activeFilters.rank);
    }
    if (activeFilters.difficulty) {
      quests = quests.filter(q => q.difficulty === activeFilters.difficulty);
    }
    if (activeFilters.status) {
      quests = quests.filter(q => q.status === activeFilters.status);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        quests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        quests.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'reward-high':
        quests.sort((a, b) => b.reward - a.reward);
        break;
      case 'reward-low':
        quests.sort((a, b) => a.reward - b.reward);
        break;
    }

    return quests;
  }

  // ---- Filters binding ----

  function bindFilters() {
    // Generic: all filter buttons use data-filter + data-value attributes
    $$('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const group = btn.dataset.filter;
        const value = btn.dataset.value || null;
        setFilter(group, value);
      });
    });

    $('#sort-select')?.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderQuestBoard();
    });
  }

  function setFilter(group, value) {
    activeFilters[group] = value;
    // Update active button states
    const groupEls = document.querySelectorAll(`[data-filter="${group}"]`);
    groupEls.forEach(el => {
      el.classList.toggle('active', el.dataset.value === (value || ''));
    });
    renderQuestBoard();
  }

  // ---- Render ----

  function render() {
    renderStats();
    renderQuestBoard();
    renderLeaderboard();
  }

  function renderLoading() {
    const board = $('#quest-board');
    if (board) {
      board.innerHTML = `
        <div class="loading">
          <div class="loading__spinner"></div>
          <p style="font-family:var(--font-display);color:var(--text-secondary);letter-spacing:0.05em;">
            Scrying the quest board...
          </p>
        </div>`;
    }
  }

  function renderStats() {
    const openCount = allQuests.filter(q => q.status === 'open').length;
    const claimedCount = allQuests.filter(q => q.status === 'claimed' || q.status === 'review').length;
    const completedCount = allQuests.filter(q => q.status === 'completed').length;
    const adventurers = new Set(allQuests.filter(q => q.assignee).map(q => q.assignee.login)).size;

    const el = $('#stats-bar');
    if (!el) return;
    el.innerHTML = `
      <div class="stat-item">📜 <span class="stat-value">${openCount}</span> Open Quests</div>
      <div class="stat-item">⚔️ <span class="stat-value">${claimedCount}</span> In Progress</div>
      <div class="stat-item">✅ <span class="stat-value">${completedCount}</span> Completed</div>
      <div class="stat-item">🏰 <span class="stat-value">${adventurers}</span> Adventurers</div>
    `;
  }

  function renderQuestBoard() {
    const quests = getFiltered();
    const board = $('#quest-board');
    if (!board) return;

    if (!quests.length) {
      board.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">📜</div>
          <p class="empty-state__text">No quests match your filters, adventurer.</p>
          <p style="color:var(--text-muted);margin-top:0.5rem;">Try different criteria or check back later.</p>
        </div>`;
      return;
    }

    board.innerHTML = quests.map(q => questCardHTML(q)).join('');

    // Bind card clicks
    board.querySelectorAll('.quest-card').forEach(card => {
      card.addEventListener('click', () => showQuestDetail(card.dataset.questId));
    });
  }

  function questCardHTML(q) {
    const statusClass = `status-${q.status}`;
    const statusText = {
      open: 'Open', claimed: 'Claimed', review: 'In Review',
      completed: 'Completed', expired: 'Expired',
    }[q.status] || 'Open';

    const typeIcon = q.type.split(' ')[0] || '📜';
    const rewardDisplay = q.reward ? `$${q.reward.toLocaleString()}` : 'Pro Bono';

    const dateStr = q.created_at ? new Date(q.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '';
    const shortenedRank = q.rank.replace('💰 ','').replace(' Quest','');

    return `
      <div class="quest-card" data-quest-id="${q.id}">
        <div class="quest-card__header">
          <span class="quest-card__type">${typeIcon}</span>
          <span class="quest-card__status ${statusClass}">${statusText}</span>
        </div>
        <div class="quest-card__title">${escapeHTML(q.title)}</div>
        <div class="quest-card__meta">
          <span class="quest-card__reward">💰 ${rewardDisplay}</span>
          ${q.difficulty ? `<span class="quest-card__difficulty">${q.difficulty}</span>` : ''}
        </div>
        <div class="quest-card__labels">
          ${q.rank ? `<span class="quest-card__label rank-label">${shortenedRank}</span>` : ''}
          ${q.type ? `<span class="quest-card__label">${q.type}</span>` : ''}
        </div>
        <div class="quest-card__footer">
          <span class="quest-card__number">#${q.id}</span>
          <span class="quest-card__date">${dateStr}</span>
        </div>
      </div>`;
  }

  function renderLeaderboard() {
    const lb = GuildAPI.buildLeaderboard(allQuests);
    const container = $('#leaderboard');
    if (!container) return;

    if (!lb.length) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No completed quests yet. Be the first adventurer!</p>';
      return;
    }

    container.innerHTML = lb.map((a, i) => {
      const topClass = i < 3 ? ` top-${i+1}` : '';
      const rankIcon = i === 0 ? '👑' : i === 1 ? '⚔️' : i === 2 ? '🛡️' : `#${i+1}`;
      return `
        <div class="leaderboard-card">
          <span class="leaderboard-card__rank${topClass}">${rankIcon}</span>
          <img class="leaderboard-card__avatar" src="${a.avatar}&s=80" alt="${a.login}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><rect fill=%22%23333%22 width=%2240%22 height=%2240%22/><text x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2216%22>?</text></svg>'">
          <span class="leaderboard-card__name">${a.login}</span>
          <span class="leaderboard-card__quests">${a.completed} quest${a.completed !== 1 ? 's' : ''} · $${a.totalReward.toLocaleString()}</span>
        </div>`;
    }).join('');
  }

  // ---- Quest Detail Modal ----

  function showQuestDetail(id) {
    const q = allQuests.find(q => q.id === Number(id));
    if (!q) return;

    const statusText = {
      open: 'Open', claimed: 'Claimed', review: 'In Review',
      completed: 'Completed', expired: 'Expired',
    }[q.status] || 'Open';

    const typeIcon = q.type.split(' ')[0] || '📜';
    const rewardDisplay = q.reward ? `$${q.reward.toLocaleString()}` : 'Pro Bono';

    // Render body as markdown-ish
    let bodyHTML = q.body
      .replace(/###\s*(.*?)\s*·.*\n/g, '<h2>$1</h2>')
      .replace(/###\s*(.*?)\n/g, '<h2>$1</h2>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    bodyHTML = '<p>' + bodyHTML + '</p>';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <div>
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
              <span style="font-size:1.5rem;">${typeIcon}</span>
              <span class="quest-card__status status-${q.status}" style="font-size:0.7rem;">${statusText}</span>
            </div>
            <div class="modal__title">${escapeHTML(q.title)}</div>
            <div style="display:flex;gap:1rem;margin-top:0.5rem;font-size:0.9rem;">
              <span style="color:var(--gold-bright);font-family:var(--font-display);font-weight:700;">💰 ${rewardDisplay}</span>
              ${q.difficulty ? `<span>${q.difficulty}</span>` : ''}
              ${q.rank ? `<span class="quest-card__label rank-label">${q.rank.replace('💰 ','').replace(' Quest','')}</span>` : ''}
            </div>
          </div>
          <button class="modal__close">&times;</button>
        </div>
        <div class="modal__body">
          ${q.body ? `<div style="white-space:pre-wrap;">${escapeHTML(q.body)}</div>` : '<p style="color:var(--text-muted);">No details provided.</p>'}
        </div>
        <div class="modal__actions">
          <a href="${q.url}" target="_blank" rel="noopener" class="btn btn-primary">⚔️ View on GitHub</a>
          ${q.status === 'open' ? `<a href="${q.url}" target="_blank" rel="noopener" class="btn btn-secondary">📋 Claim Quest</a>` : ''}
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('.modal__close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
    });
  }

  function showError(msg) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---- Public ----

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
