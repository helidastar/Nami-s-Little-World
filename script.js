const catDisplay = document.getElementById("catDisplay");
const pixelCat = document.getElementById("pixelCat");
const moodText = document.getElementById("moodText");
const buttons = document.querySelectorAll(".pixel-btn");
const hungerFill = document.getElementById("hungerFill");
const happyFill = document.getElementById("happyFill");
const energyFill = document.getElementById("energyFill");
const themeToggle = document.getElementById("themeToggle");
const particles = document.getElementById("particles");
const sleepBubble = document.getElementById("sleepBubble");

const reactions = {
  feed: {
    mood: "Nami is happy after eating fish snacks!",
    animation: "bounce",
    stateClass: "is-feed",
  },
  pet: {
    mood: "Nami purrs softly. Cozy mode activated!",
    animation: "purr",
    stateClass: "is-pet",
  },
  play: {
    mood: "Zoomies! Nami is super playful now!",
    animation: "wiggle",
    stateClass: "is-play",
  },
  rest: {
    mood: "Nami takes a tiny nap in the warm corner.",
    animation: "sparkle",
    stateClass: "is-rest",
  },
};

const state = {
  hunger: 60,
  happiness: 65,
  energy: 70,
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function renderStats() {
  hungerFill.style.width = `${state.hunger}%`;
  happyFill.style.width = `${state.happiness}%`;
  energyFill.style.width = `${state.energy}%`;
}

function isNightMode() {
  return document.body.classList.contains("night");
}

function setNightSleepVisual(enabled) {
  sleepBubble.style.opacity = enabled ? "1" : "0";
  if (enabled) {
    pixelCat.classList.remove("is-feed", "is-play", "is-hungry", "is-sad");
    pixelCat.classList.add("is-night-sleep", "is-rest");
  } else {
    pixelCat.classList.remove("is-night-sleep", "is-rest");
    pixelCat.classList.add("is-idle");
  }
}

function emitParticles(action) {
  const iconsByAction = {
    feed: ["🐟", "✨", "🍖"],
    pet: ["💗", "✨", "💕"],
    play: ["⭐", "🧶", "✨"],
  };

  const icons = iconsByAction[action];
  if (!icons) return;

  for (let i = 0; i < 6; i += 1) {
    const piece = document.createElement("span");
    piece.className = "particle";
    piece.textContent = icons[i % icons.length];

    const driftX = `${Math.floor(Math.random() * 140) - 70}%`;
    const driftY = `${-55 - Math.floor(Math.random() * 25)}%`;
    piece.style.setProperty("--drift-x", driftX);
    piece.style.setProperty("--drift-y", driftY);
    piece.style.animationDelay = `${i * 45}ms`;

    particles.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

function updateCat(action) {
  const reaction = reactions[action];
  if (!reaction) return;

  moodText.textContent = reaction.mood;

  catDisplay.classList.remove("bounce", "purr", "wiggle", "sparkle");
  void catDisplay.offsetWidth;
  catDisplay.classList.add(reaction.animation);

  pixelCat.classList.remove(
    "is-idle",
    "is-feed",
    "is-pet",
    "is-play",
    "is-rest",
    "is-hungry",
    "is-sad"
  );
  pixelCat.classList.add(reaction.stateClass);

  if (isNightMode()) {
    setNightSleepVisual(true);
  }
}

function applyAction(action) {
  if (action === "feed") {
    state.hunger = clamp(state.hunger + 22);
    state.happiness = clamp(state.happiness + 6);
    state.energy = clamp(state.energy + 2);
  } else if (action === "pet") {
    state.happiness = clamp(state.happiness + 18);
    state.energy = clamp(state.energy + 4);
    state.hunger = clamp(state.hunger - 4);
  } else if (action === "play") {
    state.happiness = clamp(state.happiness + 14);
    state.energy = clamp(state.energy - 16);
    state.hunger = clamp(state.hunger - 10);
  }

  renderStats();
  if (isNightMode()) {
    updateCat("rest");
    moodText.textContent = "Nami is sleeping... she wiggles a little in her dreams.";
  } else {
    updateCat(action);
    emitParticles(action);
  }
}

function passiveNeeds() {
  state.hunger = clamp(state.hunger - 3);
  state.happiness = clamp(state.happiness - 2);
  state.energy = clamp(state.energy - 2);

  if (state.energy <= 15) {
    state.energy = clamp(state.energy + 16);
    state.happiness = clamp(state.happiness + 4);
    updateCat("rest");
  } else if (isNightMode()) {
    setNightSleepVisual(true);
    moodText.textContent = "Nami is peacefully sleeping under the moonlight.";
  } else if (state.hunger < 20) {
    moodText.textContent = "Nami looks hungry... maybe feed her soon.";
    pixelCat.classList.remove("is-sad");
    pixelCat.classList.add("is-hungry");
  } else if (state.happiness < 20) {
    moodText.textContent = "Nami feels lonely. A little pet would help.";
    pixelCat.classList.remove("is-hungry");
    pixelCat.classList.add("is-sad");
  } else {
    pixelCat.classList.remove("is-hungry", "is-sad");
  }

  renderStats();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.action) {
      applyAction(button.dataset.action);
    }
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("night");
  const isNight = document.body.classList.contains("night");
  themeToggle.textContent = isNight ? "Day" : "Night";
  setNightSleepVisual(isNight);
  moodText.textContent = isNight
    ? "Night mode on. Nami curls up and falls asleep."
    : "Day mode on. Nami wakes up to cozy sunshine!";
});

renderStats();
pixelCat.classList.add("is-idle");
setNightSleepVisual(false);
setInterval(passiveNeeds, 8000);
