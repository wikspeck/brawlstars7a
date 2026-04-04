const appState = {
  currentView: "home",
  visitedLoadables: new Set(),
  carouselIndexes: {
    milestones: 0,
    records: 0
  }
};

const APP_CODE_LINE_COUNT = 1589;

// Central asset config.
// Update image paths here if you rename files or move them.
const ASSETS = {
  hallBackground: "./assets/hallway-background.png",
  nameSign: "./assets/name-sign.png",
  trophies: {
    first1000: "./assets/trophy-first-1000.png",
    firstTitle: "./assets/trophy-first-title.png"
  }
};

// Future API integration placeholder:
// Replace static arrays with fetched data from [PLACEHOLDER DATA SOURCE].
const leaderboardData = [
  { name: "[PLACEHOLDER NAME]", username: "@[PLACEHOLDER USERNAME]", rank: 1, points: "[PLACEHOLDER SCORE]", tag: "#[PLACEHOLDER PLAYER TAG]" },
  { name: "[PLACEHOLDER NAME]", username: "@[PLACEHOLDER USERNAME]", rank: 2, points: "[PLACEHOLDER SCORE]", tag: "#[PLACEHOLDER PLAYER TAG]" },
  { name: "[PLACEHOLDER NAME]", username: "@[PLACEHOLDER USERNAME]", rank: 3, points: "[PLACEHOLDER SCORE]", tag: "#[PLACEHOLDER PLAYER TAG]" },
  { name: "[PLACEHOLDER NAME]", username: "@[PLACEHOLDER USERNAME]", rank: 4, points: "[PLACEHOLDER SCORE]", tag: "#[PLACEHOLDER PLAYER TAG]" },
  { name: "[PLACEHOLDER NAME]", username: "@[PLACEHOLDER USERNAME]", rank: 5, points: "[PLACEHOLDER SCORE]", tag: "#[PLACEHOLDER PLAYER TAG]" },
  { name: "[PLACEHOLDER NAME]", username: "@[PLACEHOLDER USERNAME]", rank: 6, points: "[PLACEHOLDER SCORE]", tag: "#[PLACEHOLDER PLAYER TAG]" }
];

const milestonesData = [
  {
    title: "Erster Brawler auf 1000 Trophäen",
    playerName: "Benjamin",
    date: "???",
    description: "Historischer Platzhaltertext für einen einzigartigen Erst-Erfolg.",
    trophyImage: ASSETS.trophies.first1000,
    trophyClass: "milestone-trophy-1"
  },
  {
    title: "Erster Spielertitel freigeschaltet",
    playerName: "Wiktor",
    date: "???",
    description: "Platzhalterbeschreibung für einen einmaligen Hall-of-Fame-Moment.",
    trophyImage: ASSETS.trophies.firstTitle,
    trophyClass: "milestone-trophy-2"
  }
];

const recordsData = [
  {
    recordName: "Meiste Trophäen",
    playerName: "[PLACEHOLDER NAME]",
    date: "[PLACEHOLDER DATE]",
    description: "Wert: [PLACEHOLDER RECORD] • Username: @[PLACEHOLDER USERNAME]",
    trophyImage: "[PLACEHOLDER RECORD TROPHY]",
    trophyClass: "records-trophy-most",
    bannerNames: {
      gold: "Mats - 57005",
      silver: "Eddie 56299",
      bronze: "Alwin - 51816"
    }
  },
  {
    recordName: "Meiste Brawler",
    playerName: "[PLACEHOLDER NAME]",
    date: "[PLACEHOLDER DATE]",
    description: "Wert: [PLACEHOLDER RECORD] • Username: @[PLACEHOLDER USERNAME]",
    trophyImage: "[PLACEHOLDER RECORD TROPHY]",
    trophyClass: "records-trophy-highest",
    bannerNames: {
      gold: "Mats - 57005",
      silver: "Eddie 56299",
      bronze: "Alwin - 51816"
    }
  }
];

const elements = {
  stageViewport: document.getElementById("stageViewport"),
  stageRoot: document.getElementById("stageRoot"),
  stageBackground: document.getElementById("stageBackground"),
  hallFullscreenBlur: document.getElementById("hallFullscreenBlur"),
  introOverlay: document.getElementById("introOverlay"),
  introThanksBtn: document.getElementById("introThanksBtn"),
  codeLineCount: document.getElementById("codeLineCount"),
  navTriggers: document.querySelectorAll(".nav-trigger"),
  carouselButtons: document.querySelectorAll(".carousel-arrow"),
  leaderboardList: document.getElementById("leaderboardList"),
  pointsInfoBtn: document.getElementById("pointsInfoBtn"),
  pointsTooltip: document.getElementById("pointsTooltip"),
  leaderboardLoading: document.getElementById("leaderboardLoading"),
  recordsLoading: document.getElementById("recordsLoading"),
  milestoneTitle: document.getElementById("milestoneTitle"),
  milestoneDescription: document.getElementById("milestoneDescription"),
  milestonePlayer: document.getElementById("milestonePlayer"),
  milestoneDate: document.getElementById("milestoneDate"),
  milestoneSignImage: document.getElementById("milestoneSignImage"),
  milestoneSignFallback: document.getElementById("milestoneSignFallback"),
  milestoneTrophyImage: document.getElementById("milestoneTrophyImage"),
  milestoneTrophyFallback: document.getElementById("milestoneTrophyFallback"),
  recordScreenTitle: document.getElementById("recordScreenTitle"),
  recordBannerGoldName: document.getElementById("recordBannerGoldName"),
  recordBannerSilverName: document.getElementById("recordBannerSilverName"),
  recordBannerBronzeName: document.getElementById("recordBannerBronzeName"),
  recordDescription: document.getElementById("recordDescription"),
  recordPlayer: document.getElementById("recordPlayer"),
  recordDate: document.getElementById("recordDate"),
  recordSignImage: document.getElementById("recordSignImage"),
  recordSignFallback: document.getElementById("recordSignFallback"),
  recordTrophyImage: document.getElementById("recordTrophyImage"),
  recordTrophyFallback: document.getElementById("recordTrophyFallback"),
  leaderboardBackButton: document.querySelector(".leaderboard-back-button"),
  hallBackButton: document.querySelector(".hall-back-button"),
  milestoneBackButton: document.querySelector(".milestone-back-button"),
  recordsBackButton: document.querySelector(".records-back-button"),
  milestoneArrowLeft: document.querySelector(".milestone-arrow-left"),
  milestoneArrowRight: document.querySelector(".milestone-arrow-right"),
  recordsArrowLeft: document.querySelector(".records-arrow-left"),
  recordsArrowRight: document.querySelector(".records-arrow-right")
};

function setupIntroNotice() {
  if (elements.codeLineCount) {
    elements.codeLineCount.textContent = String(APP_CODE_LINE_COUNT);
  }

  elements.introThanksBtn?.addEventListener("click", () => {
    elements.introOverlay?.classList.add("is-hidden");
  });
}

function updateStageBackgroundForView(viewName) {
  if (!elements.stageBackground) {
    return;
  }

  const backgroundClasses = ["home-bg", "hof-bg", "milestones-bg", "records-bg", "leaderboard-bg"];
  elements.stageBackground.classList.remove(...backgroundClasses);

  const viewToBackgroundClass = {
    home: "home-bg",
    hall: "hof-bg",
    milestones: "milestones-bg",
    records: "records-bg",
    leaderboard: "leaderboard-bg"
  };

  const backgroundClass = viewToBackgroundClass[viewName] || "home-bg";
  elements.stageBackground.classList.add(backgroundClass);

  if (elements.hallFullscreenBlur) {
    elements.hallFullscreenBlur.classList.toggle("is-visible", viewName === "hall");
  }
}

function updateStageScale() {
  if (!elements.stageViewport || !elements.stageRoot) {
    return;
  }

  const designWidth = 1920;
  const designHeight = 1080;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scale = Math.min(viewportWidth / designWidth, viewportHeight / designHeight);
  const offsetX = (viewportWidth - designWidth * scale) / 2;
  const offsetY = (viewportHeight - designHeight * scale) / 2;

  elements.stageRoot.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  document.documentElement.style.setProperty("--stage-offset-x", `${offsetX}px`);
  document.documentElement.style.setProperty("--stage-offset-y", `${offsetY}px`);
}

function setupScaledStage() {
  updateStageScale();
  window.addEventListener("resize", updateStageScale);
}

function updateEdgeControlVisibility(viewName) {
  const controlsByView = {
    leaderboard: [elements.leaderboardBackButton],
    hall: [elements.hallBackButton],
    milestones: [elements.milestoneBackButton, elements.milestoneArrowLeft, elements.milestoneArrowRight],
    records: [elements.recordsBackButton, elements.recordsArrowLeft, elements.recordsArrowRight]
  };

  const allControls = [
    elements.leaderboardBackButton,
    elements.hallBackButton,
    elements.milestoneBackButton,
    elements.recordsBackButton,
    elements.milestoneArrowLeft,
    elements.milestoneArrowRight,
    elements.recordsArrowLeft,
    elements.recordsArrowRight
  ].filter(Boolean);

  allControls.forEach((control) => control.classList.remove("is-visible"));
  (controlsByView[viewName] || []).forEach((control) => control?.classList.add("is-visible"));
}

function setupViewportAnchoredEdgeControls() {
  if (!elements.stageViewport) {
    return;
  }

  const controls = [
    elements.leaderboardBackButton,
    elements.hallBackButton,
    elements.milestoneBackButton,
    elements.recordsBackButton,
    elements.milestoneArrowLeft,
    elements.milestoneArrowRight,
    elements.recordsArrowLeft,
    elements.recordsArrowRight
  ].filter(Boolean);

  controls.forEach((control) => {
    control.classList.add("edge-control");
    if (control.parentElement !== elements.stageViewport) {
      elements.stageViewport.appendChild(control);
    }
  });

  updateEdgeControlVisibility(appState.currentView);
}

function isPlaceholderPath(path) {
  return typeof path !== "string" || path.trim() === "" || path.includes("[");
}

function setImageSource(imageElement, fallbackElement, path, fallbackLabel) {
  if (!imageElement) {
    return;
  }

  if (isPlaceholderPath(path)) {
    imageElement.removeAttribute("src");
    imageElement.hidden = true;
    if (fallbackElement) {
      fallbackElement.hidden = false;
      fallbackElement.textContent = fallbackLabel;
    }
    return;
  }

  imageElement.hidden = true;
  if (fallbackElement) {
    fallbackElement.hidden = true;
  }

  imageElement.onerror = () => {
    imageElement.hidden = true;
    if (fallbackElement) {
      fallbackElement.hidden = false;
      fallbackElement.textContent = fallbackLabel;
    }
  };

  imageElement.onload = () => {
    imageElement.hidden = false;
    if (fallbackElement) {
      fallbackElement.hidden = true;
    }
  };

  imageElement.src = path;
}

function applySharedShowcaseBackground() {
  document.documentElement.style.setProperty("--hall-bg-image", `url('${ASSETS.hallBackground}')`);
}

function createLeaderboardRow(item) {
  const row = document.createElement("article");
  row.className = "rank-row";

  if (item.rank <= 3) {
    row.classList.add(`top-${item.rank}`);
  }

  row.innerHTML = `
    <div class="profile-icon-placeholder">[PLACEHOLDER PROFILE ICON]</div>
    <div class="name-cell">
      <strong>${item.name}</strong>
      <small>Tag: ${item.tag}</small>
    </div>
    <div>${item.username}</div>
    <div><strong>#${item.rank}</strong></div>
    <div><strong>${item.points}</strong></div>
  `;

  return row;
}

function renderLeaderboard() {
  if (!elements.leaderboardList) {
    return;
  }

  elements.leaderboardList.innerHTML = "";
  leaderboardData.forEach((item) => {
    elements.leaderboardList.appendChild(createLeaderboardRow(item));
  });
}

function getWrappedIndex(index, length) {
  if (!length) {
    return 0;
  }

  if (index < 0) {
    return length - 1;
  }

  if (index >= length) {
    return 0;
  }

  return index;
}

function clearVariantClasses(imageElement, classList) {
  if (!imageElement) {
    return;
  }

  classList.forEach((className) => imageElement.classList.remove(className));
}

function renderShowcase(type) {
  const isMilestones = type === "milestones";
  const data = isMilestones ? milestonesData : recordsData;
  const currentIndex = appState.carouselIndexes[type];
  const item = data[currentIndex];

  if (!item) {
    return;
  }

  const targetElements = isMilestones
    ? {
        title: elements.milestoneTitle,
        description: elements.milestoneDescription,
        player: elements.milestonePlayer,
        date: elements.milestoneDate,
        signImage: elements.milestoneSignImage,
        signFallback: elements.milestoneSignFallback,
        trophyImage: elements.milestoneTrophyImage,
        trophyFallback: elements.milestoneTrophyFallback,
        trophyVariants: ["milestone-trophy-1", "milestone-trophy-2"]
      }
    : {
        title: elements.recordScreenTitle,
        description: elements.recordDescription,
        player: elements.recordPlayer,
        date: elements.recordDate,
        signImage: elements.recordSignImage,
        signFallback: elements.recordSignFallback,
        trophyImage: elements.recordTrophyImage,
        trophyFallback: elements.recordTrophyFallback,
        trophyVariants: ["records-trophy-most", "records-trophy-highest"]
      };

  if (targetElements.title) {
    targetElements.title.textContent = isMilestones
      ? item.title
      : `Rekorde - ${item.recordName ?? "Meiste Trophäen"}`;
  }

  if (targetElements.description) {
    targetElements.description.textContent = item.description;
  }

  if (targetElements.player) {
    targetElements.player.textContent = item.playerName;
  }

  if (targetElements.date) {
    targetElements.date.textContent = item.date;
  }

  if (!isMilestones && item.bannerNames) {
    if (elements.recordBannerGoldName) {
      elements.recordBannerGoldName.textContent = item.bannerNames.gold;
    }
    if (elements.recordBannerSilverName) {
      elements.recordBannerSilverName.textContent = item.bannerNames.silver;
    }
    if (elements.recordBannerBronzeName) {
      elements.recordBannerBronzeName.textContent = item.bannerNames.bronze;
    }
  }

  clearVariantClasses(targetElements.trophyImage, targetElements.trophyVariants);
  if (item.trophyClass) {
    targetElements.trophyImage?.classList.add(item.trophyClass);
  }

  setImageSource(targetElements.signImage, targetElements.signFallback, ASSETS.nameSign, "[NAME_SIGN_IMAGE]");
  setImageSource(
    targetElements.trophyImage,
    targetElements.trophyFallback,
    item.trophyImage,
    isMilestones ? "[MISSING MILESTONE TROPHY]" : "[PLACEHOLDER RECORD TROPHY]"
  );
}

async function runMockLoading(loadableName) {
  if (appState.visitedLoadables.has(loadableName)) {
    return;
  }

  appState.visitedLoadables.add(loadableName);

  const loadingMap = {
    leaderboard: elements.leaderboardLoading,
    records: elements.recordsLoading
  };

  const loadingElement = loadingMap[loadableName];
  if (!loadingElement) {
    return;
  }

  loadingElement.hidden = false;
  await new Promise((resolve) => setTimeout(resolve, 420));
  loadingElement.hidden = true;
}

async function switchView(targetView) {
  if (targetView === appState.currentView) {
    return;
  }

  const current = document.querySelector(`.view[data-view="${appState.currentView}"]`);
  const next = document.querySelector(`.view[data-view="${targetView}"]`);

  if (!next) {
    return;
  }

  current?.classList.remove("is-active");
  next.classList.add("is-active");
  appState.currentView = targetView;
  updateStageBackgroundForView(targetView);
  updateEdgeControlVisibility(targetView);

  const loadableName = next.getAttribute("data-loadable");
  if (loadableName) {
    await runMockLoading(loadableName);
  }
}

function setupNavigation() {
  elements.navTriggers.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-target");
      if (target) {
        switchView(target);
      }
    });
  });
}

function setupTooltip() {
  elements.pointsInfoBtn?.addEventListener("click", () => {
    const isVisible = elements.pointsTooltip.classList.toggle("is-visible");
    elements.pointsInfoBtn.setAttribute("aria-expanded", String(isVisible));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const isInside = target.closest("#pointsTooltip") || target.closest("#pointsInfoBtn");
    if (!isInside) {
      elements.pointsTooltip?.classList.remove("is-visible");
      elements.pointsInfoBtn?.setAttribute("aria-expanded", "false");
    }
  });
}

function setupShowcaseArrows() {
  elements.carouselButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-carousel");
      const direction = Number(button.getAttribute("data-direction"));
      if (!type || Number.isNaN(direction)) {
        return;
      }

      const dataLength = type === "milestones" ? milestonesData.length : recordsData.length;
      appState.carouselIndexes[type] = getWrappedIndex(appState.carouselIndexes[type] + direction, dataLength);
      renderShowcase(type);
    });
  });
}

function initializePrototype() {
  setupIntroNotice();
  setupScaledStage();
  setupViewportAnchoredEdgeControls();
  updateStageBackgroundForView(appState.currentView);
  applySharedShowcaseBackground();
  renderLeaderboard();
  renderShowcase("milestones");
  renderShowcase("records");
  setupNavigation();
  setupTooltip();
  setupShowcaseArrows();
}

initializePrototype();






