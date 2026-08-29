// =========================================================
// ADMIN PANEL LOGIC
// =========================================================

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { auth, db, INVITATION_COLLECTION, INVITATION_DOC_ID } from "../js/firebase-config.js";
import { DEFAULT_DATA } from "../js/default-data.js";

const loginBox = document.getElementById("login-box");
const appSection = document.getElementById("app-section");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const errorMsg = document.getElementById("error-msg");
const form = document.getElementById("edit-form");
const statusBox = document.getElementById("status");
const saveBtn = document.getElementById("save-btn");

const infoCardsList = document.getElementById("info-cards-list");
const programList = document.getElementById("program-list");

const docRef = doc(db, INVITATION_COLLECTION, INVITATION_DOC_ID);

let currentData = null;

/* ---------------------------------------------------------
   AUTH
--------------------------------------------------------- */

const authStatus = document.getElementById("auth-status");

loginBtn.addEventListener("click", async () => {
  errorMsg.textContent = "";
  try {
    await signInWithEmailAndPassword(auth, emailInput.value.trim(), passwordInput.value);
  } catch (err) {
    // Firebase-in verdiyi dəqiq kodu göstəririk ki, səbəb aydın olsun
    // (məs. auth/user-not-found, auth/wrong-password, auth/invalid-credential,
    // auth/too-many-requests, auth/operation-not-allowed — provider aktiv deyil)
    errorMsg.textContent = "Giriş uğursuz: " + (err.code || err.message);
    console.error(err);
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginBox.style.display = "none";
    appSection.style.display = "block";
    authStatus.textContent = `Daxil olunub: ${user.email}`;
    await loadData();
  } else {
    loginBox.style.display = "block";
    appSection.style.display = "none";
    authStatus.textContent = "Giriş olunmayıb";
  }
});

/* ---------------------------------------------------------
   NESTED PATH HELPERS ("couple.groom" → obj.couple.groom)
--------------------------------------------------------- */

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function setNested(obj, path, value) {
  const keys = path.split(".");
  let target = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!target[keys[i]]) target[keys[i]] = {};
    target = target[keys[i]];
  }
  target[keys[keys.length - 1]] = value;
}

/* ---------------------------------------------------------
   ISO <-> datetime-local
--------------------------------------------------------- */

function isoToLocalInput(iso) {
  if (!iso) return "";
  return iso.length >= 16 ? iso.slice(0, 16) : iso;
}

function localInputToIso(value) {
  if (!value) return "";
  return value.length === 16 ? value + ":00" : value;
}

/* ---------------------------------------------------------
   LOAD
--------------------------------------------------------- */

const loadStatus = document.getElementById("load-status");

async function loadData() {
  statusBox.className = "";
  statusBox.textContent = "";
  loadStatus.textContent = "Data yüklənir...";
  loadStatus.style.color = "";

  try {
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      currentData = snap.data();
      const keyCount = Object.keys(currentData || {}).length;
      loadStatus.textContent = `Firestore-dan yükləndi (${keyCount} sahə).`;
    } else {
      currentData = structuredClone(DEFAULT_DATA);
      loadStatus.textContent = "⚠️ Firestore-da invitation/main sənədi tapılmadı — defolt data göstərilir.";
      loadStatus.style.color = "#a13a3a";
    }
  } catch (err) {
    console.error("Data yüklənmədi:", err);
    currentData = structuredClone(DEFAULT_DATA);
    loadStatus.textContent = "⚠️ Xəta: " + (err.code || err.message) + " — defolt data göstərilir.";
    loadStatus.style.color = "#a13a3a";
  }

  try {
    fillForm(currentData);
  } catch (err) {
    console.error("fillForm xətası:", err);
    loadStatus.textContent = "⚠️ Forma doldurularkən xəta: " + err.message;
    loadStatus.style.color = "#a13a3a";
  }
}

function fillForm(data) {

  // Sadə sahələr (data-path olan bütün input/textarea)
  form.querySelectorAll("[data-path]").forEach((el) => {
    const path = el.dataset.path;
    let value = getNested(data, path);

    if (path === "date.iso") {
      el.value = isoToLocalInput(value || "");
    } else {
      el.value = value ?? "";
    }
  });

  // Dinamik siyahılar
  renderInfoCards(data.ceremony?.infoCards || []);
  renderProgram(data.ceremony?.program || []);
}

/* ---------------------------------------------------------
   INFO CARDS (dinamik siyahı)
--------------------------------------------------------- */

function infoCardRowHTML(item = { label: "", value: "" }) {
  return `
    <div class="item-card" data-role="info-card">
      <button type="button" class="remove-btn" data-remove>✕</button>
      <label>Etiket (məs. TARİX)</label>
      <input type="text" data-field="label" value="${escapeAttr(item.label)}">
      <label>Dəyər (məs. 12 Sentyabr 2026)</label>
      <input type="text" data-field="value" value="${escapeAttr(item.value)}">
    </div>
  `;
}

function renderInfoCards(items) {
  infoCardsList.innerHTML = items.map(infoCardRowHTML).join("");
  bindRemoveButtons(infoCardsList);
}

document.getElementById("add-info-card").addEventListener("click", () => {
  infoCardsList.insertAdjacentHTML("beforeend", infoCardRowHTML());
  bindRemoveButtons(infoCardsList);
});

/* ---------------------------------------------------------
   PROGRAM (dinamik siyahı)
--------------------------------------------------------- */

function programRowHTML(item = { time: "", roman: "", title: "", desc: "" }) {
  return `
    <div class="item-card" data-role="program-item">
      <button type="button" class="remove-btn" data-remove>✕</button>
      <div class="row2">
        <div>
          <label>Saat (məs. 18:00)</label>
          <input type="text" data-field="time" value="${escapeAttr(item.time)}">
        </div>
        <div>
          <label>Nömrə (I, II, III...)</label>
          <input type="text" data-field="roman" value="${escapeAttr(item.roman)}">
        </div>
      </div>
      <label>Başlıq</label>
      <input type="text" data-field="title" value="${escapeAttr(item.title)}">
      <label>Təsvir</label>
      <textarea data-field="desc">${escapeHtml(item.desc)}</textarea>
    </div>
  `;
}

function renderProgram(items) {
  programList.innerHTML = items.map(programRowHTML).join("");
  bindRemoveButtons(programList);
}

document.getElementById("add-program-item").addEventListener("click", () => {
  programList.insertAdjacentHTML("beforeend", programRowHTML());
  bindRemoveButtons(programList);
});

/* ---------------------------------------------------------
   ORTAQ KÖMƏKÇİLƏR
--------------------------------------------------------- */

function bindRemoveButtons(container) {
  container.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.onclick = () => btn.closest(".item-card").remove();
  });
}

function escapeAttr(str) {
  return (str ?? "").toString().replace(/"/g, "&quot;");
}

function escapeHtml(str) {
  return (str ?? "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ---------------------------------------------------------
   SAVE
--------------------------------------------------------- */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  saveBtn.disabled = true;
  statusBox.className = "";
  statusBox.textContent = "";

  // Yazmazdan əvvəl aydın yoxlama: giriş yoxdursa, Firestore-a
  // heç müraciət etmirik — səbəbi birbaşa göstəririk.
  if (!auth.currentUser) {
    statusBox.className = "err";
    statusBox.textContent = "❌ Siz daxil olmamısınız (sessiya bitib). Səhifəni yeniləyib yenidən daxil olun.";
    saveBtn.disabled = false;
    return;
  }

  try {

    const data = currentData ? structuredClone(currentData) : {};

    // Sadə sahələr
    form.querySelectorAll("[data-path]").forEach((el) => {
      const path = el.dataset.path;
      const value = path === "date.iso" ? localInputToIso(el.value) : el.value;
      setNested(data, path, value);
    });

    // Info kartları
    const infoCards = [];
    infoCardsList.querySelectorAll('[data-role="info-card"]').forEach((row) => {
      infoCards.push({
        label: row.querySelector('[data-field="label"]').value,
        value: row.querySelector('[data-field="value"]').value
      });
    });
    if (!data.ceremony) data.ceremony = {};
    data.ceremony.infoCards = infoCards;

    // Proqram maddələri
    const program = [];
    programList.querySelectorAll('[data-role="program-item"]').forEach((row) => {
      program.push({
        time: row.querySelector('[data-field="time"]').value,
        roman: row.querySelector('[data-field="roman"]').value,
        title: row.querySelector('[data-field="title"]').value,
        desc: row.querySelector('[data-field="desc"]').value
      });
    });
    data.ceremony.program = program;

    await setDoc(docRef, data);

    currentData = data;

    statusBox.className = "ok";
    statusBox.textContent = "✅ Yadda saxlanıldı. Sayt açıq olanlarda dərhal yenilənəcək.";

  } catch (err) {
    console.error(err);
    statusBox.className = "err";
    if (err.code === "permission-denied") {
      statusBox.textContent =
        "❌ Firestore icazəni rədd etdi (permission-denied). " +
        "Siz giriş etmisiniz (" + auth.currentUser.email + "), " +
        "deməli problem Firestore Rules-dadır — Rules-un " +
        "'allow write: if request.auth != null;' olaraq Publish edildiyini yoxlayın, " +
        "və layihə ID-sinin (" + docRef.firestore.app.options.projectId + ") " +
        "Rules-u dəyişdiyiniz layihə ilə eyni olduğunu təsdiqləyin.";
    } else {
      statusBox.textContent = "❌ Xəta baş verdi: " + (err.code || err.message);
    }
  } finally {
    saveBtn.disabled = false;
  }
});
