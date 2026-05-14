const App = (() => {
  let allQuests = [];
  const $ = sel => document.querySelector(sel);

  async function init() {
    try {
      const issues = await GuildAPI.fetchIssues();
      allQuests = issues.map(GuildAPI.normalizeIssue);
      renderQuestBoard();
    } catch (err) {
      console.error('[Guild]', err);
      const board = $('#quest-board');
      if (board) {
        board.innerHTML = `<div class="empty-state">
          <div class="empty-state__icon">🕯️</div>
          <p class="empty-state__text">The board is quiet tonight</p>
          <p style="color:var(--ink-light);margin-top:0.5rem;font-size:0.85rem;">${escapeHTML(err.message)}</p>
        </div>`;
      }
    }
  }

  function renderQuestBoard() {
    const board = $('#quest-board');
    if (!board) return;

    if (!allQuests.length) {
      board.innerHTML = `<div class="empty-state">
        <div class="empty-state__icon">📜</div>
        <p class="empty-state__text">The board is empty</p>
        <p style="color:var(--ink-light);margin-top:0.5rem;font-size:0.85rem;">Post the first quest, adventurer.</p>
      </div>`;
      return;
    }

    board.innerHTML = allQuests.map(q => questCardHTML(q)).join('');

    board.querySelectorAll('.quest-card').forEach(card => {
      card.addEventListener('click', () => showQuestDetail(card.dataset.questId));
    });
  }

  function questCardHTML(q) {
    const sc = `status-${q.status}`;
    const st = { open:'Open', claimed:'Claimed', completed:'Completed' }[q.status] || 'Open';
    const reward = q.reward ? `$${q.reward.toLocaleString()}` : '—';
    const date = q.created_at ? new Date(q.created_at).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '';

    return `<div class="quest-card" data-quest-id="${q.id}">
      <div class="quest-card__header">
        <span class="quest-card__status ${sc}">${st}</span>
      </div>
      <div class="quest-card__title">${escapeHTML(q.title)}</div>
      <div class="quest-card__meta">
        <span class="quest-card__reward">💰 ${reward}</span>
      </div>
      <div class="quest-card__footer">
        <span class="quest-card__number">#${q.id}</span>
        <span class="quest-card__date">${date}</span>
      </div>
    </div>`;
  }

  function showQuestDetail(id) {
    const q = allQuests.find(q => q.id === Number(id));
    if (!q) return;
    const st = { open:'Open', claimed:'Claimed', completed:'Completed' }[q.status] || 'Open';
    const reward = q.reward ? `$${q.reward.toLocaleString()}` : '—';

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal">
      <div class="modal__header">
        <div>
          <span class="quest-card__status status-${q.status}">${st}</span>
          <div class="modal__title" style="margin-top:0.5rem;">${escapeHTML(q.title)}</div>
          <div style="margin-top:0.25rem;font-size:1rem;color:var(--wax-red);font-family:var(--font-display);">💰 ${reward}</div>
        </div>
        <button class="modal__close">&times;</button>
      </div>
      <div class="modal__body">${q.body ? escapeHTML(q.body) : '<p style="color:var(--ink-light);">No details inscribed.</p>'}</div>
      <div class="modal__actions">
        <a href="${q.url}" target="_blank" rel="noopener" class="btn btn-primary">View on GitHub</a>
        ${q.status === 'open' ? `<a href="${q.url}" target="_blank" rel="noopener" class="btn btn-secondary">Claim Quest</a>` : ''}
      </div>
    </div>`;
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('.modal__close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
  }

  function escapeHTML(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
