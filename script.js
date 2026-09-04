// CreeperNodes front-end interactions
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Offer bar
  $("#offerClose")?.addEventListener("click", () => $(".offer-bar").remove());

  // Mobile navigation
  $("#mobileToggle")?.addEventListener("click", () => {
    $("#mainNav").classList.toggle("open");
  });

  // Dropdown helper
  function toggleDropdown(buttonId, menuId) {
    const button = $(buttonId);
    const menu = $(menuId);
    button?.addEventListener("click", (event) => {
      event.stopPropagation();
      $$(".dropdown-menu").forEach(m => {
        if (m !== menu) m.classList.remove("open");
      });
      menu.classList.toggle("open");
    });
  }
  toggleDropdown("#servicesButton", "#servicesMenu");
  toggleDropdown("#panelsButton", "#panelsMenu");

  document.addEventListener("click", () => $$(".dropdown-menu").forEach(m => m.classList.remove("open")));

  // Smooth scroll buttons
  $$("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Login / client area
  const loginModal = $("#loginModal");
  const openLogin = () => loginModal.classList.add("show");
  $("#clientButton")?.addEventListener("click", openLogin);

  // Close modals
  $$("[data-close]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.close)?.classList.remove("show"));
  });
  $$(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop) backdrop.classList.remove("show");
    });
  });

  // Demo login
  $("#loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    loginModal.classList.remove("show");
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  });

  // Demo button
  $("#viewDemo")?.addEventListener("click", () => {
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  });

  // Dashboard panel links
  $$("[data-panel]").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Sidebar tabs
  const titles = {
    overview: "My Servers",
    files: "Files",
    servers: "All Servers",
    billing: "Billing & Expiry",
    settings: "Account Settings"
  };

  $$(".side-item[data-tab]").forEach(item => {
    item.addEventListener("click", () => {
      $$(".side-item[data-tab]").forEach(x => x.classList.remove("active"));
      item.classList.add("active");
      $("#dashTitle").textContent = titles[item.dataset.tab] || "Dashboard";
    });
  });

  // Open server details
  const serverModal = $("#serverModal");
  $$(".server-row").forEach(row => {
    row.addEventListener("click", () => {
      const name = $(".server-name strong", row)?.textContent || "Game Server";
      const expiry = $(".server-expiry strong", row)?.textContent || "Not set";
      $("#serverModalName").textContent = name;
      $("#modalExpiry").textContent = expiry;
      serverModal.classList.add("show");
    });
  });

  // New server demo
  $("#newServerButton")?.addEventListener("click", () => {
    alert("Connect this button to your real order/provisioning system when your backend is ready.");
  });

  // Logout demo
  $("#logoutButton")?.addEventListener("click", () => {
    alert("Demo logout. A real login system needs a backend such as Firebase, Supabase, or your own API.");
    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
  });
});
