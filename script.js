const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Current year
$("#year").textContent = new Date().getFullYear();

// Mobile menu
const menuToggle = $(".menu-toggle");
const navbar = $(".navbar");
menuToggle?.addEventListener("click", () => {
  navbar.classList.toggle("menu-open");
});

// Offer close
$(".offer-close")?.addEventListener("click", () => {
  $(".offer-bar").style.display = "none";
});

// Coupon copy
const toast = $("#toast");
$("[data-copy]")?.addEventListener("click", async (event) => {
  const code = event.currentTarget.dataset.copy;
  try {
    await navigator.clipboard.writeText(code);
    toast.textContent = `${code} copied!`;
  } catch {
    toast.textContent = `Code: ${code}`;
  }
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
});

// Panel tabs
const panelTabs = $$(".panel-tab");
panelTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    panelTabs.forEach(item => item.classList.remove("active"));
    $$(".panel-screen").forEach(screen => screen.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel)?.classList.add("active");
  });
});

// FAQ accordion
$$(".faq-item button").forEach(button => {
  button.addEventListener("click", () => {
    button.closest(".faq-item").classList.toggle("open");
  });
});

// FAQ filters
const filters = $$(".faq-filter");
const faqItems = $$(".faq-item");
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    filter.classList.add("active");
    const category = filter.dataset.filter;
    faqItems.forEach(item => {
      item.style.display = category === "all" || item.dataset.category === category ? "" : "none";
    });
  });
});

// FAQ search
$("#faqSearch")?.addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase().trim();
  faqItems.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
  });
});

// Demo latency test
$("#pingButton")?.addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.textContent = "Testing...";
  button.disabled = true;

  const locations = {
    Mumbai: [18, 42],
    Singapore: [45, 78],
    Frankfurt: [110, 180],
    Dubai: [55, 100]
  };

  await new Promise(resolve => setTimeout(resolve, 850));

  $$("[data-ping]").forEach(item => {
    const [min, max] = locations[item.dataset.ping];
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    item.textContent = `${value} ms`;
  });

  button.textContent = "Test Again ⚡";
  button.disabled = false;
});

// Animated statistics
const animateCounters = () => {
  const counters = $$("[data-count]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1100;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = `${value}${target >= 1000 ? "+" : "+"}`;
        if (progress < 1) requestAnimationFrame(tick);
        else {
          el.textContent = `${target}${target >= 1000 ? "+" : "+"}`;
          el.dataset.done = "true";
        }
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: .5 });

  counters.forEach(counter => observer.observe(counter));
};

animateCounters();

// Dismiss CTA button
$("#dismissOffer")?.addEventListener("click", () => {
  $(".cta-section").style.display = "none";
});

// Smooth close mobile menu after navigation
$$(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navbar.classList.remove("menu-open"));
});
