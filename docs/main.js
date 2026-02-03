const CONFIG = {
  name: "",
  greeting: "Dear",
  question: "Will you do me the honor and be my Valentine?",
  yesButtonText: "Yes! 💖",
  noButtonText: "No",
  celebrationTitle: "Yay! 🎉💖",
  celebrationMessage: "You made the right choice! Can't wait to spend Valentine's Day with you!",
  celebrationGif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHd3c2ptdTJsbmQ3eDM5MXphYzd4cGU2OGRqaXB1MHA3eWFjMjF4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0ivjwuwIbvjEqY1g3W/giphy.gif",
  confettiSound: "../sounds/confetti.mp3",
  escapeSound: "../sounds/quack.mp3",
};

// Set the content from config
document.getElementById("name-display").textContent = CONFIG.name;
document.getElementById("greeting-text").textContent = CONFIG.greeting;
document.getElementById("question-text").textContent = CONFIG.question;
document.getElementById("yes-btn").textContent = CONFIG.yesButtonText;
document.getElementById("no-btn").textContent = CONFIG.noButtonText;
document.getElementById("celebration-title").textContent = CONFIG.celebrationTitle;
document.getElementById("celebration-message").textContent = CONFIG.celebrationMessage;
document.getElementById("celebration-gif").src = CONFIG.celebrationGif;

const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const questionContainer = document.getElementById("question-container");
const celebration = document.getElementById("celebration");
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (!hasEscaped) positionNoButton();
});

// Make the No button run away from cursor
let yesScale = 1;
const maxYesScale = window.innerWidth < 600 ? 1.4 : 1.8;
let hasEscaped = false;

// Position the No button on page load (it's fixed from the start)
function positionNoButton() {
  const yesRect = yesBtn.getBoundingClientRect();
  const noWidth = noBtn.offsetWidth;
  const noHeight = noBtn.offsetHeight;

  // Smaller gap on mobile
  const gap = window.innerWidth < 600 ? 25 : 40;

  // Position No button to the right of Yes button
  const noX = yesRect.right + gap;
  const noY = yesRect.top + (yesRect.height - noHeight) / 2;

  noBtn.style.left = noX + "px";
  noBtn.style.top = noY + "px";
}

// Initial positioning
positionNoButton();

document.addEventListener("mousemove", (e) => {
  // Don't run if No button is hidden (celebration screen)
  if (noBtn.style.display === "none") return;

  handlePointerMove(e.clientX, e.clientY);
});

// Touch support for mobile
document.addEventListener(
  "touchmove",
  (e) => {
    if (noBtn.style.display === "none") return;

    const touch = e.touches[0];
    handlePointerMove(touch.clientX, touch.clientY);
  },
  { passive: true },
);

// Also handle tap near the No button on mobile
document.addEventListener(
  "touchstart",
  (e) => {
    if (noBtn.style.display === "none") return;

    const touch = e.touches[0];
    handlePointerMove(touch.clientX, touch.clientY);
  },
  { passive: true },
);

function handlePointerMove(clientX, clientY) {
  const rect = noBtn.getBoundingClientRect();
  const btnCenterX = rect.left + rect.width / 2;
  const btnCenterY = rect.top + rect.height / 2;

  const distX = clientX - btnCenterX;
  const distY = clientY - btnCenterY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  const triggerDistance = 150;

  if (distance < triggerDistance) {
    // First escape: slide Yes button to center
    if (!hasEscaped) {
      yesBtn.classList.add("centered");
      hasEscaped = true;
    }

    // Calculate escape direction (away from cursor)
    const escapeX = -distX / distance;
    const escapeY = -distY / distance;

    // Calculate new position
    const moveDistance = 100;
    let newX = rect.left + escapeX * moveDistance;
    let newY = rect.top + escapeY * moveDistance;

    // Keep button within viewport
    const padding = 20;
    const maxX = window.innerWidth - rect.width - padding;
    const maxY = window.innerHeight - rect.height - padding;

    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";

    // Play escape sound (throttled to prevent overlap)
    const now = Date.now();
    if (now - lastEscapeSoundTime > 150) {
      const escapeSoundClone = escapeSound.cloneNode();
      escapeSoundClone.volume = 0.3;
      escapeSoundClone.play().catch(() => {});
      lastEscapeSoundTime = now;
    }

    // Grow the Yes button each time No escapes (with cap)
    yesScale = Math.min(yesScale + 0.05, maxYesScale);
    yesBtn.style.transform = `translateX(0) scale(${yesScale})`;
  }
}

// Confetti animation
const confettiParticles = [];
const confettiColors = [
  "#e74c3c",
  "#f39c12",
  "#9b59b6",
  "#3498db",
  "#2ecc71",
  "#ff69b4",
  "#ff1493",
];

class ConfettiParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 10 + 5;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 4 - 2;
    this.color =
      confettiColors[Math.floor(Math.random() * confettiColors.length)];
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 10 - 5;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    ctx.restore();
  }
}

function createConfetti() {
  for (let i = 0; i < 150; i++) {
    confettiParticles.push(new ConfettiParticle());
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach((particle, index) => {
    particle.update();
    particle.draw();

    if (particle.y > canvas.height) {
      confettiParticles.splice(index, 1);
    }
  });

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

// Audio for confetti
const confettiSound = new Audio(CONFIG.confettiSound);
confettiSound.volume = 0.5;
confettiSound.preload = "auto";

// Audio for No button escape
const escapeSound = new Audio(CONFIG.escapeSound);
escapeSound.volume = 0.3;
escapeSound.preload = "auto";
let lastEscapeSoundTime = 0;

const backBtn = document.getElementById("back-btn");
const startOverlay = document.getElementById("start-overlay");
const envelope = document.getElementById("envelope");

// Handle envelope click to open and unlock audio
startOverlay.addEventListener("click", () => {
  // Unlock audio by playing and pausing
  escapeSound
    .play()
    .then(() => {
      escapeSound.pause();
      escapeSound.currentTime = 0;
    })
    .catch(() => {});

  confettiSound
    .play()
    .then(() => {
      confettiSound.pause();
      confettiSound.currentTime = 0;
    })
    .catch(() => {});

  // Open the envelope
  envelope.classList.add("opening");

  // Fade out overlay after envelope animation
  setTimeout(() => {
    startOverlay.classList.add("hidden");
  }, 500);
});

// Yes button click handler
yesBtn.addEventListener("click", () => {
  confettiSound.play().catch(() => {}); // Catch in case autoplay is blocked
  createConfetti();
  animateConfetti();

  // Hide question, show celebration after a short delay
  setTimeout(() => {
    questionContainer.style.display = "none";
    celebration.style.display = "block";
    noBtn.style.display = "none";
    backBtn.style.display = "block";

    // Add more confetti for the celebration
    setTimeout(() => {
      createConfetti();
      animateConfetti();
    }, 500);
  }, 1000);
});

// Back button click handler
backBtn.addEventListener("click", () => {
  celebration.style.display = "none";
  questionContainer.style.display = "flex";
  backBtn.style.display = "none";

  // Disable transitions temporarily
  noBtn.style.transition = "none";
  yesBtn.style.transition = "none";

  // Reset everything to initial state
  hasEscaped = false;
  yesScale = 1;
  lastEscapeSoundTime = 0;
  yesBtn.classList.remove("centered");
  yesBtn.style.transform = "";
  noBtn.style.display = "block";
  positionNoButton();

  // Re-enable transitions after a frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      noBtn.style.transition = "";
      yesBtn.style.transition = "";
    });
  });
});

// Create floating hearts background
function createFloatingHearts() {
  const container = document.getElementById("floating-hearts");
  const hearts = ["💕", "💖", "💗", "💓", "❤️", "💘"];

  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.animationDelay = Math.random() * 6 + "s";
    heart.style.fontSize = Math.random() * 20 + 15 + "px";
    container.appendChild(heart);
  }
}

createFloatingHearts();
