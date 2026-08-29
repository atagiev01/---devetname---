// =========================================================
// BEHAVIOR
// Render olunmuş DOM üzərində bütün interaktivliyi qurur.
// Hər dəfə yenidən render olunanda (Firestore-dan yeni data
// gələndə) təzədən çağrılır.
// =========================================================

let revealObserver = null;

export function attachBehavior(d){

  setupOpeningGate();
  setupCountdown(d.date.iso);
  setupRSVP(d.rsvp);
  setupScrollReveal();
  setupMusicToggle();
  setupParallax();
}

/* ---------------------------------------------------------
   OPENING GATE
--------------------------------------------------------- */

function setupOpeningGate(){

  const gate = document.getElementById("gate");
  const invitation = document.getElementById("invitation");
  const openingVideo = document.getElementById("opening-video");

  if(!gate || !invitation || !openingVideo) return;

  let started = false;

  invitation.addEventListener("click", () => {

    if(started) return;
    started = true;

    invitation.style.display = "none";
    openingVideo.style.display = "block";

    openingVideo.currentTime = 0;
    openingVideo.playbackRate = 2;

    const music = document.getElementById("bg-music");
    if(music){
      music.volume = 0.7;
      music.play().then(setMusicPlayingState).catch(() => {
        console.log("Musiqi avtomatik başlaya bilmədi.");
        setMusicPausedState();
      });
    }

    const playPromise = openingVideo.play();
    if(playPromise){
      playPromise.catch(() => {
        console.log("Video avtomatik başlaya bilmədi.");
      });
    }

  });

  const finishOpening = () => {
    gate.classList.add("gate-hidden");
    setTimeout(() => { gate.style.display = "none"; }, 1000);
  };

  openingVideo.addEventListener("ended", finishOpening);

  openingVideo.addEventListener("error", () => {
    console.warn("Açılış videosu yüklənmədi.");
    gate.classList.add("gate-hidden");
    setTimeout(() => { gate.style.display = "none"; }, 1000);
  });
}

/* ---------------------------------------------------------
   COUNTDOWN
--------------------------------------------------------- */

let countdownInterval = null;

function setupCountdown(isoDate){

  const targetDate = new Date(isoDate).getTime();

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minEl = document.getElementById("cd-min");
  const secEl = document.getElementById("cd-sec");

  if(!daysEl || !hoursEl || !minEl || !secEl) return;

  function update(){

    const difference = Math.max(targetDate - Date.now(), 0);

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minEl.textContent = String(minutes).padStart(2, "0");
    secEl.textContent = String(seconds).padStart(2, "0");
  }

  update();

  if(countdownInterval) clearInterval(countdownInterval);
  countdownInterval = setInterval(update, 1000);
}

/* ---------------------------------------------------------
   RSVP → WHATSAPP
--------------------------------------------------------- */

function setupRSVP(rsvpData){

  const buttons = document.querySelectorAll("[data-rsvp]");

  buttons.forEach(btn => {

    btn.addEventListener("click", () => {

      const answer = btn.dataset.rsvp === "yes"
        ? `Bəli, toyda iştirak edəcəyəm 🎉`
        : `Xeyr, təəssüf ki, iştirak edə bilməyəcəyəm`;

      const message =
        "Salam! 💌\n\n" +
        "Toy dəvətnaməsinə cavabım:\n\n" +
        answer;

      const whatsappURL =
        "https://wa.me/" + rsvpData.whatsappNumber +
        "?text=" + encodeURIComponent(message);

      window.open(whatsappURL, "_blank", "noopener,noreferrer");

    });

  });
}

/* ---------------------------------------------------------
   SCROLL REVEAL
--------------------------------------------------------- */

function setupScrollReveal(){

  if(revealObserver){
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  document
    .querySelectorAll(".luxury-card, .program-card, .rsvp-card, .section-title")
    .forEach(el => {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
}

/* ---------------------------------------------------------
   MUSIC TOGGLE
--------------------------------------------------------- */

function setMusicPlayingState(){
  const btn = document.getElementById("music-toggle");
  const iconMuted = document.getElementById("icon-muted");
  const iconPlaying = document.getElementById("icon-playing");
  if(!btn) return;

  btn.classList.add("is-playing");
  iconMuted?.classList.add("is-hidden");
  iconPlaying?.classList.remove("is-hidden");
  btn.setAttribute("aria-pressed", "true");
  btn.setAttribute("aria-label", "Musiqini dayandır");
}

function setMusicPausedState(){
  const btn = document.getElementById("music-toggle");
  const iconMuted = document.getElementById("icon-muted");
  const iconPlaying = document.getElementById("icon-playing");
  if(!btn) return;

  btn.classList.remove("is-playing");
  iconMuted?.classList.remove("is-hidden");
  iconPlaying?.classList.add("is-hidden");
  btn.setAttribute("aria-pressed", "false");
  btn.setAttribute("aria-label", "Musiqini başlat");
}

function setupMusicToggle(){

  const musicButton = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-music");

  if(!musicButton || !audio) return;

  setMusicPausedState();

  musicButton.addEventListener("click", async () => {
    try{
      if(audio.paused){
        await audio.play();
        setMusicPlayingState();
      }else{
        audio.pause();
        setMusicPausedState();
      }
    }catch(error){
      console.warn("Musiqi oxudulmadı:", error);
      setMusicPausedState();
    }
  });
}




function setupParallax() {
  try {
    const hero = document.getElementById("hero");
    const heroContent = document.getElementById("parallax-hero") || document.querySelector(".hero-content");
    const heroVideo = document.querySelector(".hero-video");

    // Skroll konteynerini tapırıq
    const scrollContainer =
      document.querySelector(".invitation-card") ||
      document.getElementById("slider-container") ||
      window;

    if (!hero || !heroContent || !heroVideo) return;

    let ticking = false;

    function updateParallax() {
      const scrollY =
        scrollContainer === window
          ? window.scrollY
          : scrollContainer.scrollTop;

      const heroHeight = hero.offsetHeight;

      if (scrollY <= heroHeight) {
        const videoY = scrollY * 0.35;
        const contentY = scrollY * 0.15;
        const opacity = Math.max(1 - scrollY / (heroHeight * 0.75), 0);
        const scale = Math.max(1 - scrollY * 0.00015, 0.92);

        heroVideo.style.transform = `translate3d(0, ${videoY}px, 0)`;
        heroContent.style.transform = `translate3d(0, ${contentY}px, 0) scale(${scale})`;
        heroContent.style.opacity = opacity;
      }

      ticking = false;
    }

    scrollContainer.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateParallax();
  } catch (error) {
    console.warn("Parallaks başladılarkən xəta yarandı, lakin səhifə davam edir:", error);
  }
}