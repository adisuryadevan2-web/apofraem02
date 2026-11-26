(() => {
  'use strict';

  // Each entry is Japanese|reading|Indonesian meaning. Two question forms per entry
  // provide a 200+ item pool; a date-seeded shuffle selects a reproducible daily set of 100.
  const raw = {
    N5: `私|わたし|saya
学生|がくせい|pelajar
先生|せんせい|guru
友達|ともだち|teman
学校|がっこう|sekolah
家族|かぞく|keluarga
本|ほん|buku
水|みず|air
食べる|たべる|makan
飲む|のむ|minum
行く|いく|pergi
来る|くる|datang
見る|みる|melihat
聞く|きく|mendengar; bertanya
話す|はなす|berbicara
読む|よむ|membaca
書く|かく|menulis
買う|かう|membeli
大きい|おおきい|besar
小さい|ちいさい|kecil
新しい|あたらしい|baru
古い|ふるい|lama; tua
今日|きょう|hari ini
明日|あした|besok
時間|じかん|waktu`,
    N4: `旅行|りょこう|perjalanan
駅|えき|stasiun
病院|びょういん|rumah sakit
薬|くすり|obat
約束|やくそく|janji
経験|けいけん|pengalaman
切符|きっぷ|tiket
道具|どうぐ|alat
案内|あんない|petunjuk; panduan
予約|よやく|reservasi
説明|せつめい|penjelasan
準備|じゅんび|persiapan
必要|ひつよう|perlu
便利|べんり|praktis
安全|あんぜん|aman
心配|しんぱい|khawatir
始める|はじめる|memulai
続ける|つづける|melanjutkan
決める|きめる|memutuskan
忘れる|わすれる|lupa
遅れる|おくれる|terlambat
乗り換える|のりかえる|berganti kendaraan
集める|あつめる|mengumpulkan
特別|とくべつ|khusus
最近|さいきん|akhir-akhir ini`,
    N3: `社会|しゃかい|masyarakat
環境|かんきょう|lingkungan
理由|りゆう|alasan
解決|かいけつ|penyelesaian
規則|きそく|peraturan
利用|りよう|penggunaan; pemanfaatan
改善|かいぜん|perbaikan
発見|はっけん|penemuan
参加|さんか|partisipasi
特徴|とくちょう|ciri khas
割合|わりあい|persentase; proporsi
申し込み|もうしこみ|pendaftaran
関係|かんけい|hubungan
意見|いけん|pendapat
事故|じこ|kecelakaan
機会|きかい|kesempatan
増える|ふえる|bertambah
減る|へる|berkurang
比べる|くらべる|membandingkan
決定|けってい|keputusan
伝える|つたえる|menyampaikan
調査|ちょうさ|survei; penyelidikan
必要性|ひつようせい|kebutuhan
影響|えいきょう|pengaruh
場合|ばあい|kasus; keadaan`,
    N2: `企業|きぎょう|perusahaan
制度|せいど|sistem; kebijakan
状況|じょうきょう|keadaan
対応|たいおう|penanganan; tanggapan
命令|めいれい|perintah
見込み|みこみ|perkiraan; prospek
施策|しさく|kebijakan; langkah
要因|よういん|faktor utama
収益|しゅうえき|pendapatan; keuntungan
負担|ふたん|beban; tanggungan
適用|てきよう|penerapan
促進|そくしん|promosi; percepatan
効率|こうりつ|efisiensi
傾向|けいこう|kecenderungan
維持|いじ|pemeliharaan
実施|じっし|pelaksanaan
判断|はんだん|penilaian; keputusan
確認|かくにん|konfirmasi
解釈|かいしゃく|interpretasi
影響力|えいきょうりょく|pengaruh
具体的|ぐたいてき|konkret
消費|しょうひ|konsumsi
拡大|かくだい|perluasan
削減|さくげん|pengurangan
導入|どうにゅう|penerapan; pengenalan`,
    N1: `端緒|たんしょ|awal; petunjuk awal
拘泥|こうでい|terpaku pada detail
先駆け|さきがけ|pelopor
相まって|あいまって|saling memperkuat
露呈|ろてい|terungkap
阻害|そがい|penghambatan
是正|ぜせい|koreksi; pembetulan
不可欠|ふかけつ|mutlak diperlukan
払拭|ふっしょく|penghapusan; penyingkiran
懸念|けねん|kekhawatiran
打開|だかい|terobosan; pemecahan
促す|うながす|mendorong
顕著|けんちょ|nyata; mencolok
緻密|ちみつ|rinci; teliti
乏しい|とぼしい|langka; kurang
趣旨|しゅし|maksud; pokok pikiran
妥当|だとう|wajar; tepat
矛盾|むじゅん|kontradiksi
根拠|こんきょ|dasar; bukti
踏襲|とうしゅう|mengikuti tradisi
一概に|いちがいに|secara mutlak
余儀なく|よぎなく|terpaksa
顧みる|かえりみる|meninjau kembali
見据える|みすえる|memandang dengan saksama
懐疑|かいぎ|keraguan`
  };

  const bank = Object.entries(raw).flatMap(([level, text]) => text.split('\n').map((line, index) => {
    const [word, reading, meaning] = line.split('|');
    return { id: `${level}-${index}`, level, word, reading, meaning };
  }));
  const pool = bank.flatMap((item) => [
    { id: `${item.id}-meaning`, level: item.level, kind: 'meaning', prompt: `Apa arti kosakata 「${item.word}」?`, answer: item.meaning, source: item },
    { id: `${item.id}-reading`, level: item.level, kind: 'reading', prompt: `Bagaimana cara membaca 「${item.word}」?`, answer: item.reading, source: item }
  ]);
  const $ = (id) => document.getElementById(id);
  const today = new Date().toISOString().slice(0, 10);
  const dailySeed = hash(today);
  const DAILY_KEY = `nihongo-daily-quiz-${today}`;
  const BOARD_KEY = `nihongo-daily-leaderboard-${today}`;
  let questions = seededShuffle(pool, dailySeed).slice(0, 100);
  let player = '';
  let index = 0;
  let score = 0;
  let answered = false;
  let startedAt = 0;

  $('dailyDate').textContent = `Set harian · ${today} (UTC)`;
  $('playerName').value = safeRead('nihongo-quiz-player') || '';

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i += 1) value = Math.imul(value ^ text.charCodeAt(i), 16777619);
    return value >>> 0;
  }
  function rng(seed) {
    let value = seed >>> 0;
    return () => {
      value += 0x6D2B79F5;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function seededShuffle(items, seed) {
    const result = [...items];
    const random = rng(seed);
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function safeRead(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function safeJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return Array.isArray(value) ? value : fallback;
    } catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, value); return true; } catch { return false; }
  }
  function optionSet(question, position) {
    const correct = question.answer;
    const choices = [...new Set(pool.filter((candidate) => candidate.kind === question.kind && candidate.answer !== correct).map((candidate) => candidate.answer))];
    const random = rng(hash(`${today}:${question.id}:${position}`));
    const distractors = seededShuffle(choices, Math.floor(random() * 0xffffffff)).slice(0, 3);
    return seededShuffle([correct, ...distractors], Math.floor(random() * 0xffffffff));
  }
  function showQuestion() {
    const q = questions[index];
    answered = false;
    $('levelBadge').textContent = `JLPT ${q.level} · ${q.kind === 'reading' ? 'Bacaan' : 'Kosakata'}`;
    $('questionCount').textContent = `Soal ${index + 1} dari 100`;
    $('scoreBadge').textContent = `Skor ${score}`;
    $('questionText').textContent = q.prompt;
    $('feedback').textContent = '';
    $('nextButton').disabled = true;
    $('nextButton').textContent = index === 99 ? 'Lihat hasil →' : 'Soal berikutnya →';
    const progress = Math.round((index / 100) * 100);
    $('progressFill').style.width = `${progress}%`;
    document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', String(progress));
    const options = optionSet(q, index);
    const container = $('answers');
    container.replaceChildren();
    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.textContent = option;
      button.addEventListener('click', () => chooseAnswer(button, option, q));
      container.append(button);
    });
    $('streakText').textContent = `${bank.length} kosakata · ${pool.length} variasi soal dalam bank`;
  }
  function chooseAnswer(button, answer, question) {
    if (answered) return;
    answered = true;
    const correct = answer === question.answer;
    if (correct) score += 1;
    document.querySelectorAll('.answer-option').forEach((option) => {
      option.disabled = true;
      if (option.textContent === question.answer) option.classList.add('correct');
    });
    if (!correct) button.classList.add('incorrect');
    $('scoreBadge').textContent = `Skor ${score}`;
    $('feedback').textContent = correct ? 'Benar! よくできました。' : `Belum tepat. Jawaban: ${question.answer}`;
    $('nextButton').disabled = false;
  }
  function begin() {
    player = $('playerName').value.trim().slice(0, 24);
    if (!player) { $('playerName').focus(); return; }
    save('nihongo-quiz-player', player);
    const saved = safeJSON(DAILY_KEY, null);
    if (saved && saved.complete) {
      score = saved.score;
      showResult(saved.score, saved.elapsed, true);
      return;
    }
    index = saved && Number.isInteger(saved.index) ? Math.min(saved.index, 99) : 0;
    score = saved && Number.isInteger(saved.score) ? saved.score : 0;
    startedAt = saved && saved.startedAt ? saved.startedAt : Date.now();
    $('nameCard').classList.add('hidden');
    $('resultCard').classList.add('hidden');
    $('quizCard').classList.remove('hidden');
    showQuestion();
  }
  function next() {
    if (!answered) return;
    index += 1;
    if (index >= 100) { finish(); return; }
    save(DAILY_KEY, JSON.stringify({ index, score, startedAt, complete: false }));
    showQuestion();
    window.scrollTo({ top: $('quizCard').offsetTop - 78, behavior: 'smooth' });
  }
  function finish() {
    const elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const board = safeJSON(BOARD_KEY, []);
    const existing = board.find((entry) => entry.name.toLowerCase() === player.toLowerCase());
    if (!existing || score > existing.score || (score === existing.score && elapsed < existing.elapsed)) {
      const nextBoard = board.filter((entry) => entry.name.toLowerCase() !== player.toLowerCase());
      nextBoard.push({ name: player, score, elapsed, finishedAt: new Date().toISOString() });
      nextBoard.sort((a, b) => b.score - a.score || a.elapsed - b.elapsed);
      save(BOARD_KEY, JSON.stringify(nextBoard.slice(0, 50)));
    }
    save(DAILY_KEY, JSON.stringify({ index: 100, score, elapsed, complete: true }));
    showResult(score, elapsed, false);
    renderBoard();
  }
  function showResult(finalScore, elapsed, alreadyComplete) {
    $('nameCard').classList.add('hidden');
    $('quizCard').classList.add('hidden');
    $('resultCard').classList.remove('hidden');
    $('resultTitle').textContent = `${finalScore} / 100 benar`;
    $('resultSummary').textContent = alreadyComplete
      ? `Kamu sudah menyelesaikan tantangan hari ini dalam ${formatTime(elapsed)}. Set baru tersedia setelah pergantian tanggal UTC.`
      : `Waktu: ${formatTime(elapsed)}. Skor terbaikmu hari ini tersimpan di leaderboard browser ini.`;
    $('retryButton').disabled = true;
    $('retryButton').textContent = 'Set baru besok';
  }
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs} detik`;
  }
  function renderBoard() {
    const list = $('leaderboard');
    list.replaceChildren();
    const board = safeJSON(BOARD_KEY, []).sort((a, b) => b.score - a.score || a.elapsed - b.elapsed);
    if (!board.length) {
      const empty = document.createElement('p');
      empty.className = 'small-note';
      empty.textContent = 'Belum ada skor hari ini. Jadilah yang pertama menyelesaikan latihan!';
      list.append(empty);
      return;
    }
    board.slice(0, 10).forEach((entry, i) => {
      const row = document.createElement('div');
      row.className = 'leader-row';
      const rank = document.createElement('span');
      rank.className = 'badge';
      rank.textContent = `#${i + 1}`;
      const name = document.createElement('span');
      name.className = 'leader-name';
      name.textContent = entry.name;
      const scoreText = document.createElement('span');
      scoreText.className = 'leader-score';
      scoreText.textContent = `${entry.score}/100 · ${formatTime(entry.elapsed)}`;
      row.append(rank, name, scoreText);
      list.append(row);
    });
  }
  $('nameForm').addEventListener('submit', (event) => { event.preventDefault(); begin(); });
  $('nextButton').addEventListener('click', next);
  $('showBoard').addEventListener('click', () => $('leaderCard').scrollIntoView({ behavior: 'smooth' }));
  $('retryButton').addEventListener('click', begin);
  renderBoard();
  if (bank.length < 51) {
    $('nameCard').innerHTML = '<h2>Bank soal belum cukup</h2><p>Tambahkan lebih banyak kosakata untuk membuat 100 soal berbeda.</p>';
  }
})();
