// =========================================================
// RENDER
// Data obyektindən HTML sətirləri qurur. Class/ID adları
// orijinal dizaynla eynidir ki, css/style.css olduğu kimi
// işləsin.
// =========================================================

function buildGate(d){
  return `
    <div id="gate">
      <img
        id="invitation"
        src="${d.media.openingImage}"
        alt="Dəvətnaməni aç"
        draggable="false"
      >
      <video
        id="opening-video"
        playsinline
        webkit-playsinline
        preload="auto"
        muted
        disablepictureinpicture
        controlslist="nodownload nofullscreen noremoteplayback"
      >
        <source src="${d.media.openingVideo}" type="video/mp4">
      </video>
    </div>
  `;
}

function buildHero(d){
  return `
    <header id="hero">

      <video autoplay muted loop playsinline class="hero-video">
        <source src="${d.media.heroVideo}" type="video/mp4">
      </video>

      <div class="hero-overlay"></div>

      <div class="hero-content">

        <div class="outer-gold-border"></div>

        <div class="hero-top">

          <div class="premium-kicker">
            <span></span>
            <p>${d.couple.kicker}</p>
            <span></span>
          </div>

          <p class="premium-script">${d.couple.scriptTop}</p>

          <h1 class="premium-names">
            <span class="premium-name">${d.couple.groom}</span>
            <span class="premium-amp">&amp;</span>
            <span class="premium-name">${d.couple.bride}</span>
          </h1>

          <div class="premium-ornament">
            <span></span>
            <b>✦</b>
            <span></span>
          </div>

        </div>

        <div class="premium-bottom">

          <div class="countdown">
            <div class="cd-box">
              <span class="cd-num" id="cd-days">00</span>
              <span class="cd-label">Gün</span>
            </div>
            <div class="cd-box">
              <span class="cd-num" id="cd-hours">00</span>
              <span class="cd-label">Saat</span>
            </div>
            <div class="cd-box">
              <span class="cd-num" id="cd-min">00</span>
              <span class="cd-label">Dəqiqə</span>
            </div>
            <div class="cd-box">
              <span class="cd-num" id="cd-sec">00</span>
              <span class="cd-label">Saniyə</span>
            </div>
          </div>

          <div class="premium-date">
            <div class="date-item">
              <strong>${d.date.day}</strong>
              <small>${d.date.month}</small>
            </div>
            <div class="date-separator"></div>
            <div class="date-item">
              <strong>${d.date.year}</strong>
              <small>${d.date.weekday}</small>
            </div>
          </div>

          <p class="premium-waiting">Sizi gözləyirik!</p>

          <div class="premium-heart">❦</div>

          <div class="premium-location">
            <span>SAAT</span>
            <b>${d.date.time}</b>
            <i>•</i>
            <span>MƏKAN</span>
            <b>${d.date.locationShort}</b>
          </div>

        </div>

      </div>

    </header>
  `;
}

function buildInfoCard(card){
  return `
    <div class="luxury-card">
      <div class="card-icon"><span>✦</span></div>
      <div class="card-label">${card.label}</div>
      <div class="card-value">${card.value}</div>
    </div>
  `;
}

function buildProgramItem(item, index, total){
  const isLast = index === total - 1;
  return `
    <div class="program-item${isLast ? " last" : ""}">
      <div class="program-time">${item.time}</div>
      <div class="program-center">
        <div class="diamond"></div>
        ${isLast ? "" : `<div class="vertical-line"></div>`}
      </div>
      <div class="program-card">
        <div class="program-number">${item.roman}</div>
        <div>
          <h3>${item.title}</h3>
          <p>${item.desc}</p>
        </div>
      </div>
    </div>
  `;
}

function buildCeremony(d){
  return `
    <section class="luxury-ceremony scroll-reveal" id="ceremony">

      <div class="luxury-orb orb-1"></div>
      <div class="luxury-orb orb-2"></div>

      <div class="ceremony-inner">

        <div class="ceremony-title">
          <div class="flower-line">
            <span>✦</span>
            <b>❀</b>
            <span>✦</span>
          </div>
          <div class="small-title">${d.ceremony.kicker}</div>
          <h2>${d.ceremony.title}</h2>
          <div class="title-line">
            <i></i>
            <span>✦</span>
            <i></i>
          </div>
        </div>

        <div class="luxury-info">
          ${d.ceremony.infoCards.map(buildInfoCard).join("")}
        </div>

        <div class="program">
          ${d.ceremony.program.map((item, i) => buildProgramItem(item, i, d.ceremony.program.length)).join("")}
        </div>

        <div class="bottom-decoration">
          <span>❦</span>
          <p>${d.ceremony.closingLine}</p>
          <span>❦</span>
        </div>

      </div>

    </section>
  `;
}

function buildRSVP(d){
  return `
    <section class="rsvp-section scroll-reveal" id="rsvp">

      <p class="eyebrow">${d.rsvp.deadlineLabel}</p>

      <h2 class="section-title">${d.rsvp.title}</h2>

      <div class="rsvp-card">

        <p class="rsvp-question">${d.rsvp.question}</p>

        <div class="rsvp-buttons">
          <button type="button" class="rsvp-choice yes" data-rsvp="yes">
            <span class="rsvp-icon">✓</span>
            <span>${d.rsvp.yesLabel}</span>
          </button>
          <button type="button" class="rsvp-choice no" data-rsvp="no">
            <span class="rsvp-icon">♡</span>
            <span>${d.rsvp.noLabel}</span>
          </button>
        </div>

      </div>

    </section>
  `;
}

function buildMap(d){
  return `
    <section class="details-section scroll-reveal" id="details">
      <p class="eyebrow">${d.map.eyebrow}</p>
      <h2 class="section-title">${d.map.title}</h2>
      <a href="${d.map.url}" class="learn-more" target="_blank" rel="noopener noreferrer">
                Google Maps - Klik edin 
      </a>
    </section>
  `;
}

function buildFooter(d){
  return `
    <footer class="footer image-reveal-0">
      <p class="footer-script">${d.footer.script}</p>
      <p class="footer-names">${d.couple.groom} &amp; ${d.couple.bride}</p>
    </footer>
  `;
}

function buildMusicWidget(d){
  return `
    <button id="music-toggle" aria-label="Musiqini aç və bağla" aria-pressed="false">

      <svg id="icon-muted" class="note-icon" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 17V5.5L20 3v11.5" />
        <circle cx="6.5" cy="17" r="2.5" />
        <circle cx="17.5" cy="14.5" r="2.5" />
        <line x1="3" y1="3" x2="21" y2="21" stroke="#b5563f" />
      </svg>

      <span id="icon-playing" class="note-icon is-hidden">
        <span class="eq-bars"><i></i><i></i><i></i></span>
      </span>

    </button>

    <audio id="bg-music" loop preload="none">
      <source src="${d.media.music}" type="audio/mp3">
    </audio>
  `;
}

export function buildPageHTML(d){
  return [
    buildGate(d),
    buildHero(d),
    buildCeremony(d),
    buildRSVP(d),
    buildMap(d),
    buildFooter(d),
    buildMusicWidget(d)
  ].join("");
}
