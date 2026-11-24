const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlayMenu");
const sideBar = document.getElementById("sideBar");

function openMenu() {
  sideBar.classList.add("active");
  overlay.classList.add("active");
  menuBtn.classList.add("active");

  menuBtn.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  sideBar.classList.remove("active");
  overlay.classList.remove("active");
  menuBtn.classList.remove("active");

  menuBtn.setAttribute("aria-expanded", "false");
}

menuBtn.addEventListener("click", () => {
  const isOpen = sideBar.classList.contains("active");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

overlay.addEventListener("click", closeMenu);

document.querySelectorAll(".sidebar nav a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

function ajustarScale() {
  const escala = 1.15 / window.devicePixelRatio;
  const streetStyle = document.querySelector("body .street-style");

  if (!streetStyle) return;

  streetStyle.style.transform = `scale(${escala})`;
}

window.addEventListener("resize", ajustarScale);

ajustarScale();

// CARROSSEL

const container = document.querySelector(".cards");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

const card = document.querySelector(".card");

next.addEventListener("click", function () {
  container.scrollBy({
    left: card.offsetWidth + 35,
    behavior: "smooth",
  });
});

prev.addEventListener("click", function () {
  container.scrollBy({
    left: -(card.offsetWidth + 35),
    behavior: "smooth",
  });
});

// INTRO
const enterBtn = document.getElementById("enterBtn");

const intro = document.getElementById("intro");

enterBtn.addEventListener("click", () => {
  intro.style.opacity = "0";
  intro.style.visibility = "hidden";
});

// CLIQUES

const sounds = {
  backgound: new Audio("/public/assets/sounds/click-padrao.mp3"),
  button: new Audio("/public/assets/sounds/btnEnter.mp3"),
  link: new Audio("/public/assets/sounds/link.mp3"),
  carrossel: new Audio("/public/assets/sounds/carrossel.mp3"),
};

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

document.addEventListener("click", (event) => {
  const interactive = event.target.closest(
    "button, a, input, select, textarea",
  );
  const button = event.target.closest("#enterBtn");
  const link = event.target.closest("a");
  const carrossel = event.target.closest("#prev, #next");

  if (!interactive) {
    playSound(sounds.backgound);
  }

  if (button) {
    playSound(sounds.button);
  }

  if (link) {
    playSound(sounds.link);
  }

  if (carrossel) {
    playSound(sounds.carrossel);
  }
});

const projectOverlay = document.getElementById("projectOverlay");
const projectPanel = document.getElementById("projectPanel");

const projectClose = document.getElementById("projectClose");

const projectNumber = document.getElementById("projectNumber");
const projectTitle = document.getElementById("projectTitle");
const projectDescription = document.getElementById("projectDescription");

const projectLink = document.getElementById("projectLink");

const projects = {
  1: {
    number: "PROJETO 04",
    title: "Beleza",
    description:
      "Descubra tendências, explore serviços de beleza, conheça profissionais e encontre opções para cuidar da sua aparência e autoestima. Um espaço desenvolvido para conectar você a experiências de cuidado, estilo e valorização pessoal.",
    color: "pink",
    image: "/public/assets/images/Main/beleza1.png",
    link: "/src/pages/Beleza/Beleza.html",
  },

  2: {
    number: "PROJETO 02",
    title: "Bem estar",
    description:
      "Explore novas possibilidades de lazer, descubra experiências, conheça lugares e encontre opções para aproveitar melhor seu tempo livre. Um espaço desenvolvido para conectar pessoas a momentos especiais.",
    color: "green",
    image: "/public/assets/images/Main/lazer1.png",
    link: "/src/pages/Bem Estar/Bem_estar.html",
  },

  3: {
    number: "PROJETO 05",
    title: "Turismo",
    description:
      "Explore novos destinos, descubra pontos turísticos, conheça culturas e encontre experiências incríveis para suas próximas viagens. Um espaço desenvolvido para conectar pessoas a lugares especiais, aventuras e novas descobertas.",
    color: "orange",
    image: "/public/assets/images/Main/turismo1.png",
    link: "/src/pages/Turismo/Turismo.html",
  },

  4: {
    number: "PROJETO 04",
    title: "Saúde",
    description:
      "Cuide do seu bem-estar, descubra serviços de saúde, encontre profissionais e conheça opções para manter uma vida mais saudável. Um espaço desenvolvido para aproximar você de cuidados, qualidade de vida e novas possibilidades.",
    color: "blue",
    image: "/public/assets/images/Main/saude1.png",
    link: "/src/pages/Saúde/Saude.html",
  },
};

  // ABRIR PROJETO

  document.querySelectorAll("[data-project]").forEach((plate) => {
    plate.addEventListener("click", (event) => {
      event.preventDefault();

      const projectId = plate.dataset.project;
      const project = projects[projectId];

      if (!project) return;

      projectNumber.textContent = project.number;
      projectTitle.textContent = project.title;
      projectDescription.textContent = project.description;
      projectLink.href = project.link;

      projectPanel.className = "project-panel " + project.color;

      projectOverlay.classList.add("active");

      document.body.style.overflow = "hidden";

      projectPanel.style.setProperty(
        "--project-image",
        `url("${project.image}")`,
      );
    });
  });

  // FECHAR

  function closeProject() {
    projectOverlay.classList.remove("active");

document.body.style.overflow = "";
}

projectClose.addEventListener("click", closeProject);

// FECHAR COM ESC

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProject();
  }
});
