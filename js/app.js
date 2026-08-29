// =========================================================
// APP
// Firestore-a real-vaxt qoşulur (onSnapshot). Sənəd
// dəyişən kimi (Firebase Console-dan redaktə etsəniz belə)
// sayt avtomatik yenidən qurulur — səhifəni yeniləmək
// lazım deyil.
// =========================================================

import { onSnapshot, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { db, INVITATION_COLLECTION, INVITATION_DOC_ID } from "./firebase-config.js";
import { DEFAULT_DATA } from "./default-data.js";
import { buildPageHTML } from "./render.js";
import { attachBehavior } from "./behavior.js";

const appRoot = document.getElementById("app");
const loadingScreen = document.getElementById("app-loading");

function render(data) {
  try {
    document.title = `${data.couple?.groom || ''} və ${data.couple?.bride || ''} — Toy Dəvətnaməsi`;

    appRoot.innerHTML = buildPageHTML(data);

    // İnteraktivlik və parallaksı təhlükəsiz çağırırıq
    attachBehavior(data);
  } catch (err) {
    console.error("Behavior qoşularkən xəta baş verdi:", err);
  } finally {
    // Xəta olsa belə yüklənmə ekranını mütləq gizlədirik!
    loadingScreen?.classList.add("is-hidden");
  }
}
// Sağ klik menyusunu bağlayır
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Qısayol düymələrini (F12, Ctrl+Shift+I, Ctrl+U və s.) bloklayır
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.ctrlKey && e.key === 'U') ||
      (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'U')) // Mac üçün
    ) {
      e.preventDefault();
      return false;
    }
  });
// İlk anda boş görünməsin deyə defolt data ilə göstəririk,
// Firestore cavab verən kimi üzərinə yazılır.
render(DEFAULT_DATA);

const invitationRef = doc(db, INVITATION_COLLECTION, INVITATION_DOC_ID);

onSnapshot(
  invitationRef,
  (snapshot) => {
    if(snapshot.exists()){
      render(snapshot.data());
    }else{
      console.warn(`Firestore-da "${INVITATION_COLLECTION}/${INVITATION_DOC_ID}" sənədi tapılmadı — defolt data göstərilir.`);
    }
  },
  (error) => {
    console.error("Firestore dinləyicisində xəta:", error);
    // Xəta olsa belə defolt data artıq ekrandadır, sayt boş qalmır.
  }
);
