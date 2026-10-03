(() => {
  "use strict";

  const slides = Array.from(document.querySelectorAll(".slide"));
  const progressSteps = Array.from(document.querySelectorAll(".progress-step"));
  const previousButton = document.getElementById("prev-slide");
  const nextButton = document.getElementById("next-slide");
  const currentSlideText = document.getElementById("current-slide");
  const fullscreenButton = document.getElementById("fullscreen-toggle");
  const stage = document.getElementById("stage");
  let activeIndex = 0;
  let touchStartX = null;

  const clampIndex = (index) => Math.max(0, Math.min(slides.length - 1, index));
  const formatNumber = (number) => String(number).padStart(2, "0");

  function showSlide(index, options = {}) {
    const nextIndex = clampIndex(index);
    activeIndex = nextIndex;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
      if (isActive) slide.scrollTop = 0;
    });

    progressSteps.forEach((step, stepIndex) => {
      const isCurrent = stepIndex === activeIndex;
      step.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        step.setAttribute("aria-current", "step");
      } else {
        step.removeAttribute("aria-current");
      }
    });

    currentSlideText.textContent = formatNumber(activeIndex + 1);
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slides.length - 1;

    const label = slides[activeIndex].getAttribute("aria-label");
    document.title = `${formatNumber(activeIndex + 1)} / ${formatNumber(slides.length)} · ${label.replace(/^Diapositiva \d+ de \d+:\s*/, "")} · Sensores + Arduino`;

    if (options.focus) {
      slides[activeIndex].focus({ preventScroll: true });
    }
  }

  previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

  progressSteps.forEach((step) => {
    step.addEventListener("click", () => showSlide(Number(step.dataset.goTo), { focus: true }));
  });

  document.addEventListener("keydown", (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

    const target = event.target;
    const isEditing = target instanceof HTMLElement && (
      target.isContentEditable ||
      target.matches("input, textarea, select")
    );
    const isButton = target instanceof HTMLElement && target.closest("button, a");
    if (isEditing) return;

    if (event.key === "ArrowRight" || event.key === "PageDown") {
      event.preventDefault();
      showSlide(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
      event.preventDefault();
      showSlide(activeIndex - 1);
    } else if (event.key === " " && !isButton) {
      event.preventDefault();
      showSlide(activeIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1);
    }
  });

  // Touch swipe navigation; interactive controls remain usable without triggering a slide change.
  stage.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (event.pointerType !== "touch" || !(target instanceof Element)) return;
    if (target.closest("button, a, input, label, .simulator")) return;
    touchStartX = event.clientX;
  }, { passive: true });

  stage.addEventListener("pointerup", (event) => {
    if (touchStartX === null || event.pointerType !== "touch") return;
    const distance = event.clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) < 65) return;
    showSlide(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  stage.addEventListener("pointercancel", () => { touchStartX = null; }, { passive: true });

  // Small soil-moisture rule demo. This only illustrates logic; it is not connected to a sensor.
  const moistureSlider = document.getElementById("moisture-slider");
  const moistureValue = document.getElementById("moisture-value");
  const gaugeFill = document.getElementById("gauge-fill");
  const decision = document.getElementById("sim-decision");
  const decisionIcon = document.getElementById("decision-icon");
  const decisionTitle = document.getElementById("decision-title");
  const decisionCopy = document.getElementById("decision-copy");
  const dryThreshold = 35;

  function updateMoistureDemo(rawValue) {
    const value = Math.max(0, Math.min(100, Number(rawValue)));
    const isDry = value <= dryThreshold;

    moistureValue.textContent = String(value);
    gaugeFill.style.setProperty("--level", `${value}%`);
    moistureSlider.setAttribute("aria-valuetext", `${value} por ciento; ${isDry ? "suelo seco, riego sugerido" : "condición estable"}`);
    decision.classList.toggle("is-dry", isDry);

    if (isDry) {
      decisionIcon.textContent = "!";
      decisionTitle.textContent = "Suelo seco · revisión";
      decisionCopy.textContent = "La regla simulada sugiere revisar el riego.";
    } else {
      decisionIcon.textContent = "✓";
      decisionTitle.textContent = "Condición estable";
      decisionCopy.textContent = "Sin riego sugerido por ahora.";
    }
  }

  moistureSlider.addEventListener("input", (event) => updateMoistureDemo(event.currentTarget.value));
  document.querySelectorAll("[data-sim-value]").forEach((button) => {
    button.addEventListener("click", () => {
      moistureSlider.value = button.dataset.simValue;
      updateMoistureDemo(moistureSlider.value);
    });
  });

  // Citation markers navigate to the corresponding APA reference on the last slide.
  document.querySelectorAll("[data-reference]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const referenceId = link.dataset.reference;
      showSlide(slides.length - 1);
      window.requestAnimationFrame(() => {
        const reference = document.getElementById(referenceId);
        if (!reference) return;
        reference.classList.add("is-highlighted");
        reference.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
        reference.setAttribute("tabindex", "-1");
        reference.focus({ preventScroll: true });
        window.setTimeout(() => reference.classList.remove("is-highlighted"), 1800);
      });
    });
  });

  function syncFullscreenLabel() {
    const isFullscreen = Boolean(document.fullscreenElement);
    fullscreenButton.setAttribute("aria-label", isFullscreen ? "Salir de pantalla completa" : "Activar pantalla completa");
    fullscreenButton.title = isFullscreen ? "Salir de pantalla completa" : "Pantalla completa";
  }

  fullscreenButton.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      // Fullscreen is an optional browser capability, so navigation remains unaffected if denied.
      console.info("El navegador no permitió activar pantalla completa.", error);
    }
    syncFullscreenLabel();
  });
  document.addEventListener("fullscreenchange", syncFullscreenLabel);

  showSlide(0);
})();
