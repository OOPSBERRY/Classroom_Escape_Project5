'use strict';

/* ══════════════════════════════════════════════════════
   교실 탈출 프로젝트 — 여름 방학 이야기
   script.js

   ★ 이미지 교체 방법:
     1) type: 'placeholder'  →  type: 'image'
     2) src 필드에 base64 데이터 추가
        예) src: `data:image/png;base64,iVBOR...`
     3) answer 필드에 실제 정답 입력

   ★ 텍스트/SVG 문제:
     1) type: 'placeholder'  →  type: 'text'
     2) content 필드에 HTML/SVG 직접 작성
     3) answer 필드에 실제 정답 입력

   ★ note(힌트 박스) 사용법:
     note: '힌트 내용'  →  문제 위에 하이라이트 박스로 표시
     힌트 없으면 note: ''  또는 note 필드 삭제
   ══════════════════════════════════════════════════════ */

/* ── 문제 데이터 ─────────────────────────────────── */
const problems = [
  {
    id: 1,
    title: '1번 문제',
    answer: '못',
    type: 'text',
    content: `<p>못 사온다고 해놓고<br>사온 것은?</p>`,
    note: '',
  },
  {
    id: 2,
    title: '2번 문제',
    answer: '나무',
    type: 'text',
    content: `<p>무가 자기소개를 할 때<br>하는 말은?</p>`,
    note: '',
  },
  {
    id: 3,
    title: '3번 문제',
    answer: '멈춤',
    type: 'text',
    content: `<p>운전하는 사람들이<br>가장 싫어하는 춤은?</p>`,
    note: '',
  },
  {
    id: 4,
    title: '4번 문제',
    answer: '머리가좀비어서',
    type: 'text',
    content: `<p>좀비는 왜<br>멍청할까?</p>`,
    note: '',
  },
  {
    id: 5,
    title: '5번 문제',
    answer: '동서남북',
    type: 'text',
    content: `<p>북 중에서<br>가장 큰 북은?</p>`,
    note: '',
  },
  {
    id: 6,
    title: '6번 문제',
    answer: '이름',
    type: 'text',
    content: `<p>내건데 다른 사람이<br>더 많이 쓰는 것은?</p>`,
    note: '',
  },
  {
    id: 7,
    title: '7번 문제',
    answer: '62',
    type: 'text',
    content: `
      <p style="margin-bottom:20px;">네모 안에 들어갈 숫자는?</p>
      <div class="num-chips">
        <div class="num-chip">33</div>
        <div class="num-chip">36</div>
        <div class="num-chip">42</div>
        <div class="num-chip">44</div>
        <div class="num-chip">48</div>
        <div class="num-chip">56</div>
        <div class="num-chip q">?</div>
      </div>`,
    note: '',
  },
  {
    id: 8,
    title: '8번 문제',
    answer: '방학',
    type: 'text',
    content: `<p>초등학생들이<br>가장 좋아하는 새는?</p>`,
    note: '',
  },
];

/* ── 상수 ─────────────────────────────────────────── */
const TOTAL     = problems.length;
const MAX_LIVES = 15;

/* ── 상태 ─────────────────────────────────────────── */
let cur   = 0;
let lives = MAX_LIVES;

/* ── DOM 참조 ─────────────────────────────────────── */
const $ = id => document.getElementById(id);

const startPanel    = $('startPanel');
const gamePanel     = $('gamePanel');
const startBtn      = $('startBtn');
const resetTopBtn   = $('resetTop');
const qrBtn         = $('qrBtn');
const qrOverlay     = $('qrOverlay');
const qrCloseBtn    = $('qrCloseBtn');
const answerInput   = $('answerInput');
const submitBtn     = $('submitBtn');
const feedbackEl    = $('feedback');
const progressEl    = $('progress');
const lifeText      = $('lifeText');
const heartsEl      = $('hearts');
const problemTitle  = $('problemTitle');
const problemNote   = $('problemNote');
const problemMedia  = $('problemMedia');
const problemNo     = $('problemNo');
const successOverlay= $('successOverlay');

const intro1Panel     = $('intro1Panel');
const intro1NextBtn   = $('intro1NextBtn');
const intro2Panel     = $('intro2Panel');
const dialogueText    = $('introDialogueText');
const dialogCursor    = $('dialogueCursor');
const dialogueDots    = $('dialogueDots');
const introNextBtn    = $('introNextBtn');
const silhouetteWrap  = $('silhouetteWrap');

const endingOverlay     = $('endingOverlay');
const endingTextEl      = $('endingText');
const endingCursorEl    = $('endingCursor');
const endingDotsEl      = $('endingDots');
const endingNextBtn     = $('endingNextBtn');
const endingDialogueBox = $('endingDialogueBox');

/* ── 인트로 대화 ──────────────────────────────────── */
const DIALOGUES = [
  '드디어 기다리고 기다리던 여름방학이 찾아왔다!',
  '그런데 교실 게시판에 낯선 쪽지 8장이 붙어 있었다...',
  '쪽지에는 알쏭달쏭한 문제들이 적혀 있었다.',
  '이 문제를 모두 풀어야만 진짜 방학이 시작된다는 소문이 있다.',
  '자, 이제 신나는 여름방학 탈출을 시작해보자!',
];

/* ── 엔딩 대화 (카피바라 대사) ──────────────────── */
const ENDING_PHASE1_TEXT = '모든 문제를 풀어냈다! 그때, 파라솔 그늘 아래서 부스럭거리는 소리가 들렸다...';
const ENDING_DIALOGUES = [
  '얘들아, 방학 탈출 미션 완료를 축하한다바라!',
  '이 여름, 나처럼 신나게 놀아야 한다바라~',
  '물놀이할 땐 안전 수칙 꼭 지켜야 한다바라',
  '맛있는 거 많이 먹고 푹 쉬는 것도 잊지 말라바라',
  '그럼 모두 행복한 여름방학 보내길 바란다바라, 뿅~',
];

/* ══════════════════════════════════════════════════════
   인트로 1 — 타이틀 화면
   ══════════════════════════════════════════════════════ */
$('intro1QrBtn').addEventListener('click', () => qrOverlay.classList.add('show'));

intro1NextBtn.addEventListener('click', () => {
  intro1Panel.classList.remove('active');
  intro2Panel.classList.add('active');
  runDialogue(0);
});

/* ══════════════════════════════════════════════════════
   인트로 2 — 해변 장면 + 타이핑 대화
   ══════════════════════════════════════════════════════ */
let dlgIdx    = 0;
let typeTimer = null;

function runDialogue(idx) {
  dlgIdx = idx;
  syncDots(idx);

  /* ── 실루엣: 2번째 대사(idx=1)에서 등장, 다른 대사에서 퇴장 ── */
  if (idx === 1) {
    silhouetteWrap.classList.remove('sil-hide');
    void silhouetteWrap.offsetWidth;
    silhouetteWrap.classList.add('sil-show');
  } else if (silhouetteWrap.classList.contains('sil-show')) {
    silhouetteWrap.classList.remove('sil-show');
    silhouetteWrap.classList.add('sil-hide');
  }

  typeWriter(DIALOGUES[idx]);
}

function typeWriter(text) {
  dialogueText.textContent = '';
  dialogCursor.classList.remove('hidden');
  introNextBtn.style.display = 'none';
  let i = 0;
  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    dialogueText.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(typeTimer);
      dialogCursor.classList.add('hidden');
      const isLast = (dlgIdx === DIALOGUES.length - 1);
      introNextBtn.textContent   = isLast ? '방학 시작 ▶' : '다음 ▶';
      introNextBtn.style.display = 'inline-block';
    }
  }, 50);
}

function syncDots(idx) {
  dialogueDots.querySelectorAll('span').forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
}

introNextBtn.addEventListener('click', () => {
  clearInterval(typeTimer);
  if (dlgIdx < DIALOGUES.length - 1) {
    runDialogue(dlgIdx + 1);
  } else {
    intro2Panel.classList.remove('active');
    startPanel.classList.add('active');
  }
});

/* ══════════════════════════════════════════════════════
   시작 패널
   ══════════════════════════════════════════════════════ */
startBtn.addEventListener('click', () => {
  startPanel.classList.remove('active');
  gamePanel.classList.add('active');
  qrBtn.style.display = 'none';
  initGame();
});

resetTopBtn.addEventListener('click', () => {
  if (confirm('처음으로 돌아가시겠습니까?')) location.reload();
});

qrBtn.addEventListener('click',      () => qrOverlay.classList.add('show'));
qrCloseBtn.addEventListener('click', () => qrOverlay.classList.remove('show'));
qrOverlay.addEventListener('click',  e => { if (e.target === qrOverlay) qrOverlay.classList.remove('show'); });

/* ══════════════════════════════════════════════════════
   게임 로직
   ══════════════════════════════════════════════════════ */
function initGame() {
  cur   = 0;
  lives = MAX_LIVES;
  renderHearts();
  loadProblem();
}

/* 하트 렌더링 */
function renderHearts() {
  heartsEl.innerHTML = '';
  for (let i = 0; i < MAX_LIVES; i++) {
    const span = document.createElement('span');
    span.className   = 'heart' + (i >= lives ? ' off' : '');
    span.textContent = '❤';
    heartsEl.appendChild(span);
  }
  lifeText.textContent = `정답 도전 횟수 ${lives} / ${MAX_LIVES}`;
}

/* 문제 불러오기 */
function loadProblem() {
  const p = problems[cur];

  progressEl.textContent   = `문제 ${cur + 1} / ${TOTAL}`;
  problemTitle.textContent = p.title;
  problemNo.textContent    = `문제 번호 ${p.id}`;
  answerInput.value        = '';
  clearFeedback();

  /* 노트(힌트 박스) */
  if (p.note) {
    problemNote.textContent   = p.note;
    problemNote.style.display = 'block';
  } else {
    problemNote.style.display = 'none';
  }

  /* 미디어 영역 */
  problemMedia.innerHTML = '';

  if (p.type === 'image') {
    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.title;
    problemMedia.appendChild(img);

  } else if (p.type === 'text') {
    const box = document.createElement('div');
    box.className = 'quiz-box';
    box.innerHTML = p.content;
    problemMedia.appendChild(box);

  } else {
    /* ── 이미지 준비 중 (placeholder) ── */
    const box = document.createElement('div');
    box.className = 'quiz-box';
    box.innerHTML = `
      <p style="color:var(--muted);">
        🖼&nbsp;이미지 준비 중<br>
        <span style="font-size:13px; opacity:0.55;">${p.title}</span>
      </p>`;
    problemMedia.appendChild(box);
  }

  answerInput.focus();
}

/* 정답 제출 */
function checkAnswer() {
  const val = answerInput.value.trim();
  if (!val) return;

  if (val === problems[cur].answer) {
    showFeedback('ok', '✅ 정답입니다! 다음 문제로 이동합니다...');
    setTimeout(() => {
      cur++;
      if (cur >= TOTAL) {
        showEnding();
      } else {
        loadProblem();
      }
    }, 1200);
  } else {
    lives--;
    renderHearts();
    if (lives <= 0) {
      showFeedback('reset', '❌ 도전 횟수를 모두 소진했습니다. 처음부터 다시 시작합니다...');
      setTimeout(() => location.reload(), 2000);
    } else {
      showFeedback('bad', `❌ 틀렸습니다. 남은 도전 횟수: ${lives}회`);
    }
  }
}

submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer(); });

/* 피드백 표시 */
function showFeedback(type, msg) {
  feedbackEl.className   = `feedback show ${type}`;
  feedbackEl.textContent = msg;
}
function clearFeedback() {
  feedbackEl.className   = 'feedback';
  feedbackEl.textContent = '';
}

/* ══════════════════════════════════════════════════════
   엔딩 시퀀스 — 해변 카피바라 공개
   ══════════════════════════════════════════════════════ */
let endingIdx      = 0;
let endingTimer    = null;
let endingRevealed = false;

function showEnding() {
  stopBGM();
  endingRevealed = false;
  endingOverlay.classList.add('show');

  /* 실루엣 보이기, 카피바라 숨기기 */
  const sil  = $('endingSilhouette');
  const capy = $('endingCapybara');
  sil.style.display = '';
  sil.classList.remove('sil-exit');
  capy.classList.remove('revealed');
  endingDialogueBox.classList.remove('capybara-speaking');

  /* 점 인디케이터 — 카피바라 대사 수만큼 */
  endingDotsEl.innerHTML = ENDING_DIALOGUES.map(() => '<span></span>').join('');

  /* 배지 초기화 */
  $('endingBadge').textContent = 'VACATION START';

  /* Phase 1: 나레이션 타이핑 */
  endingTextEl.textContent = '';
  endingCursorEl.classList.remove('hidden');
  endingNextBtn.style.display = 'none';
  let i = 0;
  clearInterval(endingTimer);
  endingTimer = setInterval(() => {
    endingTextEl.textContent += ENDING_PHASE1_TEXT[i++];
    if (i >= ENDING_PHASE1_TEXT.length) {
      clearInterval(endingTimer);
      endingCursorEl.classList.add('hidden');
      endingNextBtn.textContent   = '정체 공개 ▶';
      endingNextBtn.style.display = 'inline-block';
    }
  }, 55);
}

function revealCapybara() {
  const sil  = $('endingSilhouette');
  const capy = $('endingCapybara');

  endingNextBtn.style.display = 'none';
  endingTextEl.textContent    = '';
  endingCursorEl.classList.add('hidden');

  /* 실루엣 퇴장 */
  sil.classList.add('sil-exit');

  setTimeout(() => {
    sil.style.display = 'none';
    capy.classList.add('revealed');
    $('endingBadge').textContent = '🏖️ 여름 방학 메이트 : 카피바라';
    endingDialogueBox.classList.add('capybara-speaking');
  }, 460);

  /* 카피바라 대사 시작 */
  setTimeout(() => {
    runEndingDialogue(0);
  }, 1100);
}

function runEndingDialogue(idx) {
  endingIdx = idx;
  endingDotsEl.querySelectorAll('span').forEach((s, i) => {
    s.classList.toggle('active', i === idx);
  });
  endingTypeWriter(ENDING_DIALOGUES[idx]);
}

function endingTypeWriter(text) {
  endingTextEl.textContent = '';
  endingCursorEl.classList.remove('hidden');
  endingNextBtn.style.display = 'none';
  let i = 0;
  clearInterval(endingTimer);
  endingTimer = setInterval(() => {
    endingTextEl.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(endingTimer);
      endingCursorEl.classList.add('hidden');
      const isLast = (endingIdx === ENDING_DIALOGUES.length - 1);
      endingNextBtn.textContent   = isLast ? '✓ 완료' : '다음 ▶';
      endingNextBtn.style.display = 'inline-block';
    }
  }, 55);
}

endingNextBtn.addEventListener('click', () => {
  clearInterval(endingTimer);
  if (!endingRevealed) {
    endingRevealed = true;
    revealCapybara();
  } else if (endingIdx < ENDING_DIALOGUES.length - 1) {
    runEndingDialogue(endingIdx + 1);
  } else {
    endingOverlay.classList.remove('show');
    showSuccess();
  }
});

/* ══════════════════════════════════════════════════════
   성공 오버레이
   ══════════════════════════════════════════════════════ */
function showSuccess() {
  successOverlay.classList.add('show');
  launchFireworks();
}

/* ══════════════════════════════════════════════════════
   축하 효과 (컬러풀한 스파클 파티클)
   ══════════════════════════════════════════════════════ */
function launchFireworks() {
  const canvas = $('fireworks');
  const ctx    = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const COLORS    = ['#ffb703', '#ff6b5b', '#12a5d1', '#1f9e6d', '#ffffff', '#ffd97a'];
  const particles = [];

  function burst(x, y) {
    for (let i = 0; i < 45; i++) {
      const a = (Math.PI * 2 * i) / 45;
      const s = 1.5 + Math.random() * 3.5;
      particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        r: 1.5 + Math.random() * 2,
      });
    }
  }

  let frame = 0;
  (function tick() {
    ctx.fillStyle = 'rgba(10,60,70,0.14)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (frame % 32 === 0) {
      burst(
        canvas.width  * (0.15 + Math.random() * 0.7),
        canvas.height * (0.05 + Math.random() * 0.55),
      );
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.07;
      p.life -= 0.016;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    frame++;
    if (frame < 320) requestAnimationFrame(tick);
  })();
}

/* ══════════════════════════════════════════════════════
   BGM — Web Audio API
   파도 소리 + 갈매기 소리 (여름 바다 분위기)
   ══════════════════════════════════════════════════════ */
let bgmCtx      = null;
let bgmNodes    = [];
let bgmRunning  = false;
let gullTimerId = null;

function startBGM() {
  if (bgmRunning) return;
  bgmRunning = true;
  bgmCtx = new (window.AudioContext || window.webkitAudioContext)();

  /* ── 마스터 게인 ── */
  const master = bgmCtx.createGain();
  master.gain.setValueAtTime(0, bgmCtx.currentTime);
  master.gain.linearRampToValueAtTime(0.5, bgmCtx.currentTime + 2.5);
  master.connect(bgmCtx.destination);

  /* ── 파도 소리: 필터링된 화이트 노이즈 + 느린 스웰 ── */
  const noiseBuf = bgmCtx.createBuffer(1, bgmCtx.sampleRate * 2, bgmCtx.sampleRate);
  const noiseData = noiseBuf.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;

  const noiseSrc = bgmCtx.createBufferSource();
  noiseSrc.buffer = noiseBuf;
  noiseSrc.loop   = true;

  const waveFilter = bgmCtx.createBiquadFilter();
  waveFilter.type = 'lowpass';
  waveFilter.frequency.value = 700;
  waveFilter.Q.value = 0.7;

  const waveGain = bgmCtx.createGain();
  waveGain.gain.value = 0;

  /* 필터 컷오프를 흔들어 파도가 밀려왔다 빠지는 느낌 */
  const waveLFO = bgmCtx.createOscillator();
  waveLFO.type = 'sine';
  waveLFO.frequency.value = 0.11;
  const waveLFOGain = bgmCtx.createGain();
  waveLFOGain.gain.value = 420;
  waveLFO.connect(waveLFOGain);
  waveLFOGain.connect(waveFilter.frequency);
  waveLFO.start();

  /* 게인도 함께 스웰 (밀려왔다 빠지는 볼륨) */
  const swellLFO = bgmCtx.createOscillator();
  swellLFO.type = 'sine';
  swellLFO.frequency.value = 0.11;
  const swellLFOGain = bgmCtx.createGain();
  swellLFOGain.gain.value = 0.16;
  const swellBase = bgmCtx.createConstantSource();
  swellBase.offset.value = 0.2;
  swellLFO.connect(swellLFOGain);
  swellLFOGain.connect(waveGain.gain);
  swellBase.connect(waveGain.gain);
  swellLFO.start();
  swellBase.start();

  noiseSrc.connect(waveFilter);
  waveFilter.connect(waveGain);
  waveGain.connect(master);
  noiseSrc.start();

  bgmNodes.push(noiseSrc, waveFilter, waveGain, waveLFO, waveLFOGain, swellLFO, swellLFOGain, swellBase);

  /* ── 잔잔한 배경 드론 (밝은 하모니) ── */
  function makeDrone(freq, vol) {
    const osc = bgmCtx.createOscillator();
    const g   = bgmCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = vol;
    osc.connect(g); g.connect(master);
    osc.start();
    bgmNodes.push(osc, g);
  }
  makeDrone(196, 0.02);  // G3
  makeDrone(294, 0.015); // D4

  /* ── 갈매기 소리: 랜덤 간격으로 짧은 울음소리 ── */
  function playGull() {
    if (!bgmRunning) return;
    const now   = bgmCtx.currentTime;
    const calls = 1 + Math.floor(Math.random() * 2);

    for (let c = 0; c < calls; c++) {
      const start = now + c * 0.22;
      const osc  = bgmCtx.createOscillator();
      const gain = bgmCtx.createGain();
      osc.type = 'triangle';

      const peak = 1500 + Math.random() * 500;
      const dip  = 850  + Math.random() * 200;
      osc.frequency.setValueAtTime(peak * 0.6, start);
      osc.frequency.linearRampToValueAtTime(peak, start + 0.05);
      osc.frequency.linearRampToValueAtTime(dip, start + 0.22);
      osc.frequency.linearRampToValueAtTime(peak * 0.75, start + 0.3);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.11, start + 0.04);
      gain.gain.linearRampToValueAtTime(0.06, start + 0.18);
      gain.gain.linearRampToValueAtTime(0, start + 0.34);

      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + 0.4);
    }

    gullTimerId = setTimeout(playGull, 3500 + Math.random() * 5500);
  }
  gullTimerId = setTimeout(playGull, 2000 + Math.random() * 3000);
}

function stopBGM() {
  bgmRunning = false;
  if (gullTimerId) { clearTimeout(gullTimerId); gullTimerId = null; }
  bgmNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(_) {} });
  bgmNodes = [];
  if (bgmCtx) { bgmCtx.close(); bgmCtx = null; }
}

/* BGM은 첫 사용자 인터랙션 시 시작 */
document.addEventListener('click', function startOnce() {
  startBGM();
  document.removeEventListener('click', startOnce);
}, { once: true });
