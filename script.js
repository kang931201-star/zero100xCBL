/* =========================================================
   데이터 — 여기만 수정하면 리더보드가 바뀝니다.
   status: 'ended'(종료) | 'active'(진행중) | 'upcoming'(예정)
   move: 양수=상승, 음수=하락, 0=변동없음
   ========================================================= */
const SEASONS = [
  { id:3, name:'시즌3', range:'2026.07.15~09.08', status:'ended' },
  { id:4, name:'시즌4', range:'2026.09.08~11.08', status:'active' },
  { id:5, name:'시즌5', range:'2026.08.01~09.30', status:'upcoming' },
  { id:6, name:'시즌6', range:'2026.10.01~11.30', status:'upcoming' },
];

const DATA = {
  4: [
    { rank:1,  name:'제로백 부평역점',      loc:'인천 부평구', people:17, kills:6420, move:1 },
    { rank:2,  name:'제로백 강남본점',      loc:'서울 강남구', people:6,  kills:6180, move:2 },
    { rank:3,  name:'제로백 서면점',        loc:'부산 부산진구', people:4, kills:5510, move:3 },
    { rank:4,  name:'제로백 수원인계점',    loc:'경기 수원시', people:3,  kills:5090, move:-1 },
    { rank:5,  name:'제로백 광주충장로점',  loc:'광주 동구',   people:25, kills:4730, move:0 },
    { rank:6,  name:'제로백 천안불당점',    loc:'충남 천안시', people:6,  kills:3980, move:2 },
    { rank:7,  name:'제로백 동성로점',      loc:'대구 중구',   people:6,  kills:3540, move:-3 },
    { rank:8,  name:'제로백 대전둔산점',    loc:'대전 서구',   people:5,  kills:3120, move:1 },
    { rank:9,  name:'제로백 일산라페스타점', loc:'경기 고양시', people:9,  kills:2870, move:-1 },
    { rank:10, name:'제로백 청주성안길점',  loc:'충북 청주시', people:4,  kills:2450, move:2 },
  ],
  3: [
    { rank:1,  name:'제로백 강남본점',      loc:'서울 강남구', people:8,  kills:7010, move:0 },
    { rank:2,  name:'제로백 부평역점',      loc:'인천 부평구', people:15, kills:6890, move:2 },
    { rank:3,  name:'제로백 수원인계점',    loc:'경기 수원시', people:5,  kills:6120, move:1 },
    { rank:4,  name:'제로백 서면점',        loc:'부산 부산진구', people:4, kills:5330, move:-1 },
    { rank:5,  name:'제로백 동성로점',      loc:'대구 중구',   people:7,  kills:4980, move:3 },
    { rank:6,  name:'제로백 광주충장로점',  loc:'광주 동구',   people:22, kills:4210, move:-2 },
    { rank:7,  name:'제로백 천안불당점',    loc:'충남 천안시', people:6,  kills:3600, move:1 },
    { rank:8,  name:'제로백 일산라페스타점', loc:'경기 고양시', people:9,  kills:3180, move:-2 },
    { rank:9,  name:'제로백 대전둔산점',    loc:'대전 서구',   people:5,  kills:2900, move:1 },
    { rank:10, name:'제로백 청주성안길점',  loc:'충북 청주시', people:4,  kills:2540, move:0 },
  ],
  5: [],
  6: [],
};

const TERMS = [
  '본 이벤트는 피카플레이 가맹 제로백 매장 대상으로 진행됩니다.',
  '본 이벤트 순위는 이벤트 페이지에 반영된 점수만을 기준으로 산정됩니다.',
  '이벤트 진행 기간 동안 본 페이지를 통해 매장의 누적 랭킹을 확인할 수 있으며, 누적 점수는 60분 단위로 갱신됩니다.',
  '랭킹 집계에 사용되는 점수는 랭킹전 기록에 유저 수가 가중치 합산되어 부여됩니다.',
  '점수가 동일할 경우 점수를 우선 달성한 매장이 상위 순위로 노출됩니다.',
  '이벤트 경품은 CBL: PUBG 랭킹전 시즌별로 지급됩니다.',
  '부정한 방법으로 이벤트에 참여한 경우 해당 매장은 경품 지급 대상에서 제외될 수 있습니다.',
  '경품 금액이 5만원을 초과하는 경우 제세공과금(22%)은 미디어웹이 부담하며, 제세공과금 신고를 위한 신분증 사본 제출이 필요합니다.',
  '개인정보 작성 오류 등으로 인한 경품 오발송·타인의 사용은 당사에서 책임지지 않습니다.',
  '경품 당첨자는 휴대폰번호로 개별 연락 예정이며, 3회 이상 연락이 되지 않을 경우 경품 지급이 취소될 수 있습니다.',
  '본 이벤트에 관한 문의사항은 피카플레이 또는 크래프트박스 1:1 문의를 통해 부탁드립니다.',
];

/* ---------- 상태 ---------- */
let currentSeason = 4;   // 기본 표시 시즌
let query = '';

const fmt = n => n.toLocaleString('en-US');
const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* ---------- 시즌 탭 ---------- */
function renderTabs() {
  document.getElementById('tabs').innerHTML = SEASONS.map(s => {
    const active = s.id === currentSeason;
    const cls = 'tab' + (active ? ' active' : '') + (s.status === 'upcoming' ? ' upcoming' : '');
    const onclick = s.status === 'upcoming' ? '' : `onclick="selectSeason(${s.id})"`;
    return `<button class="${cls}" ${onclick}><span class="nm">${s.name}</span><span class="rg">${s.range}</span></button>`;
  }).join('');
}

function selectSeason(id) {
  currentSeason = id;
  query = '';
  document.getElementById('search').value = '';
  renderTabs();
  renderBoard();
}

/* ---------- 리더보드 ---------- */
function moveHtml(move) {
  if (move > 0)  return `<div class="row__move up"><span>▲</span><span>${move}</span></div>`;
  if (move < 0)  return `<div class="row__move down"><span>▼</span><span>${-move}</span></div>`;
  return `<div class="row__move same"><span>–</span><span></span></div>`;
}

function rankHtml(rank) {
  if (rank <= 3) return `<div class="row__rank b${rank}">${rank}</div>`;
  return `<div class="row__rank">${rank}</div>`;
}

function renderBoard() {
  const season = SEASONS.find(s => s.id === currentSeason);
  document.getElementById('board-title').textContent = 'CBL: PUBG ' + season.name;

  const rowsEl = document.getElementById('rows');
  const all = DATA[currentSeason] || [];

  if (season.status === 'upcoming') {
    rowsEl.innerHTML = `<div class="board__empty"><span class="ic">🔒</span><span style="font-size:16px;color:var(--mut);">${season.name} 오픈 예정입니다</span></div>`;
    return;
  }

  const q = query.trim();
  const rows = q ? all.filter(r => r.name.includes(q)) : all;

  if (rows.length === 0) {
    rowsEl.innerHTML = `<div class="board__empty"><span class="ic">🔍</span><span style="font-size:16px;">검색 결과가 없습니다</span></div>`;
    return;
  }

  rowsEl.innerHTML = rows.map(r => {
    const top3 = r.rank <= 3 ? ' top3' : '';
    const crown = r.rank === 1 ? '<span class="crown">👑</span>' : '';
    const killsGold = r.rank === 1 ? ' gold' : '';
    return `
      <div class="row${top3}">
        ${rankHtml(r.rank)}
        <div class="row__store">
          <div class="nm"><b>${esc(r.name)}</b>${crown}</div>
          <span class="loc">${esc(r.loc)}</span>
        </div>
        <div class="row__people">${r.people}</div>
        <div class="row__kills${killsGold}">${fmt(r.kills)}</div>
        ${moveHtml(r.move)}
      </div>`;
  }).join('');
}

function onSearch(val) {
  query = val;
  renderBoard();
}

/* ---------- 유의사항 ---------- */
function renderTerms() {
  document.getElementById('terms').innerHTML = TERMS.map(t =>
    `<li><span class="b">·</span><span>${esc(t)}</span></li>`
  ).join('');
}

/* ---------- 히어로 불꽃 파티클 ---------- */
function renderEmbers() {
  const host = document.getElementById('embers');
  let html = '';
  for (let i = 0; i < 34; i++) {
    const left = Math.random() * 100;
    const dur = 6 + Math.random() * 9;
    const delay = Math.random() * 12;
    const size = 2 + Math.random() * 3.5;
    const op = 0.35 + Math.random() * 0.5;
    html += `<span class="ember" style="left:${left}%;width:${size}px;height:${size}px;opacity:${op};animation:floatEmber ${dur}s linear ${delay}s infinite;"></span>`;
  }
  host.innerHTML = html;
}

/* ---------- CTA 스크롤 ---------- */
function scrollToBoard() {
  const el = document.getElementById('board');
  const y = el.getBoundingClientRect().top + window.scrollY - 30;
  window.scrollTo({ top:y, behavior:'smooth' });
}

/* ---------- 초기화 ---------- */
renderTabs();
renderBoard();
renderTerms();
renderEmbers();
