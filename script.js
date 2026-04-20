/* =========================
   SPLASH SCREEN
========================= */

const SPLASH_TIME = 4300;

function closeSplash() {
  const splash = document.getElementById("splash");
  if (!splash) {
    document.body.classList.remove("splash-active");
    document.body.classList.add("loaded");
    return;
  }

  splash.classList.add("hide");
  splash.setAttribute("aria-hidden", "true");
  document.body.classList.remove("splash-active");
  document.body.classList.add("loaded");
}

window.addEventListener("load", () => {
  setTimeout(closeSplash, SPLASH_TIME);
});

window.addEventListener("pageshow", () => {
  const splash = document.getElementById("splash");
  if (document.body.classList.contains("loaded") && splash) {
    splash.classList.add("hide");
    splash.setAttribute("aria-hidden", "true");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSplash();
});

function openTab(tabId, btn) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  const target = document.getElementById(tabId);
  if (target) target.classList.add("active");

  document.querySelectorAll(".menu-item").forEach((b) => b.classList.remove("active"));

  const archiveRelatedTabs = ["archivero", "detalle-pais"];
  const galleryRelatedTabs = ["galeria"];

  if (archiveRelatedTabs.includes(tabId)) {
    const archiveBtn = document.querySelector('.menu-item[data-tab="archivero"]');
    if (archiveBtn) archiveBtn.classList.add("active");
  } else if (galleryRelatedTabs.includes(tabId)) {
    const galleryBtn = document.querySelector('.menu-item[data-tab="galeria"]');
    if (galleryBtn) galleryBtn.classList.add("active");
  } else if (btn) {
    btn.classList.add("active");
  }

  const cameraIframe = document.getElementById("camera-iframe");
  if (cameraIframe) {
    if (tabId === "camara") {
      if (!cameraIframe.dataset.loaded) {
        cameraIframe.src = "ar.html";
        cameraIframe.dataset.loaded = "true";

        cameraIframe.onload = () => {
          if (cameraIframe.contentWindow) {
            cameraIframe.contentWindow.postMessage(
              { type: "SET_AR_FILTER", filter: currentARFilter },
              window.location.origin
            );
          }
        };
      }
    } else {
      cameraIframe.src = "";
      delete cameraIframe.dataset.loaded;
    }
  }

  if (tabId === "galeria") {
    renderGallery();
  }

  if (tabId === "trivia") {
    quizResumeIfNeeded();
  } else {
    quizPauseTimer();
  }
}

/* =========================
   ARCHIVO DE SELECCIONES
========================= */

const countryArchiveData = {
  mx: {
    name: "México",
    code: "MX",
    confederation: "CONCACAF",
    nickname: "El Tri",
    model: "balon.glb",
    arMarker: "mexico.patt",
    slogan: "Pasión local, historia mundialista y presión de jugar en casa.",
    summary:
      "México será uno de los grandes focos del Mundial 2026. En el archivo AR, su perfil puede representar sede, identidad visual, fuerza histórica y el simbolismo de jugar nuevamente como anfitrión.",
    relatedVenue: "Estadio Azteca",
    style: "Intensidad, posesión por tramos, presión emocional y juego vertical en momentos clave.",
    notableFact: "Será parte de la organización del Mundial 2026 y el Estadio Azteca volverá a ser un escenario histórico.",
    arInfo:
      "Al escanear el marcador de México, puedes mostrar el modelo asociado, información del país, historia como anfitrión y narrativa del Mundial 2026.",
    stats: [
      ["Rol en 2026", "Anfitrión"],
      ["Escenario clave", "Ciudad de México"],
      ["Modelo AR", "Balón / símbolo visual"],
      ["Enfoque del archivo", "Historia, sede y cultura futbolera"]
    ],
    features: [
      ["Fortaleza", "Ambiente local"],
      ["Identidad", "Tradición mundialista"],
      ["Tema visual", "Verde, energía y estadio"]
    ],
    timeline: [
      ["1970", "México fue sede de una Copa del Mundo histórica."],
      ["1986", "Volvió a ser anfitrión y quedó ligado para siempre a grandes momentos del torneo."],
      ["2026", "Regresa como parte de la sede compartida y como uno de los centros narrativos del evento."]
    ],
    gallery: [
      "Escudo conceptual de la selección",
      "Estadio Azteca versión archivo",
      "Afición y mosaico de color"
    ],
    pixelart: `
███   ███ ███████
█  █ █  █ █
█   █   █ █████
█       █ █
█       █ ███████
`
  },

  jp: {
    name: "Japón",
    code: "JP",
    confederation: "AFC",
    nickname: "Samuráis Azules",
    model: "trofeo.glb",
    arMarker: "japon.patt",
    slogan: "Precisión táctica, velocidad y disciplina competitiva.",
    summary:
      "Japón es una selección asociada a organización, velocidad y crecimiento internacional. En el archivo 2026 puede mostrarse como un país de evolución constante y mentalidad táctica.",
    relatedVenue: "Archivo internacional / selección visitante",
    style: "Presión coordinada, movilidad, circulación rápida y estructura colectiva.",
    notableFact: "Es una de las selecciones asiáticas más consistentes en torneos internacionales modernos.",
    arInfo:
      "El marcador AR de Japón puede activar un modelo con giro 360° y una ficha enfocada en disciplina, ritmo y cultura futbolística.",
    stats: [
      ["Rol en 2026", "Selección invitada al gran archivo"],
      ["Zona", "Asia"],
      ["Modelo AR", "Trofeo / pieza de honor"],
      ["Enfoque del archivo", "Disciplina y desarrollo"]
    ],
    features: [
      ["Fortaleza", "Orden táctico"],
      ["Identidad", "Velocidad"],
      ["Tema visual", "Azul, pulso y geometría"]
    ],
    timeline: [
      ["Décadas recientes", "Japón consolidó una presencia internacional cada vez más fuerte."],
      ["Mundiales modernos", "Mostró una identidad táctica reconocible y competitiva."],
      ["2026", "Puede llegar como una selección con madurez, disciplina y aspiraciones altas."]
    ],
    gallery: [
      "Panel de energía azul",
      "Mapa táctico en movimiento",
      "Archivo de modelo AR japonés"
    ],
    pixelart: `
█████  ██████
   █   █   █
  █    █████
 █     █
█████  █
`
  },

  tn: {
    name: "Túnez",
    code: "TN",
    confederation: "CAF",
    nickname: "Las Águilas de Cartago",
    model: "jugador.glb",
    arMarker: "tunez.patt",
    slogan: "Orgullo africano, resistencia y carácter competitivo.",
    summary:
      "Túnez puede presentarse en tu archivo como una selección con identidad fuerte, orden defensivo y enorme valor simbólico dentro del fútbol africano.",
    relatedVenue: "Archivo internacional / selección visitante",
    style: "Disciplina, bloque compacto, esfuerzo continuo y respuestas rápidas en transición.",
    notableFact: "Es una selección con presencia reconocible dentro del panorama africano y mundialista.",
    arInfo:
      "El marcador AR de Túnez puede mostrar un jugador 3D acompañado de una ficha directa, fuerte y muy visual.",
    stats: [
      ["Rol en 2026", "Selección internacional"],
      ["Zona", "África"],
      ["Modelo AR", "Jugador"],
      ["Enfoque del archivo", "Carácter y resistencia"]
    ],
    features: [
      ["Fortaleza", "Orden"],
      ["Identidad", "Resiliencia"],
      ["Tema visual", "Rojo, blanco y energía"]
    ],
    timeline: [
      ["Etapas mundialistas", "Túnez ha sido parte del relato competitivo africano."],
      ["Ciclos recientes", "Ha mostrado disciplina y compromiso defensivo."],
      ["2026", "Su archivo puede enfocarse en lucha, orgullo y representación continental."]
    ],
    gallery: [
      "Escena de concentración",
      "Tarjeta roja y blanca del archivo",
      "Perfil de jugador AR"
    ],
    pixelart: `
███████ ███   █
   █    █  █  █
   █    █   █ █
   █    █    ██
`
  },

  sa: {
    name: "Sudáfrica",
    code: "SA",
    confederation: "CAF",
    nickname: "Bafana Bafana",
    model: "sudafrica.glb",
    arMarker: "sudafrica.patt",
    slogan: "Memoria de 2010, diversidad visual y legado continental.",
    summary:
      "Sudáfrica puede funcionar como una de las páginas más visuales de tu archivo. Tiene un peso simbólico muy fuerte por su relación con el Mundial 2010 y la historia del fútbol africano.",
    relatedVenue: "Legado del Mundial 2010",
    style: "Ritmo, energía colectiva y fuerte valor cultural dentro del relato futbolístico.",
    notableFact: "Sudáfrica fue sede del Mundial 2010, el primero celebrado en África.",
    arInfo:
      "El marcador de Sudáfrica puede activar una ficha muy visual enfocada en legado, cultura, color y memoria mundialista.",
    stats: [
      ["Rol en 2026", "Selección de archivo histórico"],
      ["Zona", "África"],
      ["Modelo AR", "Modelo sudafrica.glb"],
      ["Enfoque del archivo", "Legado 2010"]
    ],
    features: [
      ["Fortaleza", "Impacto cultural"],
      ["Identidad", "Color y herencia"],
      ["Tema visual", "Energía multicolor"]
    ],
    timeline: [
      ["2010", "Sudáfrica fue anfitriona del primer Mundial africano."],
      ["Legado", "Su identidad quedó ligada a una de las ediciones más recordadas."],
      ["2026", "En tu archivo puede representar memoria, diversidad y narrativa visual."]
    ],
    gallery: [
      "Legado visual de 2010",
      "Tarjeta de color africano",
      "Escena AR del modelo sudafricano"
    ],
    pixelart: `
██████  █████
█       █   █
████    █████
█       █  █
██████  █   █
`
  },

  se: {
    name: "Suecia",
    code: "SE",
    confederation: "UEFA",
    nickname: "Blågult",
    model: "suecia.glb",
    arMarker: "suecia.patt",
    slogan: "Historia europea, potencia física y tradición competitiva.",
    summary:
      "Suecia aporta una dimensión clásica al archivo. Puede presentarse como una selección histórica con identidad fuerte, pasado mundialista y perfil robusto.",
    relatedVenue: "Archivo internacional / tradición europea",
    style: "Juego físico, orden, duelos intensos y construcción sobria.",
    notableFact: "Suecia fue subcampeona del Mundial de 1958.",
    arInfo:
      "El marcador de Suecia puede enseñar un modelo sobrio con enfoque histórico y datos de legado mundialista.",
    stats: [
      ["Rol en 2026", "Selección de tradición"],
      ["Zona", "Europa"],
      ["Modelo AR", "Modelo suecia.glb"],
      ["Enfoque del archivo", "Historia y estructura"]
    ],
    features: [
      ["Fortaleza", "Juego aéreo"],
      ["Identidad", "Solidez"],
      ["Tema visual", "Azul, dorado y tradición"]
    ],
    timeline: [
      ["1958", "Suecia logró uno de sus hitos más recordados en la historia del Mundial."],
      ["Décadas posteriores", "Se mantuvo como una selección europea respetada."],
      ["2026", "Su archivo puede resaltar legado, consistencia y perfil clásico."]
    ],
    gallery: [
      "Panel nórdico de archivo",
      "Tarjeta azul-dorada",
      "Módulo histórico sueco"
    ],
    pixelart: `
██████ ███████
█      █
████   █████
█      █
█      ███████
`
  },

  kr: {
    name: "Corea del Sur",
    code: "KR",
    confederation: "AFC",
    nickname: "Los Guerreros Taeguk",
    model: "surcorea.glb",
    arMarker: "surcorea.patt",
    slogan: "Intensidad, presión alta y memoria imborrable de 2002.",
    summary:
      "Corea del Sur puede tener una de las fichas más dinámicas del archivo. Su narrativa combina energía, velocidad, presión alta y un antecedente mundialista muy recordado.",
    relatedVenue: "Archivo internacional / legado asiático",
    style: "Ritmo alto, transiciones rápidas, presión, intensidad física y mental.",
    notableFact: "Corea del Sur alcanzó las semifinales del Mundial 2002 como anfitrión.",
    arInfo:
      "El marcador AR de Corea del Sur puede abrir una ficha de energía, rotación del modelo y narrativa de alto impacto.",
    stats: [
      ["Rol en 2026", "Selección internacional"],
      ["Zona", "Asia"],
      ["Modelo AR", "Modelo surcorea.glb"],
      ["Enfoque del archivo", "Velocidad y legado 2002"]
    ],
    features: [
      ["Fortaleza", "Presión alta"],
      ["Identidad", "Intensidad"],
      ["Tema visual", "Rojo, blanco y dinamismo"]
    ],
    timeline: [
      ["2002", "Corea del Sur firmó uno de los recorridos más impactantes de su historia."],
      ["Ciclos recientes", "Se consolidó como una selección asiática competitiva."],
      ["2026", "Su archivo puede resaltar ritmo, valentía y ambición internacional."]
    ],
    gallery: [
      "Panel rojo de energía",
      "Táctica de presión alta",
      "Archivo del modelo coreano"
    ],
    pixelart: `
██   ██ ██████
██  ██  █   ██
█████   █████
██  ██  █  ██
██   ██ █   ██
`
  }
};

function openCountryArchive(countryCode) {
  renderCountryDetail(countryCode);
  openTab("detalle-pais", null);
}

function renderCountryDetail(countryCode) {
  const data = countryArchiveData[countryCode];
  const title = document.getElementById("country-detail-title");
  const content = document.getElementById("country-detail-content");

  if (!data || !title || !content) return;

  title.textContent = data.name;

  const statsHtml = data.stats.map(item => `
    <div class="country-meta-row">
      <span>${item[0]}</span>
      <strong>${item[1]}</strong>
    </div>
  `).join("");

  const featuresHtml = data.features.map(item => `
    <div class="country-feature-card">
      <span>${item[0]}</span>
      <strong>${item[1]}</strong>
    </div>
  `).join("");

  const timelineHtml = data.timeline.map(item => `
    <div class="country-timeline-item">
      <strong>${item[0]}</strong>
      <span>${item[1]}</span>
    </div>
  `).join("");

  const galleryHtml = data.gallery.map(item => `
    <div class="country-gallery-item">
      <span class="country-gallery-caption">${item}</span>
    </div>
  `).join("");

  content.innerHTML = `
    <div class="country-hero-card">
      <div class="country-hero-top">
        <div>
          <h3 class="country-hero-title">${data.name}</h3>
          <p class="country-hero-subtitle">${data.summary}</p>
        </div>
      </div>

      <div class="country-hero-badges">
        <span class="country-chip">Código: ${data.code}</span>
        <span class="country-chip">Confederación: ${data.confederation}</span>
        <span class="country-chip">Modelo AR: ${data.model}</span>
        <span class="country-chip">Marcador: ${data.arMarker}</span>
      </div>
    </div>

    <div class="country-layout-grid">
      <div class="country-panel">
        <h3 class="country-section-title">Resumen general</h3>
        <p class="country-highlight-text">${data.slogan}</p>
        <p>${data.summary}</p>

        <div class="country-feature-grid">
          ${featuresHtml}
        </div>
      </div>

      <div class="country-panel">
        <h3 class="country-section-title">Ficha técnica</h3>
        <div class="country-meta-list">
          ${statsHtml}
        </div>
      </div>
    </div>

    <div class="country-layout-grid">
      <div class="country-panel">
        <h3 class="country-section-title">Información vinculada al AR</h3>
        <p>${data.arInfo}</p>
        <p><strong>Estadio / referencia:</strong> ${data.relatedVenue}</p>
        <p><strong>Estilo de juego:</strong> ${data.style}</p>
        <p><strong>Dato notable:</strong> ${data.notableFact}</p>
      </div>

      <div class="country-panel">
        <h3 class="country-section-title">Pixel art / firma visual</h3>
        <div class="pixelart-box">
          <pre>${data.pixelart}</pre>
        </div>
      </div>
    </div>

    <div class="country-panel">
      <h3 class="country-section-title">Línea de tiempo</h3>
      <div class="country-timeline">
        ${timelineHtml}
      </div>
    </div>

    <div class="country-panel">
      <h3 class="country-section-title">Galería conceptual del archivo</h3>
      <div class="country-gallery-grid">
        ${galleryHtml}
      </div>
    </div>
  `;
}

/* =========================
   CÁMARA AR / GALERÍA
========================= */

let currentARFilter = "none";

function applyARFilter(filterCss) {
  const iframe = document.getElementById("camera-iframe");
  if (!iframe) return;

  currentARFilter = filterCss;
  iframe.style.filter = filterCss;

  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { type: "SET_AR_FILTER", filter: filterCss },
      window.location.origin
    );
  }
}

function captureARPhoto() {
  const iframe = document.getElementById("camera-iframe");
  if (!iframe || !iframe.contentWindow) {
    alert("La cámara aún no está lista.");
    return;
  }

  iframe.contentWindow.postMessage({ type: "CAPTURE_AR_PHOTO" }, window.location.origin);
}

window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;

  const data = event.data;
  if (!data || data.type !== "AR_PHOTO_RESULT") return;

  if (!data.image) {
    alert("No se pudo tomar la foto.");
    return;
  }

  savePhotoToGallery(data.image);
});

function savePhotoToGallery(imageData) {
  const key = "visionMundialHQGallery";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  existing.unshift({
    id: Date.now(),
    image: imageData,
    createdAt: new Date().toLocaleString("es-MX")
  });

  localStorage.setItem(key, JSON.stringify(existing));
  renderGallery();
  alert("Foto guardada en la galería.");
}

function renderGallery() {
  const key = "visionMundialHQGallery";
  const gallery = JSON.parse(localStorage.getItem(key) || "[]");
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");

  if (!grid || !empty) return;

  grid.innerHTML = "";

  if (!gallery.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  gallery.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-card";

    card.innerHTML = `
      <img src="${item.image}" alt="Captura AR">
      <div class="gallery-date">${item.createdAt}</div>
      <div class="gallery-actions">
        <a href="${item.image}" download="captura-ar-${item.id}.png">Descargar</a>
        <button type="button" onclick="deleteGalleryPhoto(${item.id})">Eliminar</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

function deleteGalleryPhoto(id) {
  const key = "visionMundialHQGallery";
  const gallery = JSON.parse(localStorage.getItem(key) || "[]");
  const updated = gallery.filter((item) => item.id !== id);
  localStorage.setItem(key, JSON.stringify(updated));
  renderGallery();
}

/* =========================
   MODALES
========================= */

function goToNewsHub() {
  window.location.href = "Noticias/Noticias.html";
}

function goToMiniGames() {
  window.location.href = "Minijuegos/Portada.html";
}

function openVR() {
  document.getElementById("modal-vr").style.display = "flex";
}

function closeVR() {
  document.getElementById("modal-vr").style.display = "none";
}

function openVideoModal(videoId, titleText) {
  const modal = document.getElementById("modal-video");
  const iframe = document.getElementById("video-modal-iframe");
  const title = document.getElementById("video-modal-title");

  if (!modal || !iframe || !title) return;

  const origin = encodeURIComponent(window.location.origin);

  title.textContent = titleText || "VIDEO";
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&origin=${origin}`;
  modal.style.display = "flex";
}

function closeVideoModal() {
  const modal = document.getElementById("modal-video");
  const iframe = document.getElementById("video-modal-iframe");
  if (iframe) iframe.src = "";
  if (modal) modal.style.display = "none";
}

/* =========================
   VIDEOS
========================= */

function applyVideoFilter(filterCss) {
  const v = document.getElementById("local-video");
  if (!v) return;
  v.style.filter = filterCss;
}

function loadLocalVideo(src, titleText) {
  const v = document.getElementById("local-video");
  if (!v) return;

  v.pause();
  v.style.filter = "none";
  v.removeAttribute("poster");

  const source = v.querySelector("source");
  if (!source) return;

  source.src = src;
  v.load();

  v.addEventListener("loadeddata", function autoPlayOnce() {
    v.play().catch(() => {});
    v.removeEventListener("loadeddata", autoPlayOnce);
  });
}

/* =========================
   SONIDOS QUIZ
========================= */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

function playTone(freq = 440, duration = 0.12, type = "sine", volume = 0.03) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  osc.start(now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.stop(now + duration);
}

function playCorrectSound() {
  playTone(660, 0.08, "triangle", 0.04);
  setTimeout(() => playTone(880, 0.12, "triangle", 0.04), 80);
  setTimeout(() => playTone(1046, 0.15, "triangle", 0.04), 160);
}

function playWrongSound() {
  playTone(220, 0.16, "sawtooth", 0.04);
  setTimeout(() => playTone(180, 0.18, "sawtooth", 0.035), 80);
}

function playTickSound() {
  playTone(900, 0.03, "square", 0.015);
}

function playStartSound() {
  playTone(440, 0.08, "triangle", 0.04);
  setTimeout(() => playTone(660, 0.08, "triangle", 0.04), 60);
  setTimeout(() => playTone(880, 0.12, "triangle", 0.04), 120);
}

/* =========================
   TRIVIA PROFESIONAL
========================= */

const QUIZ_STORAGE_KEY = "visionMundialHQQuizProfile";

const quizBank = [
  {
    category: "Mundial 2026",
    difficulty: "Fácil",
    question: "¿Cuántos países serán sede conjunta del Mundial 2026?",
    options: ["2", "3", "4", "5"],
    answer: 1,
    basePoints: 100,
    explanation: "El Mundial 2026 será organizado por México, Estados Unidos y Canadá."
  },
  {
    category: "Mundial 2026",
    difficulty: "Fácil",
    question: "¿A cuántas selecciones se amplía el Mundial 2026?",
    options: ["32", "40", "48", "64"],
    answer: 2,
    basePoints: 120,
    explanation: "La Copa del Mundo 2026 contará con 48 selecciones."
  },
  {
    category: "Historia",
    difficulty: "Fácil",
    question: "¿Qué país ha ganado más Copas del Mundo masculinas?",
    options: ["Alemania", "Argentina", "Italia", "Brasil"],
    answer: 3,
    basePoints: 100,
    explanation: "Brasil es la selección con más títulos mundiales."
  },
  {
    category: "Historia",
    difficulty: "Fácil",
    question: "¿Qué selección ganó el Mundial de 2022?",
    options: ["Francia", "Argentina", "Croacia", "Brasil"],
    answer: 1,
    basePoints: 110,
    explanation: "Argentina ganó la final de 2022 ante Francia."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Quién es el máximo goleador histórico de los Mundiales masculinos?",
    options: ["Pelé", "Miroslav Klose", "Ronaldo Nazário", "Lionel Messi"],
    answer: 1,
    basePoints: 150,
    explanation: "Miroslav Klose marcó 16 goles en Copas del Mundo."
  },
  {
    category: "Reglas",
    difficulty: "Fácil",
    question: "¿Cuántos jugadores por equipo hay en el campo al iniciar un partido?",
    options: ["10", "11", "12", "9"],
    answer: 1,
    basePoints: 100,
    explanation: "Cada equipo inicia con 11 jugadores en cancha."
  },
  {
    category: "Reglas",
    difficulty: "Fácil",
    question: "¿Cuánto dura un partido regular sin contar descanso ni añadido?",
    options: ["80 minutos", "90 minutos", "100 minutos", "120 minutos"],
    answer: 1,
    basePoints: 100,
    explanation: "El tiempo reglamentario es de 90 minutos."
  },
  {
    category: "Reglas",
    difficulty: "Media",
    question: "¿Cuántos minutos dura el descanso entre el primer y segundo tiempo, normalmente?",
    options: ["10", "12", "15", "20"],
    answer: 2,
    basePoints: 120,
    explanation: "El descanso habitual es de 15 minutos."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó el Mundial de 2010?",
    options: ["España", "Países Bajos", "Alemania", "Italia"],
    answer: 0,
    basePoints: 150,
    explanation: "España ganó su primer Mundial en 2010."
  },
  {
    category: "Historia",
    difficulty: "Fácil",
    question: "¿Qué país ganó el Mundial de 2014?",
    options: ["Brasil", "Alemania", "Argentina", "España"],
    answer: 1,
    basePoints: 120,
    explanation: "Alemania venció a Argentina en la final."
  },
  {
    category: "Jugadores",
    difficulty: "Fácil",
    question: "¿En qué selección brilló Pelé en los Mundiales?",
    options: ["Argentina", "Portugal", "Brasil", "Uruguay"],
    answer: 2,
    basePoints: 110,
    explanation: "Pelé es una de las máximas leyendas de Brasil."
  },
  {
    category: "Jugadores",
    difficulty: "Media",
    question: "¿Qué dorsal hizo mundialmente famoso Diego Maradona con Argentina?",
    options: ["7", "9", "10", "11"],
    answer: 2,
    basePoints: 130,
    explanation: "Maradona es históricamente asociado con el número 10."
  },
  {
    category: "Estadios",
    difficulty: "Media",
    question: "¿En qué país se encuentra el Estadio Azteca?",
    options: ["Argentina", "México", "Estados Unidos", "España"],
    answer: 1,
    basePoints: 130,
    explanation: "El Estadio Azteca está en Ciudad de México."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección fue campeona del primer Mundial en 1930?",
    options: ["Brasil", "Italia", "Uruguay", "Argentina"],
    answer: 2,
    basePoints: 160,
    explanation: "Uruguay ganó la primera Copa del Mundo."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó el Mundial de 1998?",
    options: ["Brasil", "Francia", "Italia", "Alemania"],
    answer: 1,
    basePoints: 150,
    explanation: "Francia ganó el Mundial de 1998 como anfitriona."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó el Mundial de 2006?",
    options: ["Italia", "Francia", "Alemania", "Brasil"],
    answer: 0,
    basePoints: 150,
    explanation: "Italia ganó en penales ante Francia."
  },
  {
    category: "Historia",
    difficulty: "Difícil",
    question: "¿Qué selección ganó el Mundial de 1986?",
    options: ["Brasil", "Alemania", "Argentina", "Uruguay"],
    answer: 2,
    basePoints: 200,
    explanation: "Argentina se coronó campeona en México 1986."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó el Mundial de 1978?",
    options: ["Alemania", "Argentina", "Brasil", "Países Bajos"],
    answer: 1,
    basePoints: 150,
    explanation: "Argentina logró su primer título en 1978."
  },
  {
    category: "Jugadores",
    difficulty: "Media",
    question: "¿Qué jugador es conocido como 'O Rei'?",
    options: ["Ronaldo", "Pelé", "Romário", "Ronaldinho"],
    answer: 1,
    basePoints: 130,
    explanation: "Pelé fue apodado 'O Rei'."
  },
  {
    category: "Jugadores",
    difficulty: "Fácil",
    question: "¿Qué jugador argentino levantó la Copa del Mundo en 2022 como capitán?",
    options: ["Di María", "Messi", "Otamendi", "Dybala"],
    answer: 1,
    basePoints: 110,
    explanation: "Lionel Messi fue el capitán campeón en 2022."
  },
  {
    category: "Reglas",
    difficulty: "Media",
    question: "¿Qué tarjeta expulsa a un jugador de forma inmediata?",
    options: ["Amarilla", "Azul", "Roja", "Verde"],
    answer: 2,
    basePoints: 120,
    explanation: "La tarjeta roja implica expulsión."
  },
  {
    category: "Reglas",
    difficulty: "Media",
    question: "¿Desde dónde se cobra un penal?",
    options: ["Desde el centro del campo", "Desde el punto penal", "Desde el área chica", "Desde la media luna"],
    answer: 1,
    basePoints: 120,
    explanation: "El disparo se realiza desde el punto penal."
  },
  {
    category: "Mundial 2026",
    difficulty: "Fácil",
    question: "¿Qué país de estos NO será sede del Mundial 2026?",
    options: ["México", "Canadá", "Estados Unidos", "Costa Rica"],
    answer: 3,
    basePoints: 110,
    explanation: "La sede será compartida por México, Canadá y Estados Unidos."
  },
  {
    category: "Historia",
    difficulty: "Difícil",
    question: "¿Qué selección perdió tres finales consecutivas entre 1974 y 1978?",
    options: ["Argentina", "Países Bajos", "Italia", "Brasil"],
    answer: 1,
    basePoints: 220,
    explanation: "Países Bajos perdió las finales de 1974 y 1978; además fue subcampeón también en 2010, pero no consecutiva a esas."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó el Mundial de 2018?",
    options: ["Croacia", "Francia", "Bélgica", "Inglaterra"],
    answer: 1,
    basePoints: 140,
    explanation: "Francia fue campeona en Rusia 2018."
  },
  {
    category: "Jugadores",
    difficulty: "Media",
    question: "¿De qué país era Zinedine Zidane como seleccionado?",
    options: ["España", "Argelia", "Francia", "Bélgica"],
    answer: 2,
    basePoints: 130,
    explanation: "Zidane fue una de las grandes figuras de Francia."
  },
  {
    category: "Jugadores",
    difficulty: "Media",
    question: "¿Qué jugador portugués es uno de los máximos goleadores internacionales?",
    options: ["Figo", "Rui Costa", "Cristiano Ronaldo", "Eusébio"],
    answer: 2,
    basePoints: 130,
    explanation: "Cristiano Ronaldo destaca por su récord goleador internacional."
  },
  {
    category: "Reglas",
    difficulty: "Difícil",
    question: "¿Cuántos árbitros asistentes acompañan normalmente al árbitro central durante un partido?",
    options: ["1", "2", "3", "4"],
    answer: 1,
    basePoints: 180,
    explanation: "Normalmente hay dos árbitros asistentes de línea."
  },
  {
    category: "Estadios",
    difficulty: "Media",
    question: "¿En qué ciudad se ubica el Estadio Azteca?",
    options: ["Guadalajara", "Monterrey", "Ciudad de México", "Puebla"],
    answer: 2,
    basePoints: 130,
    explanation: "El Azteca está en Ciudad de México."
  },
  {
    category: "Historia",
    difficulty: "Difícil",
    question: "¿Qué selección ganó el Mundial de 1958, iniciando la era de Pelé?",
    options: ["Uruguay", "Brasil", "Suecia", "Alemania"],
    answer: 1,
    basePoints: 180,
    explanation: "Brasil ganó en 1958 con un joven Pelé."
  },
  {
    category: "Historia",
    difficulty: "Difícil",
    question: "¿Qué selección fue subcampeona del Mundial 2022?",
    options: ["Croacia", "Marruecos", "Brasil", "Francia"],
    answer: 3,
    basePoints: 170,
    explanation: "Francia perdió la final ante Argentina."
  },
  {
    category: "Reglas",
    difficulty: "Media",
    question: "¿Cómo se reanuda el juego cuando el balón sale completamente por la línea de banda?",
    options: ["Tiro de esquina", "Saque de banda", "Penal", "Bote a tierra"],
    answer: 1,
    basePoints: 120,
    explanation: "Se reanuda con saque de banda."
  },
  {
    category: "Reglas",
    difficulty: "Media",
    question: "¿Cómo se llama la tanda para desempatar tras la prórroga en eliminación directa?",
    options: ["Tiempo extra", "Gol de oro", "Penales", "Saque neutral"],
    answer: 2,
    basePoints: 120,
    explanation: "Se define por tanda de penales."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó el Mundial de 1994?",
    options: ["Italia", "Brasil", "Alemania", "Argentina"],
    answer: 1,
    basePoints: 150,
    explanation: "Brasil venció a Italia por penales."
  },
  {
    category: "Jugadores",
    difficulty: "Difícil",
    question: "¿Qué delantero brasileño fue apodado 'O Fenômeno'?",
    options: ["Romário", "Ronaldinho", "Ronaldo Nazário", "Adriano"],
    answer: 2,
    basePoints: 180,
    explanation: "Ronaldo Nazário fue conocido como 'O Fenômeno'."
  },
  {
    category: "Mundial 2026",
    difficulty: "Fácil",
    question: "¿Qué confederación pertenece la selección de México?",
    options: ["UEFA", "CONMEBOL", "CONCACAF", "CAF"],
    answer: 2,
    basePoints: 100,
    explanation: "México pertenece a la CONCACAF."
  },
  {
    category: "Historia",
    difficulty: "Media",
    question: "¿Qué selección ganó cuatro Mundiales antes que Alemania lograra su cuarto?",
    options: ["España", "Italia", "Argentina", "Francia"],
    answer: 1,
    basePoints: 150,
    explanation: "Italia llegó a cuatro títulos antes que Alemania alcanzara el suyo."
  },
  {
    category: "Reglas",
    difficulty: "Fácil",
    question: "¿Qué parte del cuerpo NO puede usar un jugador de campo para controlar el balón de forma legal?",
    options: ["Cabeza", "Pecho", "Mano o brazo", "Muslo"],
    answer: 2,
    basePoints: 100,
    explanation: "Un jugador de campo no puede jugar deliberadamente el balón con la mano o brazo."
  }
];

const quizState = {
  selectedAmount: 10,
  questions: [],
  index: 0,
  score: 0,
  coins: 0,
  correctAnswers: 0,
  answered: false,
  started: false,
  finished: false,
  timer: null,
  timeLeft: 18,
  maxTime: 18,
  streak: 0,
  bestStreak: 0,
  lifelines: {
    fifty: true,
    plusTime: true,
    skip: true
  },
  profile: {
    bestScore: 0,
    coins: 0
  }
};

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadQuizProfile() {
  const saved = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) || "{}");
  quizState.profile.bestScore = saved.bestScore || 0;
  quizState.profile.coins = saved.coins || 0;
}

function saveQuizProfile() {
  localStorage.setItem(
    QUIZ_STORAGE_KEY,
    JSON.stringify({
      bestScore: quizState.profile.bestScore,
      coins: quizState.profile.coins
    })
  );
}

function $(id) {
  return document.getElementById(id);
}

function difficultyColorLabel(level) {
  if (level === "Fácil") return "Fácil";
  if (level === "Media") return "Media";
  return "Difícil";
}

function setSelectedMode(amount) {
  quizState.selectedAmount = amount;
  document.querySelectorAll(".quiz-mode-card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.amount) === amount);
  });
  const label = $("quiz-home-mode-label");
  if (label) label.textContent = `${amount} preguntas`;
}

function buildQuizSession() {
  const shuffled = shuffleArray(quizBank);
  quizState.questions = shuffled.slice(0, quizState.selectedAmount);
}

function startQuizGame() {
  buildQuizSession();

  quizState.index = 0;
  quizState.score = 0;
  quizState.correctAnswers = 0;
  quizState.answered = false;
  quizState.started = true;
  quizState.finished = false;
  quizState.timeLeft = 18;
  quizState.maxTime = 18;
  quizState.streak = 0;
  quizState.bestStreak = 0;
  quizState.lifelines = {
    fifty: true,
    plusTime: true,
    skip: true
  };

  $("quiz-home").classList.add("hidden");
  $("quiz-finish").classList.add("hidden");
  $("quiz-stage").classList.remove("hidden");

  playStartSound();
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const question = quizState.questions[quizState.index];
  if (!question) {
    finishQuizGame();
    return;
  }

  quizState.answered = false;
  quizState.timeLeft = 18;
  quizState.maxTime = 18;

  $("quiz-current-number").textContent = quizState.index + 1;
  $("quiz-total-number").textContent = quizState.questions.length;
  $("quiz-score-value").textContent = quizState.score;
  $("quiz-streak-value").textContent = quizState.streak;
  $("quiz-coins-value").textContent = quizState.profile.coins;
  $("quiz-category").textContent = question.category;
  $("quiz-difficulty").textContent = difficultyColorLabel(question.difficulty);
  $("quiz-question-text").textContent = question.question;
  $("quiz-question-note").textContent = "Selecciona una respuesta antes de que acabe el tiempo.";
  $("quiz-feedback").className = "quiz-feedback-pro";
  $("quiz-feedback").textContent = "";
  $("quiz-next-btn").disabled = true;

  updateLifelineButtons();
  renderQuestionOptions(question);
  updateQuestionProgress();
  updateTimerUI();

  const triviaPage = document.getElementById("trivia");
  if (triviaPage && triviaPage.classList.contains("active")) {
    quizStartTimer();
  }
}

function renderQuestionOptions(question) {
  const optionsContainer = $("quiz-options");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "quiz-answer-btn";
    button.type = "button";
    button.innerHTML = `
      <span class="quiz-answer-letter">${String.fromCharCode(65 + index)}</span>
      <span class="quiz-answer-text">${option}</span>
    `;
    button.addEventListener("click", () => handleAnswer(index, button));
    optionsContainer.appendChild(button);
  });
}

function quizStartTimer() {
  quizPauseTimer();

  quizState.timer = setInterval(() => {
    quizState.timeLeft--;
    updateTimerUI();

    if (quizState.timeLeft <= 5 && quizState.timeLeft > 0) {
      playTickSound();
    }

    if (quizState.timeLeft <= 0) {
      quizPauseTimer();
      handleTimeout();
    }
  }, 1000);
}

function quizPauseTimer() {
  if (quizState.timer) {
    clearInterval(quizState.timer);
    quizState.timer = null;
  }
}

function quizResumeIfNeeded() {
  if (
    quizState.started &&
    !quizState.finished &&
    !quizState.answered &&
    !quizState.timer
  ) {
    quizStartTimer();
  }
}

function updateTimerUI() {
  const text = $("quiz-timer-text");
  const bar = $("quiz-progress-bar");

  if (text) text.textContent = `${quizState.timeLeft}s`;

  const percent = (quizState.timeLeft / quizState.maxTime) * 100;
  if (bar) bar.style.width = `${percent}%`;

  text?.classList.remove("danger");
  if (quizState.timeLeft <= 5) {
    text?.classList.add("danger");
  }
}

function updateQuestionProgress() {
  const progress = ((quizState.index + 1) / quizState.questions.length) * 100;
  const bar = $("quiz-progress-bar");
  if (bar) {
    bar.style.setProperty("--question-progress", `${progress}%`);
  }
}

function handleAnswer(selectedIndex, clickedButton) {
  if (quizState.answered) return;

  quizState.answered = true;
  quizPauseTimer();

  const question = quizState.questions[quizState.index];
  const buttons = [...document.querySelectorAll(".quiz-answer-btn")];
  buttons.forEach((btn) => (btn.disabled = true));

  const correctIndex = question.answer;
  const correctButton = buttons[correctIndex];
  const fastBonus = Math.max(0, quizState.timeLeft * 4);
  const streakBonus = quizState.streak >= 2 ? quizState.streak * 15 : 0;

  if (selectedIndex === correctIndex) {
    clickedButton.classList.add("correct");
    const earned = question.basePoints + fastBonus + streakBonus;
    quizState.score += earned;
    quizState.correctAnswers += 1;
    quizState.streak += 1;
    quizState.bestStreak = Math.max(quizState.bestStreak, quizState.streak);

    const earnedCoins = 8 + Math.floor(quizState.timeLeft / 2);
    quizState.profile.coins += earnedCoins;

    $("quiz-feedback").className = "quiz-feedback-pro success";
    $("quiz-feedback").innerHTML = `
      ¡Correcto! +${earned} pts · +${earnedCoins} monedas
      <small>${question.explanation}</small>
    `;

    playCorrectSound();
    triggerMiniConfetti(clickedButton);
    pulseButton(clickedButton);
  } else {
    clickedButton.classList.add("wrong");
    if (correctButton) correctButton.classList.add("correct");
    quizState.streak = 0;

    $("quiz-feedback").className = "quiz-feedback-pro error";
    $("quiz-feedback").innerHTML = `
      Respuesta incorrecta.
      <small>${question.explanation}</small>
    `;

    playWrongSound();
    shakeElement(clickedButton);
  }

  $("quiz-score-value").textContent = quizState.score;
  $("quiz-streak-value").textContent = quizState.streak;
  $("quiz-coins-value").textContent = quizState.profile.coins;
  $("quiz-next-btn").disabled = false;

  saveQuizProfile();
  updateQuizHomeHeader();
}

function handleTimeout() {
  if (quizState.answered) return;

  quizState.answered = true;
  quizState.streak = 0;

  const question = quizState.questions[quizState.index];
  const buttons = [...document.querySelectorAll(".quiz-answer-btn")];
  buttons.forEach((btn) => (btn.disabled = true));

  if (buttons[question.answer]) {
    buttons[question.answer].classList.add("correct");
  }

  $("quiz-feedback").className = "quiz-feedback-pro error";
  $("quiz-feedback").innerHTML = `
    Tiempo agotado.
    <small>${question.explanation}</small>
  `;

  $("quiz-streak-value").textContent = quizState.streak;
  $("quiz-next-btn").disabled = false;

  playWrongSound();
}

function nextQuizQuestion() {
  if (!quizState.answered) return;
  quizState.index += 1;

  if (quizState.index >= quizState.questions.length) {
    finishQuizGame();
    return;
  }

  renderQuizQuestion();
}

function finishQuizGame() {
  quizPauseTimer();
  quizState.finished = true;
  quizState.started = false;

  $("quiz-stage").classList.add("hidden");
  $("quiz-home").classList.add("hidden");
  $("quiz-finish").classList.remove("hidden");

  const accuracy = Math.round((quizState.correctAnswers / quizState.questions.length) * 100);
  const reward = Math.max(20, Math.floor(quizState.score / 25));
  quizState.profile.coins += reward;

  if (quizState.score > quizState.profile.bestScore) {
    quizState.profile.bestScore = quizState.score;
  }

  saveQuizProfile();
  updateQuizHomeHeader();

  $("quiz-final-score").textContent = quizState.score;
  $("quiz-final-correct").textContent = `${quizState.correctAnswers}/${quizState.questions.length}`;
  $("quiz-final-accuracy").textContent = `${accuracy}%`;
  $("quiz-final-best-streak").textContent = quizState.bestStreak;
  $("quiz-final-rank").textContent = getRankByScore(accuracy, quizState.score);
  $("quiz-reward-text").textContent = `+${reward} monedas`;
  $("quiz-finish-title").textContent = getFinishTitle(accuracy);
  $("quiz-finish-subtitle").textContent = getFinishSubtitle(accuracy);

  if (accuracy >= 70) {
    triggerConfetti();
  }
}

function restartQuizGame() {
  $("quiz-finish").classList.add("hidden");
  $("quiz-stage").classList.add("hidden");
  $("quiz-home").classList.remove("hidden");
  updateQuizHomeHeader();
}

function getRankByScore(accuracy, score) {
  if (accuracy >= 95) return "Leyenda";
  if (accuracy >= 85) return "Élite";
  if (accuracy >= 70) return "Crack";
  if (accuracy >= 50) return "Titular";
  return "Fan";
}

function getFinishTitle(accuracy) {
  if (accuracy >= 95) return "¡Resultado perfecto!";
  if (accuracy >= 85) return "¡Partidazo!";
  if (accuracy >= 70) return "¡Muy buena ronda!";
  if (accuracy >= 50) return "¡Buen intento!";
  return "Sigue practicando";
}

function getFinishSubtitle(accuracy) {
  if (accuracy >= 95) return "Dominaste la trivia como una leyenda del Mundial.";
  if (accuracy >= 85) return "Tu nivel es muy alto. Se nota que sabes bastante.";
  if (accuracy >= 70) return "Buen rendimiento, estuviste por encima de la media.";
  if (accuracy >= 50) return "Vas bien, con unas rondas más subes de nivel.";
  return "Todavía puedes mejorar mucho. La siguiente ronda será mejor.";
}

function updateQuizHomeHeader() {
  if ($("quiz-home-best")) $("quiz-home-best").textContent = quizState.profile.bestScore;
  if ($("quiz-home-coins")) $("quiz-home-coins").textContent = quizState.profile.coins;
}

function updateLifelineButtons() {
  const fifty = $("lifeline-5050");
  const plusTime = $("lifeline-time");
  const skip = $("lifeline-skip");

  if (fifty) fifty.disabled = !quizState.lifelines.fifty || quizState.answered;
  if (plusTime) plusTime.disabled = !quizState.lifelines.plusTime || quizState.answered;
  if (skip) skip.disabled = !quizState.lifelines.skip || quizState.answered;
}

function useFiftyFifty() {
  if (!quizState.lifelines.fifty || quizState.answered) return;

  const question = quizState.questions[quizState.index];
  const buttons = [...document.querySelectorAll(".quiz-answer-btn")];
  const wrongIndexes = buttons
    .map((_, index) => index)
    .filter((index) => index !== question.answer);

  const shuffledWrong = shuffleArray(wrongIndexes).slice(0, 2);
  shuffledWrong.forEach((index) => {
    buttons[index].classList.add("disabled-option");
    buttons[index].disabled = true;
  });

  quizState.lifelines.fifty = false;
  updateLifelineButtons();

  $("quiz-feedback").className = "quiz-feedback-pro neutral";
  $("quiz-feedback").innerHTML = `<small>Comodín 50/50 activado.</small>`;
  playTone(520, 0.08, "triangle", 0.04);
}

function useAddTime() {
  if (!quizState.lifelines.plusTime || quizState.answered) return;

  quizState.timeLeft = Math.min(quizState.timeLeft + 10, 28);
  quizState.maxTime = Math.max(quizState.maxTime, quizState.timeLeft);

  quizState.lifelines.plusTime = false;
  updateLifelineButtons();
  updateTimerUI();

  $("quiz-feedback").className = "quiz-feedback-pro neutral";
  $("quiz-feedback").innerHTML = `<small>Recibiste +10 segundos.</small>`;
  playTone(700, 0.08, "triangle", 0.04);
}

function useSkipQuestion() {
  if (!quizState.lifelines.skip || quizState.answered) return;

  quizState.lifelines.skip = false;
  updateLifelineButtons();
  quizPauseTimer();

  $("quiz-feedback").className = "quiz-feedback-pro neutral";
  $("quiz-feedback").innerHTML = `<small>Pregunta saltada.</small>`;
  playTone(480, 0.08, "triangle", 0.04);

  quizState.index += 1;
  if (quizState.index >= quizState.questions.length) {
    finishQuizGame();
  } else {
    renderQuizQuestion();
  }
}

function pulseButton(element) {
  if (!element) return;
  element.classList.remove("pulse-hit");
  void element.offsetWidth;
  element.classList.add("pulse-hit");
}

function shakeElement(element) {
  if (!element) return;
  element.classList.remove("shake-hit");
  void element.offsetWidth;
  element.classList.add("shake-hit");
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ["#26ccff", "#a25afd", "#ffb703", "#2ee6a6", "#ffffff"]
      });

      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ["#26ccff", "#a25afd", "#ffb703", "#2ee6a6", "#ffffff"]
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

function triggerMiniConfetti(element) {
  if (typeof confetti !== "function" || !element) return;

  const rect = element.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 30,
    spread: 55,
    origin: { x, y },
    colors: ["#2ee6a6", "#ffffff", "#ffb703"]
  });
}

/* =========================
   ESTADÍSTICAS EN VIVO
========================= */

function updateLiveStats() {
  const statsElements = document.querySelectorAll(".live-stat");
  statsElements.forEach((el) => {
    const currentVal = parseInt(el.textContent.replace(/,/g, "") || 0, 10);
    const increment = Math.floor(Math.random() * 5);
    el.textContent = (currentVal + increment).toLocaleString();

    el.classList.add("flash-update");
    setTimeout(() => el.classList.remove("flash-update"), 500);
  });
}

/* =========================
   INICIO APP
========================= */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("splash-active");
  loadQuizProfile();
  updateQuizHomeHeader();
  renderGallery();

  const defaultModeButton = document.querySelector('.quiz-mode-card[data-amount="10"]');
  if (defaultModeButton) defaultModeButton.classList.add("active");

  document.querySelectorAll(".quiz-mode-card").forEach((card) => {
    card.addEventListener("click", () => {
      setSelectedMode(Number(card.dataset.amount));
    });
  });

  const startBtn = $("quiz-start-btn");
  const nextBtn = $("quiz-next-btn");
  const restartBtn = $("quiz-restart-btn");
  const lifeline5050 = $("lifeline-5050");
  const lifelineTime = $("lifeline-time");
  const lifelineSkip = $("lifeline-skip");

  if (startBtn) startBtn.addEventListener("click", startQuizGame);
  if (nextBtn) nextBtn.addEventListener("click", nextQuizQuestion);
  if (restartBtn) restartBtn.addEventListener("click", restartQuizGame);
  if (lifeline5050) lifeline5050.addEventListener("click", useFiftyFifty);
  if (lifelineTime) lifelineTime.addEventListener("click", useAddTime);
  if (lifelineSkip) lifelineSkip.addEventListener("click", useSkipQuestion);

  const v = document.getElementById("local-video");
  if (v) {
    v.addEventListener("error", () => {
      console.error("Error cargando el video.");
      const source = v.querySelector("source");
      console.log("Ruta del video:", source ? source.src : "sin source");
      console.log("networkState:", v.networkState);
      console.log("readyState:", v.readyState);
    });

    v.addEventListener("loadedmetadata", () => {
      console.log("Metadata cargada correctamente");
    });

    v.addEventListener("canplay", () => {
      console.log("El video ya puede reproducirse");
    });
  }

  setInterval(updateLiveStats, 3000);
});