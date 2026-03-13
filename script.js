// Symbiotic Dynamics - Interactive Scripts

document.addEventListener("DOMContentLoaded", () => {
  // Page load animation
  requestAnimationFrame(() => {
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  });

  // Throttle utility for scroll handlers
  function throttle(fn, wait) {
    let last = 0;
    let raf = null;
    return function () {
      const now = performance.now();
      if (now - last >= wait) {
        last = now;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(fn);
      }
    };
  }

  // Scroll progress indicator
  const scrollProgress = document.querySelector(".scroll-progress");
  if (scrollProgress) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = progress + "%";
    };
    window.addEventListener("scroll", throttle(updateProgress, 16), {
      passive: true,
    });
    updateProgress();
  }

  // Back to top button
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 600) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    };
    window.addEventListener("scroll", throttle(toggleBackToTop, 100), {
      passive: true,
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Mobile menu toggle
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      mobileMenu.setAttribute("aria-expanded", isOpen);
    });

    // Close mobile menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        mobileMenu.classList.remove("active");
        mobileMenu.setAttribute("aria-expanded", "false");
        mobileMenu.focus();
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // Close mobile menu if open
        if (navLinks) navLinks.classList.remove("active");
        if (mobileMenu) mobileMenu.classList.remove("active");
      }
    });
  });

  // Navbar background on scroll
  const nav = document.querySelector(".nav");
  if (nav) {
    const updateNavBg = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        nav.style.background = "rgba(10, 10, 15, 0.95)";
      } else {
        nav.style.background = "rgba(10, 10, 15, 0.8)";
      }
    };
    window.addEventListener("scroll", throttle(updateNavBg, 100), {
      passive: true,
    });
  }

  // IntersectionObserver feature gate
  if ("IntersectionObserver" in window) {
    // Active tab tracking based on scroll position
    const sections = document.querySelectorAll(
      "section[id], header[id], .section[id]",
    );
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinksAll.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );

    // Observe elements for animation
    document
      .querySelectorAll(".service-card, .stat, .capability-group")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
      });

    // Performance Optimization: Pause animations when not visible
    const animatedSections = document.querySelectorAll(".hero, #vortex");

    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const animatedElements = entry.target.querySelectorAll(
            ".atom-wrapper, .orbit, .electron, .electron-shell, " +
              ".vortex, .vortex-ring, .vortex-core, .particle, .flow-line, .obstacle-glow",
          );

          if (entry.isIntersecting) {
            animatedElements.forEach((el) => {
              el.style.animationPlayState = "running";
            });
            entry.target.classList.remove("animations-paused");
          } else {
            animatedElements.forEach((el) => {
              el.style.animationPlayState = "paused";
            });
            entry.target.classList.add("animations-paused");
          }
        });
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    animatedSections.forEach((section) => {
      if (section) animationObserver.observe(section);
    });
  }

  // Add visible class styles
  const style = document.createElement("style");
  style.textContent = `
        .service-card.visible,
        .stat.visible,
        .capability-group.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .nav-links.active {
            display: flex;
            position: absolute;
            top: 72px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: rgba(10, 10, 15, 0.98);
            padding: 24px;
            gap: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mobile-menu.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
  document.head.appendChild(style);

  // Form submission — builds mailto with form data
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.querySelector("#name").value.trim();
      const email = form.querySelector("#email").value.trim();
      const company = form.querySelector("#company").value.trim();
      const inquiry = form.querySelector("#inquiry").value;
      const message = form.querySelector("#message").value.trim();

      const subject = encodeURIComponent(
        `[SFA Inquiry] ${inquiry ? inquiry.charAt(0).toUpperCase() + inquiry.slice(1) : "General"} — ${name}`,
      );
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nOrganization: ${company || "N/A"}\nInquiry Type: ${inquiry || "Not specified"}\n\n${message}`,
      );

      window.location.href = `mailto:yuri@symbioticastrodynamics.com?subject=${subject}&body=${body}`;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = "Opening email client...";
      submitBtn.style.background = "#10b981";
      setTimeout(() => {
        submitBtn.textContent = "Submit Inquiry";
        submitBtn.style.background = "";
      }, 3000);
    });
  }

  // Parallax effect on hero visual (subtle movement on mouse)
  // SAFEGUARDS: Clamp Y to prevent upward movement into nav
  const heroVisual = document.querySelector(".hero-visual");
  let parallaxEnabled = heroVisual && window.innerWidth > 768;
  let parallaxHandler = null;

  function setupParallax() {
    if (parallaxHandler) {
      window.removeEventListener("mousemove", parallaxHandler);
      parallaxHandler = null;
    }
    parallaxEnabled = heroVisual && window.innerWidth > 768;
    if (parallaxEnabled) {
      parallaxHandler = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const rawY = (e.clientY / window.innerHeight - 0.5) * 10;
        const y = Math.max(0, rawY);
        heroVisual.style.transform = `translate(${x}px, ${y}px)`;
      };
      window.addEventListener("mousemove", parallaxHandler);
    } else if (heroVisual) {
      heroVisual.style.transform = "";
    }
  }

  if (heroVisual) {
    setupParallax();
    window.addEventListener("resize", setupParallax);
  }

  // Realistic Electron Configurations
  const electronConfigs = {
    iron: {
      symbol: "Fe",
      number: 26,
      name: "Iron",
      shells: [2, 8, 14, 2],
      color: "#f97316",
    },
    copper: {
      symbol: "Cu",
      number: 29,
      name: "Copper",
      shells: [2, 8, 18, 1],
      color: "#fbbf24",
    },
    gold: {
      symbol: "Au",
      number: 79,
      name: "Gold",
      shells: [2, 8, 18, 32, 18, 1],
      color: "#fcd34d",
    },
    titanium: {
      symbol: "Ti",
      number: 22,
      name: "Titanium",
      shells: [2, 8, 10, 2],
      color: "#a78bfa",
    },
    platinum: {
      symbol: "Pt",
      number: 78,
      name: "Platinum",
      shells: [2, 8, 18, 32, 17, 1],
      color: "#e2e8f0",
    },
    cobalt: {
      symbol: "Co",
      number: 27,
      name: "Cobalt",
      shells: [2, 8, 15, 2],
      color: "#60a5fa",
    },
  };

  const atomContainer = document.querySelector(".atom-container");
  const electronShellsContainer = document.querySelector(".electron-shells");
  const nucleusLabel = document.querySelector(".nucleus-label");
  const cubeFaces = document.querySelectorAll(".cube-face");
  const cubeContainer = document.querySelector(".element-cube-container");
  const modelTag = document.querySelector(".model-tag");

  const cubePositions = [
    "pos-top-left",
    "pos-top-right",
    "pos-center-right",
    "pos-bottom-right",
    "pos-bottom-left",
    "pos-center-left",
  ];

  let shellTransitionTimeout = null;
  let flashTimeout = null;

  function createElectronShells(elementKey) {
    if (!electronShellsContainer) return;

    const config = electronConfigs[elementKey];

    electronShellsContainer.style.opacity = "0";
    electronShellsContainer.style.transform =
      "translate(-50%, -50%) scale(0.8)";

    if (shellTransitionTimeout) clearTimeout(shellTransitionTimeout);
    shellTransitionTimeout = setTimeout(() => {
      electronShellsContainer.innerHTML = "";

      config.shells.forEach((electronCount, shellIndex) => {
        const shell = document.createElement("div");
        shell.className = `electron-shell shell-${shellIndex + 1}`;
        shell.style.borderColor = `${config.color}40`;

        const visibleElectrons = Math.min(electronCount, 8);
        for (let i = 0; i < visibleElectrons; i++) {
          const electron = document.createElement("div");
          electron.className = "shell-electron";
          electron.style.background = config.color;
          electron.style.boxShadow = `0 0 10px ${config.color}, 0 0 20px ${config.color}60`;

          const angle = (i / visibleElectrons) * 360;
          electron.style.transform = `rotate(${angle}deg) translateX(${(shellIndex + 1) * 25 + 15}px)`;

          shell.appendChild(electron);
        }

        electronShellsContainer.appendChild(shell);
      });

      electronShellsContainer.style.opacity = "1";
      electronShellsContainer.style.transform =
        "translate(-50%, -50%) scale(1)";

      if (nucleusLabel) {
        nucleusLabel.textContent = `${config.shells.length} shells · ${config.number} electrons`;
        nucleusLabel.style.color = config.color;
      }
    }, 300);
  }

  function updateCubePosition(index) {
    if (!cubeContainer) return;
    cubePositions.forEach((pos) => cubeContainer.classList.remove(pos));
    cubeContainer.classList.add(cubePositions[index % cubePositions.length]);
  }

  function setActiveElement(elementKey, index = 0) {
    if (!atomContainer) return;

    atomContainer.style.filter = "brightness(1.5)";
    if (flashTimeout) clearTimeout(flashTimeout);
    flashTimeout = setTimeout(() => {
      atomContainer.style.filter = "brightness(1)";
    }, 200);

    atomContainer.setAttribute("data-element", elementKey);
    createElectronShells(elementKey);
    updateCubePosition(index);

    cubeFaces.forEach((face) => {
      if (face.getAttribute("data-element") === elementKey) {
        face.classList.add("active");
      } else {
        face.classList.remove("active");
      }
    });

    if (modelTag) {
      const config = electronConfigs[elementKey];
      modelTag.style.borderColor = `${config.color}50`;
      modelTag.style.color = config.color;
      modelTag.style.background = `${config.color}15`;
    }
  }

  const cubeRotationOrder = [
    "iron",
    "copper",
    "gold",
    "platinum",
    "titanium",
    "cobalt",
  ];
  let currentElementIndex = 0;
  let cycleInterval = null;

  function cycleWithCube() {
    currentElementIndex = (currentElementIndex + 1) % cubeRotationOrder.length;
    setActiveElement(
      cubeRotationOrder[currentElementIndex],
      currentElementIndex,
    );
  }

  cubeFaces.forEach((face) => {
    const activateFace = () => {
      const elementKey = face.getAttribute("data-element");
      currentElementIndex = cubeRotationOrder.indexOf(elementKey);
      setActiveElement(elementKey, currentElementIndex);
    };
    face.addEventListener("click", activateFace);
    face.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateFace();
      }
    });
  });

  if (atomContainer) {
    if (electronShellsContainer) {
      electronShellsContainer.style.transition =
        "opacity 0.3s ease, transform 0.3s ease";
    }
    atomContainer.style.transition = "filter 0.2s ease";

    setActiveElement("iron", 0);
    cycleInterval = setInterval(cycleWithCube, 4000);

    // Clean up interval on page unload
    window.addEventListener("pagehide", () => {
      if (cycleInterval) clearInterval(cycleInterval);
      if (shellTransitionTimeout) clearTimeout(shellTransitionTimeout);
      if (flashTimeout) clearTimeout(flashTimeout);
    });
  }
});
