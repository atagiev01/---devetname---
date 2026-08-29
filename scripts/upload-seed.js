// =========================================================
// BİR DƏFƏLİK SKRİPT
// data/firestore-document.json faylını Firestore-a yükləyir.
//
// İSTİFADƏ:
//   1) npm install firebase-admin
//   2) Firebase Console → Project settings → Service accounts
//      → "Generate new private key" → endirdiyiniz faylı
//      bu qovluğa "service-account.json" adı ilə qoyun
//   3) node scripts/upload-seed.js
// =========================================================

const admin = require("firebase-admin");
const data = require("../data/firestore-document.json");
const serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

db.collection("invitation")
  .doc("main")
  .set(data)
  .then(() => {
    console.log("✅ Data uğurla Firestore-a yükləndi: invitation/main");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Xəta:", error);
    process.exit(1);
  });
