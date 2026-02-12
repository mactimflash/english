/* English Sprint – based on:
   - Cấu trúc cơ bản: S+V+O, Do/Does/Did questions, negatives, Adj+N, Adv+V
   - Câu điều kiện 1/2/3 + unless
   - So sánh (short/long adj)
   - Wish (present unreal / past unreal / future desire)
   - 12 thì cơ bản
   - To be (am/is/are, was/were, will be)
*/

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

const STORAGE_KEY = "english_sprint_v1";
const TRACKING_WORKER_URL_KEY = "english_sprint_worker_url";
const TRACKING_UID_KEY = "english_sprint_uid";
const DEFAULT_WORKER_URL = "https://english-discipline.starlinksatellitewifi.workers.dev";
const DEFAULT_UID = "student1";

function getWorkerUrl(){
  return (localStorage.getItem(TRACKING_WORKER_URL_KEY) || DEFAULT_WORKER_URL).trim();
}
function getUid(){
  return (localStorage.getItem(TRACKING_UID_KEY) || DEFAULT_UID).trim();
}


const LESSONS = [
  {
    id: "basic-structures",
    title: "Cấu trúc cơ bản cần nhớ",
    desc: "S+V+O • Câu hỏi Do/Does/Did • Phủ định • Adj+N • Adv+V",
    tags: ["core", "sentence", "do/does/did"],
    formula: [
      "✅ Khẳng định cơ bản:  S + V + O",
      "❓ Câu hỏi:          Do/Does/Did + S + V ?",
      "🚫 Phủ định:          S + do/does/did not + V",
      "🧩 Tính từ:           Adj + N",
      "🎯 Trạng từ:          Adv + V"
    ],
    examples: [
      { en: "I study English every day.", vi: "Tôi học tiếng Anh mỗi ngày." },
      { en: "Do you work in IT?", vi: "Bạn làm trong IT à?" },
      { en: "She does not like spicy food.", vi: "Cô ấy không thích đồ cay." },
      { en: "a secure system", vi: "một hệ thống an toàn (Adj + N)" },
      { en: "He speaks clearly.", vi: "Anh ấy nói rõ ràng (Adv + V)" },
    ],
    mistakes: [
      "Quên dùng trợ động từ Do/Does/Did khi đặt câu hỏi ở hiện tại đơn/quá khứ đơn.",
      "Sau Do/Does/Did luôn dùng V nguyên mẫu (không thêm -s/-ed).",
      "Nhầm Adj và Adv: 'speak clear' ❌ → 'speak clearly' ✅."
    ],
    checklist: [
      { b:"Câu hỏi?", t:"Thêm Do/Does/Did + đưa V về nguyên mẫu." },
      { b:"Chủ ngữ he/she/it?", t:"Hiện tại đơn: V thêm -s/-es (trừ khi có Do/Does)." },
      { b:"Muốn mô tả danh từ?", t:"Dùng Adj đứng trước N." },
      { b:"Muốn mô tả động từ?", t:"Dùng Adv (thường -ly)." },
    ],
    cards: [
      { q:"Khẳng định cơ bản?", a:"S + V + O (I read books.)" },
      { q:"Câu hỏi hiện tại đơn?", a:"Do/Does + S + V? (Do you like…?)" },
      { q:"Phủ định quá khứ đơn?", a:"S + did not + V (He didn’t go.)" },
      { q:"Adj đứng ở đâu?", a:"Trước danh từ: Adj + N (a fast car)" },
      { q:"Adv dùng khi nào?", a:"Bổ nghĩa động từ: Adv + V (work efficiently)" },
    ],
    quiz: [
      {
        prompt:"Chọn câu hỏi đúng:",
        choices:["You work in IT?", "Do you work in IT?", "Do you works in IT?"],
        answer:1,
        explain:"Hiện tại đơn: Do/Does + S + V nguyên mẫu."
      },
      {
        prompt:"Chọn câu phủ định đúng:",
        choices:["She doesn’t likes coffee.", "She doesn’t like coffee.", "She don’t like coffee."],
        answer:1,
        explain:"Sau doesn’t dùng V nguyên mẫu."
      },
      {
        prompt:"Chọn câu đúng về Adj/Adv:",
        choices:["He speaks clear.", "He speaks clearly.", "He clearly speaksly."],
        answer:1,
        explain:"Trạng từ bổ nghĩa động từ: clearly."
      }
    ],
    writePrompt:
      "Viết 3 câu (1 khẳng định, 1 câu hỏi, 1 phủ định) liên quan công việc của bạn.\n" +
      "Gợi ý: system / policy / audit / access / data."
  },

  {
    id: "conditionals",
    title: "Câu điều kiện (If / Unless)",
    desc: "Loại 1 (có thể xảy ra) • Loại 2 (không có thật HT) • Loại 3 (không có thật QK)",
    tags: ["if", "unless", "grammar"],
    formula: [
      "✅ Loại 1 (có thể xảy ra – hiện tại):",
      "   IF + hiện tại đơn,  S + will + V",
      "",
      "🌀 Loại 2 (không có thật – hiện tại):",
      "   IF + quá khứ đơn,   S + would + V",
      "",
      "🕰️ Loại 3 (không có thật – quá khứ):",
      "   IF + quá khứ hoàn thành,  S + would have + PII",
      "",
      "💡 Unless = If not"
    ],
    examples: [
      { en:"If I have time, I will call you.", vi:"Nếu tôi có thời gian, tôi sẽ gọi bạn." },
      { en:"If I were you, I would update the policy.", vi:"Nếu tôi là bạn, tôi sẽ cập nhật chính sách." },
      { en:"If we had tested earlier, we would have avoided the bug.", vi:"Nếu test sớm, ta đã tránh được lỗi." },
      { en:"Unless you act now, you will miss the deadline.", vi:"Nếu không hành động ngay, bạn sẽ trễ hạn." },
    ],
    mistakes: [
      "Loại 1: mệnh đề If dùng hiện tại đơn, KHÔNG dùng 'will' trong mệnh đề If.",
      "Loại 2: 'If I were…' thường dùng cho mọi chủ ngữ để nói giả định.",
      "Loại 3: would have + PII (không dùng would + V)."
    ],
    checklist: [
      { b:"Thực tế hay giả định?", t:"Xác định loại 1/2/3 trước khi chia thì." },
      { b:"Nếu nói 'giả định hiện tại'", t:"Dùng If + V2, would + V." },
      { b:"Giả định quá khứ", t:"Dùng If + had + PII, would have + PII." },
      { b:"Unless", t:"Thay cho 'If not' (nghĩa phủ định)." },
    ],
    cards: [
      { q:"Conditional type 1?", a:"If + present simple, will + V" },
      { q:"Conditional type 2?", a:"If + past simple, would + V (If I were…)" },
      { q:"Conditional type 3?", a:"If + past perfect, would have + PII" },
      { q:"Unless nghĩa là gì?", a:"Unless = If not" }
    ],
    quiz: [
      {
        prompt:"Chọn câu đúng (Type 1):",
        choices:["If it will rain, we stay home.", "If it rains, we will stay home.", "If it rains, we would stay home."],
        answer:1,
        explain:"Type 1: If + present simple, will + V."
      },
      {
        prompt:"Chọn câu đúng (Type 2):",
        choices:["If I am you, I would do it.", "If I were you, I would do it.", "If I was you, I will do it."],
        answer:1,
        explain:"Giả định hiện tại: If I were you..."
      },
      {
        prompt:"Chọn câu đúng (Type 3):",
        choices:["If we tested, we would avoid it.", "If we had tested, we would have avoided it.", "If we have tested, we would avoided it."],
        answer:1,
        explain:"Type 3: If + had + PII, would have + PII."
      }
    ],
    writePrompt:
      "Viết 3 câu:\n(1) Type 1 về deadline\n(2) Type 2 về lời khuyên\n(3) Type 3 về một lỗi đã xảy ra."
  },

  {
    id: "comparisons",
    title: "So sánh (Comparatives)",
    desc: "Tính từ ngắn: -er / as...as / the -est • Tính từ dài: more / the most",
    tags: ["comparative", "superlative"],
    formula: [
      "📌 Tính từ ngắn:",
      "   So sánh hơn:   S1 + be + adj-er + than + S2",
      "   So sánh bằng:  S1 + be + as + adj + as + S2",
      "   So sánh nhất:  the + adj-est",
      "",
      "📌 Tính từ dài:",
      "   So sánh hơn:   S1 + be + more + adj + than + S2",
      "   So sánh bằng:  S1 + be + as + adj + as + S2",
      "   So sánh nhất:  the most + adj"
    ],
    examples: [
      { en:"This task is easier than I expected.", vi:"Việc này dễ hơn tôi nghĩ." },
      { en:"Our system is as stable as theirs.", vi:"Hệ thống của ta ổn định ngang họ." },
      { en:"She is the fastest in the team.", vi:"Cô ấy nhanh nhất đội." },
      { en:"This solution is more efficient than the old one.", vi:"Giải pháp này hiệu quả hơn cái cũ." },
      { en:"It is the most important control.", vi:"Đây là kiểm soát quan trọng nhất." },
    ],
    mistakes: [
      "Không dùng 'more' với tính từ ngắn (more fast ❌ → faster ✅).",
      "So sánh nhất luôn có 'the' (fastest ❌ → the fastest ✅).",
      "So sánh bằng: 'as + adj + as' (không phải 'so...as' trong câu khẳng định)."
    ],
    checklist: [
      { b:"Adj ngắn hay dài?", t:"1 âm tiết thường thêm -er/-est; dài dùng more/most." },
      { b:"Than", t:"So sánh hơn luôn có than." },
      { b:"As...as", t:"So sánh bằng cho cả adj ngắn/dài." },
      { b:"The", t:"Superlative cần 'the'." },
    ],
    cards: [
      { q:"Comparative (short adj)?", a:"be + adj-er + than" },
      { q:"Superlative (long adj)?", a:"the most + adj" },
      { q:"Equal comparison?", a:"as + adj + as" }
    ],
    quiz: [
      {
        prompt:"Chọn câu đúng:",
        choices:["He is more tall than me.", "He is taller than me.", "He is the taller than me."],
        answer:1,
        explain:"Tall là tính từ ngắn → taller."
      },
      {
        prompt:"Chọn câu đúng:",
        choices:["This is the most useful document.", "This is most useful document.", "This is the usefulest document."],
        answer:0,
        explain:"Useful (dài) → the most useful."
      }
    ],
    writePrompt:"Viết 3 câu so sánh về: quy trình cũ vs mới, hệ thống A vs B, và điều quan trọng nhất."
  },

  {
    id: "wish",
    title: "Wish (Câu ước)",
    desc: "Không có thật hiện tại • Không có thật quá khứ • Mong ước tương lai",
    tags: ["wish", "unreal"],
    formula: [
      "🙃 Không có thật (hiện tại):  wish + quá khứ đơn",
      "   I wish I were taller.",
      "",
      "⏳ Không có thật (quá khứ):  wish + quá khứ hoàn thành",
      "   I wish I had studied harder.",
      "",
      "🔮 Mong ước tương lai:       wish + could / would",
      "   I wish I could travel abroad."
    ],
    examples: [
      { en:"I wish I were more confident in meetings.", vi:"Ước gì tôi tự tin hơn trong cuộc họp." },
      { en:"I wish we had prepared the audit evidence earlier.", vi:"Ước gì ta chuẩn bị bằng chứng audit sớm hơn." },
      { en:"I wish I could speak English fluently.", vi:"Ước gì tôi nói tiếng Anh trôi chảy." },
    ],
    mistakes: [
      "Không dùng 'wish + will' cho bản thân; thường dùng wish + would để phàn nàn/ước người khác thay đổi.",
      "Dùng 'were' phổ biến trong giả định: I wish I were…",
      "Phân biệt hiện tại vs quá khứ để chọn past simple / past perfect."
    ],
    checklist: [
      { b:"Ước hiện tại khác thực tế", t:"wish + V2 (were/was)"},
      { b:"Ước về chuyện đã qua", t:"wish + had + PII"},
      { b:"Ước có thể làm", t:"wish + could"},
      { b:"Ước ai đó thay đổi", t:"wish + would (thường chủ ngữ khác)"},
    ],
    cards: [
      { q:"Wish (present unreal)?", a:"wish + past simple (I wish I were…)" },
      { q:"Wish (past unreal)?", a:"wish + past perfect (I wish I had…)" },
      { q:"Wish (future desire)?", a:"wish + could/would" }
    ],
    quiz: [
      {
        prompt:"Chọn câu đúng:",
        choices:["I wish I am richer.", "I wish I were richer.", "I wish I will be richer."],
        answer:1,
        explain:"Wish hiện tại: past simple → were."
      },
      {
        prompt:"Chọn câu đúng:",
        choices:["I wish I studied harder.", "I wish I had studied harder.", "I wish I would studied harder."],
        answer:1,
        explain:"Wish quá khứ: had + PII."
      }
    ],
    writePrompt:"Viết 3 câu wish: (1) hiện tại, (2) quá khứ, (3) tương lai."
  },

  {
    id: "tenses-12",
    title: "12 thì cơ bản (tóm tắt)",
    desc: "Hiện tại/Quá khứ/Tương lai – đơn/tiếp diễn/hoàn thành/hoàn thành tiếp diễn",
    tags: ["tenses", "summary"],
    formula: [
      "HIỆN TẠI",
      "• Present Simple:        S + V",
      "• Present Continuous:    S + am/is/are + V-ing",
      "• Present Perfect:       S + have/has + PII",
      "• Present Perfect Cont.: S + have/has been + V-ing",
      "",
      "QUÁ KHỨ",
      "• Past Simple:           S + V2 / V-ed",
      "• Past Continuous:       S + was/were + V-ing",
      "• Past Perfect:          S + had + PII",
      "• Past Perfect Cont.:    S + had been + V-ing",
      "",
      "TƯƠNG LAI",
      "• Future Simple:         S + will + V",
      "• Future Continuous:     S + will be + V-ing",
      "• Future Perfect:        S + will have + PII",
      "• Future Perfect Cont.:  S + will have been + V-ing"
    ],
    examples: [
      { en:"I work in IT.", vi:"Hiện tại đơn (thói quen/sự thật)." },
      { en:"I am working now.", vi:"Hiện tại tiếp diễn (đang diễn ra)." },
      { en:"I have finished the report.", vi:"Hiện tại hoàn thành (đã xong, liên quan hiện tại)." },
      { en:"I was working at 9 PM.", vi:"Quá khứ tiếp diễn." },
      { en:"I will have finished by Friday.", vi:"Tương lai hoàn thành (xong trước mốc)." },
    ],
    mistakes: [
      "Nhầm Present Perfect với Past Simple (đã có mốc thời gian cụ thể thường dùng Past Simple).",
      "Quên 'been' ở perfect continuous.",
      "Sau have/has/had dùng PII (V3)."
    ],
    checklist: [
      { b:"Có mốc thời gian quá khứ rõ?", t:"Thường dùng Past Simple." },
      { b:"Nhấn mạnh kết quả hiện tại?", t:"Dùng Present Perfect." },
      { b:"Nhấn mạnh quá trình kéo dài?", t:"Dùng Perfect Continuous." },
      { b:"Có 'by + mốc tương lai'?", t:"Hay dùng Future Perfect." },
    ],
    cards: [
      { q:"Present Continuous?", a:"am/is/are + V-ing" },
      { q:"Present Perfect?", a:"have/has + PII" },
      { q:"Past Perfect?", a:"had + PII" },
      { q:"Future Perfect?", a:"will have + PII" }
    ],
    quiz: [
      {
        prompt:"Chọn câu đúng:",
        choices:["I have went to work.", "I have gone to work.", "I have go to work."],
        answer:1,
        explain:"PII của go là gone."
      },
      {
        prompt:"Chọn câu đúng:",
        choices:["I was work at 9 PM.", "I was working at 9 PM.", "I were working at 9 PM."],
        answer:1,
        explain:"Past Continuous: was/were + V-ing."
      }
    ],
    writePrompt:"Viết 3 câu: 1 hiện tại hoàn thành, 1 quá khứ đơn, 1 tương lai hoàn thành."
  },

  {
    id: "to-be",
    title: "To be (am/is/are – was/were – will be)",
    desc: "Dùng để giới thiệu, mô tả, trạng thái, cảm xúc",
    tags: ["to be", "foundation"],
    formula: [
      "CHỦ NGỮ | QUÁ KHỨ | HIỆN TẠI | TƯƠNG LAI",
      "I       | was     | am       | will be",
      "You/We/They | were | are      | will be",
      "He/She/It   | was  | is       | will be",
      "",
      "👉 To be dùng để: giới thiệu • mô tả • trạng thái • cảm xúc"
    ],
    examples: [
      { en:"I am ready.", vi:"Tôi sẵn sàng." },
      { en:"She is tired.", vi:"Cô ấy mệt." },
      { en:"They were in a meeting.", vi:"Họ đã ở trong cuộc họp." },
      { en:"We will be available tomorrow.", vi:"Mai chúng tôi sẽ rảnh." },
    ],
    mistakes: [
      "Nhầm was/were theo chủ ngữ.",
      "Quên 'be' sau will (will available ❌ → will be available ✅).",
      "Dùng to be + V-ing cho hành động đang xảy ra (am working)."
    ],
    checklist: [
      { b:"Xác định chủ ngữ", t:"I / he-she-it / you-we-they." },
      { b:"Xác định thời điểm", t:"Quá khứ: was/were; hiện tại: am/is/are; tương lai: will be." },
      { b:"Mô tả cảm xúc/trạng thái", t:"To be + adj (I am happy)." },
      { b:"Đang diễn ra", t:"To be + V-ing (She is working)." },
    ],
    cards: [
      { q:"I (past)?", a:"was" },
      { q:"They (present)?", a:"are" },
      { q:"He (future)?", a:"will be" }
    ],
    quiz: [
      {
        prompt:"Chọn câu đúng:",
        choices:["They was happy.", "They were happy.", "They are happy yesterday."],
        answer:1,
        explain:"They → were (quá khứ)."
      },
      {
        prompt:"Chọn câu đúng:",
        choices:["I will busy tomorrow.", "I will be busy tomorrow.", "I am be busy tomorrow."],
        answer:1,
        explain:"Tương lai: will be."
      }
    ],
    writePrompt:"Viết 3 câu: (1) giới thiệu, (2) trạng thái hiện tại, (3) kế hoạch tương lai."
  },
];

const state = loadState();

function defaultState(){
  return {
    selectedLessonId: null,
    done: {},               // lessonId => true
    points: 0,
    streak: { count: 0, lastDay: null },
    cards: {},              // lessonId => { idx, flipped, remembered: {cardIndex: score} }
    quiz: {},               // lessonId => { idx, correct }
    writings: {},           // lessonId => text
    lastDaily: null
  };
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  }catch{
    return defaultState();
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function bumpStreak(){
  const t = todayKey();
  if(state.streak.lastDay === t) return;
  // If lastDay is yesterday => +1 else reset to 1
  if(state.streak.lastDay){
    const last = new Date(state.streak.lastDay + "T00:00:00");
    const now = new Date(t + "T00:00:00");
    const diffDays = Math.round((now - last) / (1000*60*60*24));
    if(diffDays === 1) state.streak.count += 1;
    else state.streak.count = 1;
  }else{
    state.streak.count = 1;
  }
  state.streak.lastDay = t;
  saveState();
}

function addPoints(n){
  state.points += n;
  saveState();
  renderStats();
}

function setSelectedLesson(id){
  state.selectedLessonId = id;
  saveState();
  renderAll();
}

function getLesson(){
  return LESSONS.find(x => x.id === state.selectedLessonId) || null;
}

function renderStats(){
  $("#streak").textContent = state.streak.count || 0;
  $("#points").textContent = state.points || 0;
  const doneCount = Object.keys(state.done||{}).length;
  $("#done").textContent = doneCount;
  $("#total").textContent = LESSONS.length;
}

function renderLessonList(filterText=""){
  const list = $("#lessonList");
  list.innerHTML = "";

  const q = filterText.trim().toLowerCase();
  const filtered = !q ? LESSONS : LESSONS.filter(ls => {
    const blob = [
      ls.title, ls.desc, ...(ls.tags||[]),
      ...(ls.formula||[]),
      ...((ls.examples||[]).map(e => e.en + " " + e.vi)),
      ...((ls.mistakes||[])),
    ].join(" ").toLowerCase();
    return blob.includes(q);
  });

  if(filtered.length === 0){
    list.innerHTML = `<div class="pill">Không tìm thấy. Thử: <b>if</b>, <b>wish</b>, <b>perfect</b>, <b>to be</b>…</div>`;
    return;
  }

  filtered.forEach(ls => {
    const item = document.createElement("div");
    item.className = "lessonItem" + (ls.id === state.selectedLessonId ? " active" : "");
    const isDone = !!state.done?.[ls.id];

    item.innerHTML = `
      <div class="lessonTop">
        <div class="lessonName">${escapeHtml(ls.title)}</div>
        <div class="badge ${isDone ? "done":""}">${isDone ? "Done" : "New"}</div>
      </div>
      <div class="lessonDesc">${escapeHtml(ls.desc)}</div>
      <div class="lessonMetaRow">
        ${(ls.tags||[]).slice(0,4).map(t => `<div class="tag">#${escapeHtml(t)}</div>`).join("")}
      </div>
    `;

    item.addEventListener("click", () => setSelectedLesson(ls.id));
    list.appendChild(item);
  });
}

function renderLearn(){
  const ls = getLesson();
  $("#lessonTitle").textContent = ls ? ls.title : "Chọn một bài để bắt đầu";
  $("#lessonMeta").textContent = ls ? ls.desc : "Flashcards • Quiz • Luyện viết • Ghi nhớ";

  $("#btnMarkDone").disabled = !ls;

  $("#formulaBlock").textContent = ls ? ls.formula.join("\n") : "Chọn bài học để xem công thức.";
  $("#examplesBlock").innerHTML = ls ? ls.examples.map(ex => `
    <div class="example">
      <div class="en">${escapeHtml(ex.en)}</div>
      <div class="vi">${escapeHtml(ex.vi)}</div>
    </div>
  `).join("") : "";

  $("#mistakesBlock").innerHTML = ls ? ls.mistakes.map(m => `<li>${escapeHtml(m)}</li>`).join("") : "";

  $("#checklistBlock").innerHTML = ls ? ls.checklist.map(c => `
    <div class="check">
      <div>✅</div>
      <div><b>${escapeHtml(c.b)}</b><div class="small" style="margin-top:4px">${escapeHtml(c.t)}</div></div>
    </div>
  `).join("") : "";
}

function ensureCardState(lessonId){
  if(!state.cards[lessonId]){
    state.cards[lessonId] = { idx: 0, flipped: false, remembered: {} };
  }
  return state.cards[lessonId];
}

function renderCards(){
  const ls = getLesson();
  if(!ls){
    $("#fcFront").textContent = "Chọn bài học";
    $("#fcBack").textContent = "Flashcards sẽ hiện ở đây";
    $("#cardsCounter").textContent = "0/0";
    $("#cardsProgress").style.width = "0%";
    $("#flashcard").classList.remove("flipped");
    return;
  }

  const cs = ensureCardState(ls.id);
  const total = ls.cards.length;
  cs.idx = clamp(cs.idx, 0, total-1);

  const card = ls.cards[cs.idx];
  $("#fcFront").textContent = card.q;
  $("#fcBack").textContent = card.a;

  $("#flashcard").classList.toggle("flipped", !!cs.flipped);
  $("#cardsCounter").textContent = `${cs.idx+1}/${total}`;

  const rememberedCount = Object.values(cs.remembered||{}).filter(v => v > 0).length;
  const pct = total ? Math.round((rememberedCount/total)*100) : 0;
  $("#cardsProgress").style.width = `${pct}%`;
  saveState();
}

function flipCard(){
  const ls = getLesson();
  if(!ls) return;
  const cs = ensureCardState(ls.id);
  cs.flipped = !cs.flipped;
  saveState();
  renderCards();
}

function nextCard(step=1){
  const ls = getLesson();
  if(!ls) return;
  const cs = ensureCardState(ls.id);
  cs.idx = (cs.idx + step + ls.cards.length) % ls.cards.length;
  cs.flipped = false;
  saveState();
  renderCards();
}

function rateCard(remember=true){
  const ls = getLesson();
  if(!ls) return;
  const cs = ensureCardState(ls.id);
  cs.remembered[cs.idx] = remember ? 1 : 0;

  bumpStreak();
  addPoints(remember ? 3 : 1);
  trackStudy("flashcard");

  nextCard(1);
}

function ensureQuizState(lessonId){
  if(!state.quiz[lessonId]){
    state.quiz[lessonId] = { idx: 0, correct: 0, answered: {} };
  }
  return state.quiz[lessonId];
}

let quizLocked = false;

function renderQuiz(){
  const ls = getLesson();
  const box = $("#quizBox");
  if(!ls){
    box.innerHTML = `<div class="pill">Chọn bài học để bắt đầu quiz.</div>`;
    return;
  }

  const qs = ensureQuizState(ls.id);
  const total = ls.quiz.length;
  qs.idx = clamp(qs.idx, 0, total-1);
  const q = ls.quiz[qs.idx];

  const answered = qs.answered[qs.idx];
  const selected = answered?.selected;
  const isCorrect = answered?.isCorrect;

  box.innerHTML = `
    <div class="qCard">
      <div class="qPrompt">Câu ${qs.idx+1}/${total}: ${escapeHtml(q.prompt)}</div>
      <div class="qChoices">
        ${q.choices.map((c, i) => {
          let cls = "choice";
          if(answered){
            if(i === q.answer) cls += " correct";
            else if(i === selected) cls += " wrong";
          }
          return `<button class="${cls}" data-choice="${i}" type="button">${escapeHtml(c)}</button>`;
        }).join("")}
      </div>
      <div class="qExplain">${answered ? escapeHtml(q.explain) : "Chọn 1 đáp án."}</div>
    </div>
  `;

  $$(".choice", box).forEach(btn => {
    btn.addEventListener("click", () => {
      if(quizLocked) return;
      const idx = Number(btn.dataset.choice);
      answerQuiz(idx);
    });
  });

  saveState();
}

function answerQuiz(choiceIndex){
  const ls = getLesson();
  if(!ls) return;
  const qs = ensureQuizState(ls.id);
  const q = ls.quiz[qs.idx];

  if(qs.answered[qs.idx]) return; // already answered
  const correct = (choiceIndex === q.answer);

  qs.answered[qs.idx] = { selected: choiceIndex, isCorrect: correct };
  if(correct) qs.correct += 1;

  bumpStreak();
  addPoints(correct ? 10 : 3);
  trackStudy("quiz");

  quizLocked = true;
  renderQuiz();
  setTimeout(() => { quizLocked = false; }, 250);
}

function nextQuiz(){
  const ls = getLesson();
  if(!ls) return;
  const qs = ensureQuizState(ls.id);
  qs.idx = (qs.idx + 1) % ls.quiz.length;
  saveState();
  renderQuiz();
}

function skipQuiz(){
  const ls = getLesson();
  if(!ls) return;
  bumpStreak();
  addPoints(1);
  trackStudy("quiz_skip");
  nextQuiz();
}

function renderWrite(){
  const ls = getLesson();
  $("#writePrompt").textContent = ls ? ls.writePrompt : "Chọn bài học để có đề bài luyện viết.";
  $("#writeInput").value = ls ? (state.writings?.[ls.id] || "") : "";

  // Self-check checklist (same idea but specific)
  const checks = ls ? [
    { b:"Đúng công thức", t:"Soát lại theo khung công thức bài học." },
    { b:"Đúng thì/đúng trợ động từ", t:"Do/Does/Did • have/has • was/were • will be..." },
    { b:"Có đủ 3 câu", t:"Mỗi câu 6–12 từ, rõ ý." },
    { b:"Đọc to 1 lần", t:"Tự sửa phát âm và nhịp câu." }
  ] : [];

  $("#selfCheck").innerHTML = checks.map(c => `
    <div class="check">
      <div>🔍</div>
      <div><b>${escapeHtml(c.b)}</b><div class="small" style="margin-top:4px">${escapeHtml(c.t)}</div></div>
    </div>
  `).join("");
}

function saveWriting(){
  const ls = getLesson();
  if(!ls) return;
  state.writings[ls.id] = $("#writeInput").value || "";
  bumpStreak();
  addPoints(5);
  trackStudy("writing");
  saveState();
  toast("Đã lưu luyện viết ✅");
}

function loadWriting(){
  const ls = getLesson();
  if(!ls) return;
  $("#writeInput").value = state.writings?.[ls.id] || "";
  toast("Đã tải lại ✅");
}

function templateWriting(){
  const ls = getLesson();
  if(!ls) return;

  const templates = {
    "basic-structures": [
      "I review the policy today.",
      "Do you need this evidence?",
      "We did not approve the change."
    ],
    "conditionals": [
      "If we finish early, we will send the report.",
      "If I were you, I would ask for clarification.",
      "If we had tested earlier, we would have avoided the incident."
    ],
    "comparisons": [
      "This process is faster than the old one.",
      "Our approach is as practical as theirs.",
      "Access control is the most important part."
    ],
    "wish": [
      "I wish I were more confident.",
      "I wish we had prepared better.",
      "I wish I could speak fluently."
    ],
    "tenses-12": [
      "I have finished the checklist.",
      "I updated the document yesterday.",
      "I will have completed it by Friday."
    ],
    "to-be": [
      "I am an IT manager.",
      "They were in a meeting.",
      "We will be available tomorrow."
    ]
  };

  const t = templates[ls.id] || [];
  const current = ($("#writeInput").value || "").trim();
  if(current.length === 0){
    $("#writeInput").value = t.join("\n");
  }else{
    $("#writeInput").value = current + "\n" + t.join("\n");
  }
  toast("Đã chèn gợi ý mẫu ✍️");
}

function markDone(){
  const ls = getLesson();
  if(!ls) return;
  state.done[ls.id] = true;
  bumpStreak();
  addPoints(20);
  trackStudy("done");
  saveState();
  renderLessonList($("#searchInput").value || "");
  renderStats();
  toast("Đã đánh dấu hoàn thành ✅");
}

function resetAll(){
  const ok = confirm("Reset toàn bộ tiến độ? (Điểm, streak, done, cards, quiz, writings)");
  if(!ok) return;
  const fresh = defaultState();
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, fresh);
  saveState();
  renderAll();
  toast("Đã reset ✅");
}

function dailyPlan(){
  // Simple daily rotation: choose 1 lesson not done; else random
  const notDone = LESSONS.filter(ls => !state.done?.[ls.id]);
  const pick = (notDone.length ? notDone : LESSONS)[Math.floor(Math.random() * (notDone.length ? notDone.length : LESSONS.length))];
  state.lastDaily = pick.id;
  saveState();
  setSelectedLesson(pick.id);
  setTab("cards");
  toast("Daily 5' → làm 5 thẻ + 1 quiz ✅");
  trackStudy("daily");
}

function exportProgress(){
  const data = JSON.stringify(state, null, 2);
  navigator.clipboard?.writeText(data).then(() => {
    toast("Đã copy tiến độ vào clipboard 📋");
  }).catch(() => {
    alert("Không copy được. Bạn có thể mở DevTools để lấy localStorage.");
  });
}

function showTodayPlan(){
  const id = state.lastDaily || "(chưa chọn)";
  alert(`Daily hôm nay: ${id}\n\nGợi ý: 5 flashcards + 2 câu quiz + 1 câu viết.`);
}

function setTab(tab){
  $$(".tab").forEach(t => {
    const active = t.dataset.tab === tab;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });
  $$(".view").forEach(v => v.classList.toggle("active", v.dataset.view === tab));

  // Bottom nav sync
  $$(".navBtn").forEach(b => b.classList.toggle("active", b.dataset.nav === tab || (tab==="learn" && b.dataset.nav==="lessons")));
}

function setNav(nav){
  if(nav === "lessons") setTab("learn");
  else setTab(nav);
}

function copyFormula(){
  const text = $("#formulaBlock").textContent || "";
  if(!text.trim()) return;
  navigator.clipboard?.writeText(text).then(() => toast("Đã copy công thức 📋"));
}

function showTips(){
  const ls = getLesson();
  if(!ls) return;
  alert(
`Gợi ý học nhanh (${ls.title}):
1) Đọc công thức 2 lần.
2) Đọc to 3 ví dụ.
3) Làm quiz 2 câu.
4) Viết 1 câu theo bối cảnh của bạn.
=> 5 phút là đủ để nhớ nền.`
  );
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

/* Toast */
let toastTimer = null;
function toast(msg){
  let el = $("#toast");
  if(!el){
    el = document.createElement("div");
    el.id = "toast";
    el.style.position = "fixed";
    el.style.left = "12px";
    el.style.right = "12px";
    el.style.bottom = `calc(80px + env(safe-area-inset-bottom))`;
    el.style.margin = "0 auto";
    el.style.maxWidth = "700px";
    el.style.background = "rgba(17,21,34,.92)";
    el.style.border = "1px solid rgba(255,255,255,.10)";
    el.style.borderRadius = "16px";
    el.style.padding = "12px 14px";
    el.style.color = "white";
    el.style.backdropFilter = "blur(12px)";
    el.style.boxShadow = "0 18px 40px rgba(0,0,0,.35)";
    el.style.fontWeight = "800";
    el.style.zIndex = "60";
    el.style.transform = "translateY(10px)";
    el.style.opacity = "0";
    el.style.transition = "all .18s ease";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  requestAnimationFrame(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
  }, 1800);
}

/* Modal */
function openModal(){
  const m = $("#settingsModal");
  m.classList.add("show");
  m.setAttribute("aria-hidden","false");
}
function closeModal(){
  const m = $("#settingsModal");
  m.classList.remove("show");
  m.setAttribute("aria-hidden","true");
}

/* Render all */
function renderAll(){
  renderStats();
  renderLessonList($("#searchInput").value || "");
  renderLearn();
  renderCards();
  renderQuiz();
  renderWrite();

  const ls = getLesson();
  $("#btnMarkDone").textContent = ls && state.done?.[ls.id] ? "✅ Đã hoàn thành" : "✅ Đánh dấu đã học";
}

/* Events */
function bindEvents(){
  // Tabs
  $$(".tab").forEach(t => {
    t.addEventListener("click", () => setTab(t.dataset.tab));
  });

  // Bottom nav
  $$(".navBtn").forEach(b => b.addEventListener("click", () => setNav(b.dataset.nav)));

  // Search
  $("#searchInput").addEventListener("input", (e) => {
    renderLessonList(e.target.value || "");
  });
  $("#btnClearSearch").addEventListener("click", () => {
    $("#searchInput").value = "";
    renderLessonList("");
  });

  // Buttons
  $("#btnMarkDone").addEventListener("click", markDone);
  $("#btnDaily").addEventListener("click", dailyPlan);
  $("#btnReset").addEventListener("click", resetAll);

  $("#btnCopyFormula").addEventListener("click", copyFormula);
  $("#btnShowTips").addEventListener("click", showTips);

  // Cards
  $("#btnFlipCard").addEventListener("click", flipCard);
  $("#btnPrevCard").addEventListener("click", () => nextCard(-1));
  $("#btnNextCard").addEventListener("click", () => nextCard(1));
  $("#btnRemember").addEventListener("click", () => rateCard(true));
  $("#btnAgain").addEventListener("click", () => rateCard(false));

  $("#flashcard").addEventListener("click", flipCard);
  $("#flashcard").addEventListener("keydown", (e) => {
    if(e.key === "Enter" || e.key === " ") { e.preventDefault(); flipCard(); }
    if(e.key === "ArrowRight") nextCard(1);
    if(e.key === "ArrowLeft") nextCard(-1);
  });

  // Quiz
  $("#btnQuizNext").addEventListener("click", nextQuiz);
  $("#btnQuizSkip").addEventListener("click", skipQuiz);

  // Writing
  $("#btnSaveWriting").addEventListener("click", saveWriting);
  $("#btnLoadWriting").addEventListener("click", loadWriting);
  $("#btnTemplate").addEventListener("click", templateWriting);

  // Settings
  $("#btnSettings").addEventListener("click", openModal);
  $("#settingsModal").addEventListener("click", (e) => {
    const close = e.target?.dataset?.close === "1";
    if(close) closeModal();
  });
  $("#btnExport").addEventListener("click", exportProgress);
  $("#btnTodayPlan").addEventListener("click", showTodayPlan);

  // Tracking settings (Worker URL + UID)
  const wInput = $("#workerUrlInput");
  const uInput = $("#uidInput");
  const status = $("#syncStatus");
  const setStatus = (m) => { if(status) status.textContent = m || ""; };

  if(wInput) wInput.value = getWorkerUrl();
  if(uInput) uInput.value = getUid();

  $("#btnSaveTracking")?.addEventListener("click", () => {
    const w = (wInput?.value || "").trim();
    const u = (uInput?.value || "").trim();
    if(w) localStorage.setItem(TRACKING_WORKER_URL_KEY, w);
    if(u) localStorage.setItem(TRACKING_UID_KEY, u);
    setStatus("✅ Đã lưu tracking.");
  });

  $("#btnTestPing")?.addEventListener("click", () => {
    setStatus("⏳ Đang ping Worker…");
    // force ping ignoring throttle
    __lastStudyPing = 0;
    trackStudy("test_ping");
    setTimeout(()=> setStatus("✅ Đã gửi ping. Mở Cloudflare Worker Logs để kiểm tra."), 600);
  });

  // Keep iOS safe: prevent double-tap zoom on buttons
}
let __lastStudyPing = 0;
function trackStudy(reason="study"){
  const now = Date.now();
  if(now - __lastStudyPing < 60_000) return; // throttle 60s
  __lastStudyPing = now;

  const base = getWorkerUrl().replace(/\/+$/,"");
  const uid = getUid() || "anonymous";

  fetch(base + "/study", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, reason, ts: now })
  }).catch(()=>{});
}
/* Init */
(function init(){
  bindEvents();
  renderStats();
  renderLessonList("");

  // Auto select last or first
  if(state.selectedLessonId){
    setSelectedLesson(state.selectedLessonId);
  }else{
    setSelectedLesson(LESSONS[0].id);
  }

  // Default tab
  setTab("learn");
})();
trackStudy("page_load");
