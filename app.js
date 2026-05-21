const SUPABASE_URL = "https://kokglubqeragovloslmh.supabase.co";
const SUPABASE_KEY = "sb_publishable_Cg-24EcJW9ZapBv64alnmA_MnXcqHTv";
const API_BASE = `${SUPABASE_URL}/rest/v1/love_items`;
const today = new Date().toISOString().slice(0, 10);

const cityCoordinates = {
  北京: [116.4074, 39.9042], 上海: [121.4737, 31.2304], 天津: [117.2, 39.1333], 重庆: [106.5516, 29.563],
  广州: [113.2644, 23.1291], 深圳: [114.0579, 22.5431], 杭州: [120.1551, 30.2741], 南京: [118.7969, 32.0603],
  苏州: [120.5853, 31.2989], 成都: [104.0665, 30.5728], 西安: [108.9402, 34.3416], 武汉: [114.3054, 30.5931],
  长沙: [112.9388, 28.2282], 厦门: [118.0894, 24.4798], 福州: [119.2965, 26.0745], 青岛: [120.3826, 36.0671],
  济南: [117.1201, 36.6512], 郑州: [113.6254, 34.7466], 合肥: [117.2272, 31.8206], 南昌: [115.8582, 28.6829],
  南宁: [108.3669, 22.817], 桂林: [110.29, 25.2736], 昆明: [102.8329, 24.8801], 大理: [100.2676, 25.6065],
  贵阳: [106.6302, 26.647], 拉萨: [91.1409, 29.6456], 西宁: [101.7782, 36.6171], 兰州: [103.8343, 36.0611],
  银川: [106.2309, 38.4872], 呼和浩特: [111.7492, 40.8426], 乌鲁木齐: [87.6168, 43.8256], 哈尔滨: [126.5349, 45.8038],
  长春: [125.3235, 43.8171], 沈阳: [123.4315, 41.8057], 大连: [121.6147, 38.914], 太原: [112.5489, 37.8706],
  石家庄: [114.5149, 38.0428], 海口: [110.3312, 20.031], 三亚: [109.5119, 18.2528], 香港: [114.1694, 22.3193],
  澳门: [113.5439, 22.1987], 台北: [121.5654, 25.033], 宁波: [121.5503, 29.8746], 无锡: [120.3124, 31.49],
  扬州: [119.4127, 32.3932], 常州: [119.9741, 31.8112], 温州: [120.6994, 27.9949], 泉州: [118.6759, 24.8741],
  佛山: [113.1214, 23.0215], 珠海: [113.5767, 22.2707], 东莞: [113.7518, 23.0207], 洛阳: [112.454, 34.6197],
  开封: [114.3076, 34.7973], 张家界: [110.4792, 29.1171], 丽江: [100.233, 26.8721], 西双版纳: [100.7979, 22.0094]
};

const defaults = {
  records: [
    { title: "第一次认真散步", date: "2024-05-20", mood: "安心", note: "路灯亮起来的时候，连沉默都变得很柔软。", favorite: true },
    { title: "一起吃到热乎乎的甜品", date: "2024-08-09", mood: "开心", note: "勺子碰到碗边的声音，像给今天盖了一个小印章。", favorite: false },
    { title: "下雨天共享一把伞", date: "2025-02-14", mood: "甜", note: "雨很密，但肩膀靠近之后，世界忽然变小了。", favorite: true }
  ],
  footprints: [
    { date: "2024.05", city: "上海", note: "晚风很轻，路灯也刚刚好。" },
    { date: "2024.08", city: "杭州", note: "把同一份甜分成两口。" },
    { date: "2025.02", city: "南京", note: "一把伞，两个人，距离刚好。" }
  ],
  media: [
    { type: "电影", title: "《怦然心动》", note: "适合一起窝着看。" },
    { type: "书", title: "《小王子》", note: "把温柔读得慢一点。" },
    { type: "音乐", title: "周末歌单", note: "散步、做饭、发呆都能播。" }
  ],
  plans: [
    { title: "一起拍一组春天照片", date: "这个周末", note: "找一条有花的小路。", done: false },
    { title: "做一次双人晚餐", date: "本月", note: "一人一道菜。", done: false },
    { title: "写一封手写信", date: "纪念日前", note: "藏进对方的包里。", done: false }
  ],
  wishes: [
    { title: "一起看一场海边日落", note: "等风慢一点的时候出发。" },
    { title: "养一只会撒娇的小猫", note: "给它取一个甜甜的名字。" },
    { title: "把每年纪念日都认真过", note: "不用隆重，但要真心。" }
  ],
  letters: [
    { text: "今天也要把温柔留给彼此一点点。" },
    { text: "想见面的时候，连风都像在替我跑腿。" },
    { text: "愿我们把普通日子过成可回看的小电影。" }
  ]
};

const state = {
  records: [],
  footprints: [],
  media: [],
  plans: [],
  wishes: [],
  letters: [],
  settings: { startDate: "2024-05-20" }
};

const panelAliases = { features: "overview", home: "overview", write: "records", letters: "letter" };
const panels = [...document.querySelectorAll("[data-panel-view]")];
const panelLinks = [...document.querySelectorAll("[data-panel-link]")];
const startDate = document.querySelector("#startDate");
const daysTogether = document.querySelector("#daysTogether");

document.querySelector("#recordDate").value = today;

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    ...extra
  };
}

async function supabaseRequest(path = "", options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: supabaseHeaders(options.headers)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function loadType(type) {
  const rows = await supabaseRequest(`?select=id,type,data,created_at&type=eq.${encodeURIComponent(type)}&order=created_at.desc`);
  return rows.map((row) => ({ id: row.id, ...row.data }));
}

async function insertItem(type, data) {
  const [row] = await supabaseRequest("", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ type, data })
  });
  return { id: row.id, ...row.data };
}

async function updateItem(type, id, data) {
  const [row] = await supabaseRequest(`?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ type, data })
  });
  return { id: row.id, ...row.data };
}

async function deleteItem(id) {
  await supabaseRequest(`?id=eq.${id}`, { method: "DELETE" });
}

async function initializeData() {
  try {
    const settingsRows = await loadType("settings");
    if (!settingsRows.length) {
      await Promise.all(Object.entries(defaults).flatMap(([type, items]) => items.map((item) => insertItem(type, item))));
      const settings = await insertItem("settings", { startDate: "2024-05-20", seeded: true });
      state.settings = settings;
    } else {
      state.settings = settingsRows[0];
    }

    await reloadAllTypes();
    startDate.value = state.settings.startDate || "2024-05-20";
    renderAll();
  } catch (error) {
    console.error(error);
    alert("云端数据连接失败。请先在 Supabase SQL Editor 运行 supabase-schema.sql 里的建表语句。");
    Object.assign(state, { ...defaults, settings: { startDate: "2024-05-20" } });
    startDate.value = "2024-05-20";
    renderAll();
  }
}

async function reloadAllTypes() {
  const [records, footprints, media, plans, wishes, letters] = await Promise.all([
    loadType("records"),
    loadType("footprints"),
    loadType("media"),
    loadType("plans"),
    loadType("wishes"),
    loadType("letters")
  ]);
  state.records = records;
  state.footprints = footprints;
  state.media = media;
  state.plans = plans;
  state.wishes = wishes;
  state.letters = letters;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(dateText) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(`${dateText}T00:00:00`));
}

function byDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function setPanel(panelName) {
  const normalized = panelAliases[panelName] || panelName || "overview";
  const nextPanel = panels.some((panel) => panel.dataset.panelView === normalized) ? normalized : "overview";
  panelLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.panelLink === nextPanel));
  panels.forEach((panel) => {
    const active = panel.dataset.panelView === nextPanel;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  window.history.replaceState(null, "", `#${nextPanel}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateDays() {
  const start = new Date(`${startDate.value}T00:00:00`);
  daysTogether.textContent = Math.max(0, Math.floor((new Date() - start) / 86400000));
  state.settings.startDate = startDate.value;
  if (state.settings.id) {
    state.settings = await updateItem("settings", state.settings.id, {
      startDate: state.settings.startDate,
      seeded: true
    });
  }
}

function itemActions(type, id) {
  return `
    <div class="item-actions">
      <button class="mini-button" type="button" data-action="edit" data-type="${type}" data-id="${id}">编辑</button>
      <button class="mini-button" type="button" data-action="delete" data-type="${type}" data-id="${id}">删除</button>
    </div>
  `;
}

function empty(text) {
  return `<p class="empty">${escapeHtml(text)}</p>`;
}

function renderRecords() {
  const sorted = byDateDesc(state.records);
  const recordCards = sorted.map((record) => `
    <article class="item-card">
      <header>
        <div>
          <span class="item-meta">${formatDate(record.date)}</span>
          <h3>${escapeHtml(record.title)}</h3>
        </div>
        ${itemActions("records", record.id)}
      </header>
      <p>${escapeHtml(record.note)}</p>
      <span class="tag">${record.favorite ? "高光 · " : ""}${escapeHtml(record.mood)}</span>
    </article>
  `).join("");

  document.querySelector("#recordsList").innerHTML = recordCards || empty("还没有记录，先写下第一条小事吧。");
  document.querySelector("#timelineList").innerHTML = recordCards || empty("时间线会按日期展示记录。");
  document.querySelector("#galleryList").innerHTML = sorted.map((record) => `
    <article class="item-card">
      <header>
        <div>
          <span class="item-meta">${formatDate(record.date)} · ${escapeHtml(record.mood)}</span>
          <h3>${escapeHtml(record.title)}</h3>
        </div>
        ${itemActions("records", record.id)}
      </header>
      <p>${escapeHtml(record.note)}</p>
    </article>
  `).join("") || empty("相册会自动展示你的记录。");
  document.querySelector("#recordCount").textContent = state.records.length;
  document.querySelector("#favoriteCount").textContent = state.records.filter((record) => record.favorite).length;
  document.querySelector("#latestMood").textContent = sorted[0]?.mood || "甜";
}

function renderFootprints() {
  renderMapPoints();
  renderCollection("footprints", "#footprintList", (item) => `
    <span class="item-meta">${escapeHtml(item.date)}</span>
    <h3>${escapeHtml(item.city || "未命名城市")}</h3>
    <p>${escapeHtml(item.note)}</p>
  `, "还没有足迹，先添加一个一起去过的城市吧。");
}

function normalizeCity(value) {
  return String(value || "").replace(/市$/, "").trim();
}

function projectChina(lon, lat) {
  return {
    x: 70 + ((lon - 73) / (135 - 73)) * 500,
    y: 365 - ((lat - 18) / (54 - 18)) * 300
  };
}

function renderMapPoints() {
  const cities = [...new Set(state.footprints.map((item) => normalizeCity(item.city)).filter(Boolean))];
  const mappedCities = cities.filter((city) => cityCoordinates[city]);
  document.querySelector("#litCityCount").textContent = mappedCities.length;
  document.querySelector("#mapPoints").innerHTML = mappedCities.map((city) => {
    const [lon, lat] = cityCoordinates[city];
    const { x, y } = projectChina(lon, lat);
    return `
      <g>
        <circle class="map-point" cx="${x}" cy="${y}" r="8"><title>${escapeHtml(city)}</title></circle>
        <text class="map-label" x="${x + 11}" y="${y - 8}">${escapeHtml(city)}</text>
      </g>
    `;
  }).join("");
}

function renderMedia() {
  renderCollection("media", "#mediaList", (item) => `
    <span class="item-meta">${escapeHtml(item.type)}</span>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.note)}</p>
  `, "还没有书影音，先添加一部想一起看的作品吧。");
}

function renderPlans() {
  renderCollection("plans", "#planList", (item) => `
    <span class="item-meta">${escapeHtml(item.date || "未定时间")}</span>
    <h3>${item.done ? "已完成 · " : ""}${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.note || "还没有备注。")}</p>
    <span class="tag">${item.done ? "完成" : "待完成"}</span>
  `, "还没有计划，先安排一件想一起做的事吧。");
}

function renderWishes() {
  renderCollection("wishes", "#wishList", (item) => `
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.note || "愿望已经写下来了。")}</p>
  `, "还没有愿望，先许一个小小的愿望吧。");
}

function renderLetters() {
  renderCollection("letters", "#letterList", (item) => `
    <h3>小纸条</h3>
    <p>${escapeHtml(item.text)}</p>
  `, "还没有小纸条，先写一句想说的话吧。");
  document.querySelector("#dailyLetter").textContent = state.letters[0]?.text || "今天也要把温柔留给彼此一点点。";
}

function renderCollection(type, selector, template, emptyText) {
  document.querySelector(selector).innerHTML = state[type].map((item) => `
    <article class="item-card">
      <header>
        <div>${template(item)}</div>
        ${itemActions(type, item.id)}
      </header>
    </article>
  `).join("") || empty(emptyText);
}

function renderAll() {
  renderRecords();
  renderFootprints();
  renderMedia();
  renderPlans();
  renderWishes();
  renderLetters();
  updateDays();
}

async function upsert(type, item) {
  const id = item.id;
  const data = { ...item };
  delete data.id;
  const saved = id ? await updateItem(type, id, data) : await insertItem(type, data);
  const index = state[type].findIndex((entry) => entry.id === saved.id);
  if (index >= 0) state[type][index] = saved;
  else state[type].unshift(saved);
  renderAll();
}

async function removeItem(type, id) {
  await deleteItem(id);
  state[type] = state[type].filter((item) => item.id !== id);
  renderAll();
}

function findItem(type, id) {
  return state[type].find((item) => item.id === id);
}

function resetRecordForm() {
  document.querySelector("#recordForm").reset();
  document.querySelector("#recordId").value = "";
  document.querySelector("#recordDate").value = today;
}

function resetSimpleForm(formId, idSelector) {
  document.querySelector(formId).reset();
  document.querySelector(idSelector).value = "";
}

document.querySelector("#recordForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsert("records", {
    id: document.querySelector("#recordId").value,
    title: document.querySelector("#recordTitle").value.trim(),
    date: document.querySelector("#recordDate").value,
    mood: document.querySelector("#recordMood").value,
    note: document.querySelector("#recordNote").value.trim(),
    favorite: document.querySelector("#recordFavorite").checked
  });
  resetRecordForm();
});

document.querySelector("#footprintForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsert("footprints", {
    id: document.querySelector("#footprintId").value,
    date: document.querySelector("#footprintDate").value.trim(),
    city: normalizeCity(document.querySelector("#footprintCity").value),
    note: document.querySelector("#footprintNote").value.trim()
  });
  resetSimpleForm("#footprintForm", "#footprintId");
});

document.querySelector("#mediaForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsert("media", {
    id: document.querySelector("#mediaId").value,
    type: document.querySelector("#mediaType").value.trim(),
    title: document.querySelector("#mediaTitle").value.trim(),
    note: document.querySelector("#mediaNote").value.trim()
  });
  resetSimpleForm("#mediaForm", "#mediaId");
});

document.querySelector("#planForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsert("plans", {
    id: document.querySelector("#planId").value,
    title: document.querySelector("#planTitle").value.trim(),
    date: document.querySelector("#planDate").value.trim(),
    note: document.querySelector("#planNote").value.trim(),
    done: document.querySelector("#planDone").checked
  });
  resetSimpleForm("#planForm", "#planId");
});

document.querySelector("#wishForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsert("wishes", {
    id: document.querySelector("#wishId").value,
    title: document.querySelector("#wishTitle").value.trim(),
    note: document.querySelector("#wishNote").value.trim()
  });
  resetSimpleForm("#wishForm", "#wishId");
});

document.querySelector("#letterForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  await upsert("letters", {
    id: document.querySelector("#letterId").value,
    text: document.querySelector("#letterText").value.trim()
  });
  resetSimpleForm("#letterForm", "#letterId");
});

document.body.addEventListener("click", async (event) => {
  const panelLink = event.target.closest("[data-panel-link]");
  if (panelLink) {
    event.preventDefault();
    setPanel(panelLink.dataset.panelLink);
    return;
  }
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;
  const { action, type, id } = actionButton.dataset;
  if (action === "delete") await removeItem(type, id);
  if (action === "edit") {
    fillForm(type, findItem(type, id));
    setPanel(type);
  }
});

function fillForm(type, item) {
  if (!item) return;
  if (type === "records") {
    document.querySelector("#recordId").value = item.id;
    document.querySelector("#recordTitle").value = item.title;
    document.querySelector("#recordDate").value = item.date;
    document.querySelector("#recordMood").value = item.mood;
    document.querySelector("#recordNote").value = item.note;
    document.querySelector("#recordFavorite").checked = Boolean(item.favorite);
  }
  if (type === "footprints") {
    document.querySelector("#footprintId").value = item.id;
    document.querySelector("#footprintDate").value = item.date;
    document.querySelector("#footprintCity").value = item.city || "";
    document.querySelector("#footprintNote").value = item.note;
  }
  if (type === "media") {
    document.querySelector("#mediaId").value = item.id;
    document.querySelector("#mediaType").value = item.type;
    document.querySelector("#mediaTitle").value = item.title;
    document.querySelector("#mediaNote").value = item.note;
  }
  if (type === "plans") {
    document.querySelector("#planId").value = item.id;
    document.querySelector("#planTitle").value = item.title;
    document.querySelector("#planDate").value = item.date || "";
    document.querySelector("#planNote").value = item.note || "";
    document.querySelector("#planDone").checked = Boolean(item.done);
  }
  if (type === "wishes") {
    document.querySelector("#wishId").value = item.id;
    document.querySelector("#wishTitle").value = item.title;
    document.querySelector("#wishNote").value = item.note || "";
  }
  if (type === "letters") {
    document.querySelector("#letterId").value = item.id;
    document.querySelector("#letterText").value = item.text;
  }
}

document.querySelector("#cancelRecordEdit").addEventListener("click", resetRecordForm);
document.querySelector("#cancelFootprintEdit").addEventListener("click", () => resetSimpleForm("#footprintForm", "#footprintId"));
document.querySelector("#cancelMediaEdit").addEventListener("click", () => resetSimpleForm("#mediaForm", "#mediaId"));
document.querySelector("#cancelPlanEdit").addEventListener("click", () => resetSimpleForm("#planForm", "#planId"));
document.querySelector("#cancelWishEdit").addEventListener("click", () => resetSimpleForm("#wishForm", "#wishId"));
document.querySelector("#cancelLetterEdit").addEventListener("click", () => resetSimpleForm("#letterForm", "#letterId"));

startDate.addEventListener("change", updateDays);
document.querySelector("#editStart").addEventListener("click", () => {
  startDate.showPicker?.();
  startDate.focus();
});

document.querySelector("#shuffleLetter").addEventListener("click", () => {
  if (!state.letters.length) return;
  const current = document.querySelector("#dailyLetter").textContent;
  const options = state.letters.filter((letter) => letter.text !== current);
  const next = options.length ? options[Math.floor(Math.random() * options.length)] : state.letters[0];
  document.querySelector("#dailyLetter").textContent = next.text;
});

initializeData().then(() => {
  setPanel(window.location.hash ? window.location.hash.slice(1) : "overview");
});
