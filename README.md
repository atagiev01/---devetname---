# Toy Dəvətnaməsi — Firebase ilə idarə olunan versiya

## Necə işləyir?

- `index.html` demək olar ki, boşdur — sadəcə bir `<div id="app">` var.
- `js/app.js` Firebase Firestore-a qoşulur, `invitation/main` sənədini
  **real vaxtda** dinləyir (`onSnapshot`) və gələn data ilə bütün
  səhifəni JS vasitəsilə qurur (`js/render.js`).
- Siz Firebase Console-da (və ya kod vasitəsilə) `invitation/main`
  sənədindəki hər hansı sahəni (ad, tarix, proqram, link və s.)
  dəyişən kimi, sayt açıq olan istifadəçilərdə **avtomatik**,
  səhifəni yeniləmədən yenilənir.
- Şəkil/video/musiqi faylları Firebase Storage-də saxlanılır, Firestore
  sənədində isə yalnız onların URL-ləri olur.

---

## 1-ci addım — Firebase layihəsi yaratmaq

1. https://console.firebase.google.com ünvanına daxil olun.
2. **"Add project" / "Layihə əlavə et"** düyməsinə basın, ada verin
   (məsələn `asim-sevinc-toy`), addımları tamamlayın.
3. Sol menyudan **Build → Firestore Database** seçin →
   **"Create database"** → istehsalat rejimi (production mode) →
   sizə ən yaxın regionu seçin.
4. Sol menyudan **Build → Storage** seçin → **"Get started"**.

## 2-ci addım — Web tətbiqi qeydiyyatdan keçirmək (config almaq)

1. Layihənin ana səhifəsində **"</>" (Web)** ikonuna basın.
2. Tətbiqə ad verin (məsələn `toy-sayti`), **"Register app"**.
3. Sizə göstərilən `firebaseConfig` obyektini kopyalayın.
4. `js/firebase-config.js` faylını açın və `firebaseConfig`
   dəyərlərini öz məlumatlarınızla əvəz edin.

## 3-cü addım — Firestore təhlükəsizlik qaydaları

Test mərhələsində (yalnız siz oxuyub-yazacaqsınız, ictimaiyyət isə
yalnız oxuyacaq) **Firestore → Rules** bölməsinə bunu yazın:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invitation/{docId} {
      allow read: if true;
      allow write: if false; // yalnız Console/Admin SDK-dan yazılsın
    }
  }
}
```

Bu qayda ilə saytı görən hər kəs məlumatı **oxuya bilər**, amma heç kim
brauzerdən **yaza bilməz** — siz isə Firebase Console-dan həmişə
yaza bilərsiniz.

## 4-cü addım — Media fayllarını Storage-ə yükləmək

1. **Storage** bölməsinə keçin → **"Upload file"**.
2. `hero-video-BkP1eoiB.mp4`, `i.mp3`, `acilmamis_devetname.png`,
   `presentational-3 kopyası.mov` fayllarını yükləyin.
3. Hər faylın üstünə klikləyib **"Access token"** ilə açıq (public)
   URL-i kopyalayın (və ya faylı public edib `getDownloadURL` istifadə
   edin).
4. Bu URL-ləri `data/firestore-document.json` faylındakı
   `media.openingImage`, `media.openingVideo`, `media.heroVideo`,
   `media.music` sahələrinə yazın.

## 5-ci addım — İlk datanı Firestore-a yükləmək

İki üsuldan birini seçin:

**A) Skriptlə (tövsiyə olunur, tək dəfə edilir):**

```bash
npm install firebase-admin
```

Firebase Console → **Project settings → Service accounts** →
**"Generate new private key"** → endirdiyiniz faylı
`scripts/service-account.json` adı ilə saxlayın, sonra:

```bash
node scripts/upload-seed.js
```

**B) Əl ilə Firestore Console-dan:**

`invitation` kolleksiyası, `main` sənədi yaradıb, hər sahəni
(`couple`, `date`, `media`, `ceremony`, `rsvp`, `map`, `footer`)
**Map** tipi kimi, içindəkiləri isə `data/firestore-document.json`
faylına baxaraq əl ilə daxil edin. (Skript üsulu daha rahatdır.)

## 6-cı addım — Datanı dəyişmək (toydan sonra da, istənilən vaxt)

Firebase Console → Firestore Database → `invitation` → `main`
sənədinə daxil olub istənilən sahəni redaktə edin və saxlayın.
Sayt açıq olan bütün istifadəçilərdə dəyişiklik **dərhal** görünəcək.

## 7-ci addım — Admin Panel (`/admin`)

Məlumatları Firestore Console-a girmədən, sadə formla dəyişmək üçün
`/admin/index.html` səhifəsi var. Bunu işə salmaq üçün:

1. Firebase Console → **Build → Authentication** → **Get started**
2. **"Email/Password"** provayderini seçin → **Enable** → Save
3. **Users** tabı → **"Add user"** → özünüzə e-poçt/şifrə yaradın
   (bu, admin panelə giriş məlumatınız olacaq)
4. Firestore → **Rules** tabına keçib bunu yazın və **Publish** edin:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invitation/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Bundan sonra saytın `/admin` ünvanına gedib (məs.
`https://sizin-saytiniz.vercel.app/admin`) yaratdığınız e-poçt/şifrə
ilə daxil olub formu dolduraraq **"Yadda saxla"** basmaqla məlumatları
dəyişə bilərsiniz. Yalnız giriş etmiş istifadəçi (siz) yaza bilər —
kənar adam formu görsə belə, Firestore yazmanı rədd edəcək.

## 8-ci addım — Saytı yerləşdirmək (hosting)

### Seçim A — Vercel (tövsiyə olunur)

1. https://vercel.com hesabınıza daxil olun (GitHub ilə qeydiyyat rahatdır)
2. **"Add New" → "Project"** basın
3. Bu layihə qovluğunu GitHub-a yükləyib oradan idxal edin, **və ya**
   Vercel CLI ilə birbaşa:
   ```bash
   npm install -g vercel
   cd toy-devetname   # layihənin kök qovluğu
   vercel
   ```
4. Vercel sualları soruşacaq (layihə adı və s.) — defolt cavablarla
   davam edin. Bu statik sayt olduğu üçün build əmri lazım deyil.
5. Deploy bitəndə Vercel sizə bir URL verəcək (məs.
   `https://toy-devetname.vercel.app`). Əsas sayt bu ünvanda, admin
   panel isə `/admin` yolunda olacaq.
6. Domeninizi bağlamaq istəsəniz, Vercel layihəsinin **Settings →
   Domains** bölməsindən edə bilərsiniz.

### Seçim B — Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # public qovluq: bu layihənin kök qovluğu
firebase deploy
```

---

## Fayl strukturu

```
index.html                     ← boş skelet, yalnız #app div-i
css/style.css                  ← orijinal dizayn (dəyişməyib)
js/firebase-config.js          ← Firebase config + init (BURANI DOLDURUN)
js/default-data.js             ← Firestore cavab verənə qədər göstərilən ehtiyat data
js/render.js                   ← data → HTML şablonları
js/behavior.js                 ← countdown, RSVP, musiqi, scroll-reveal, parallax
js/app.js                      ← Firestore-a qoşulma və orkestrasiya
data/firestore-document.json   ← nümunə/seed sənəd
scripts/upload-seed.js         ← seed sənədi Firestore-a yükləyən skript
```
# ---devetname---
