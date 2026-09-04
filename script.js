const publicSite = document.getElementById("publicSite");
const authView = document.getElementById("authView");
const dashboardView = document.getElementById("dashboardView");
const toastBox = document.getElementById("toast");

const servers = {
  survival: {
    name: "Survival SMP",
    address: "play.creepernodes.com:25565",
    expiry: "18 Oct 2026",
    remaining: "46 days remaining",
    cpu: "22.5%",
    ram: "2.19 GiB",
    disk: "28.4 GiB",
    network: "128 Mbps"
  },
  skyblock: {
    name: "Skyblock Test",
    address: "sb.creepernodes.com:25565",
    expiry: "20 Sep 2026",
    remaining: "12 days remaining",
    cpu: "13.8%",
    ram: "1.06 GiB",
    disk: "12.1 GiB",
    network: "74 Mbps"
  }
};

function hideAllMainViews() {
  publicSite.classList.add("hidden-view");
  authView.classList.add("hidden-view");
  dashboardView.classList.add("hidden-view");
}

function showPublic() {
  hideAllMainViews();
  publicSite.classList.remove("hidden-view");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openAuth() {
  hideAllMainViews();
  authView.classList.remove("hidden-view");
  window.scrollTo(0, 0);
}

function openDashboard() {
  hideAllMainViews();
  dashboardView.classList.remove("hidden-view");
  showPanelView("overview");
  window.scrollTo(0, 0);
}

function showPanelView(viewName) {
  document.querySelectorAll(".panel-view").forEach(v => v.classList.remove("active-panel-view"));
  const target = document.getElementById(viewName + "Panel");
  if (target) target.classList.add("active-panel-view");

  document.querySelectorAll(".side-item[data-view]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  const titles = {
    overview: ["Dashboard", "Welcome back. Here is your hosting overview."],
    servers: ["My Servers", "View and manage all your hosting services."],
    console: ["Console", "Manage your selected server through the live console."],
    files: ["Files", "Manage files for your server."],
    backups: ["Backups", "Create and restore server backups."],
    network: ["Network", "View network allocations and usage."],
    settings: ["Settings", "Manage your account and panel preferences."]
  };

  if (titles[viewName]) {
    document.getElementById("dashTitle").textContent = titles[viewName][0];
    document.getElementById("dashSubtitle").textContent = titles[viewName][1];
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".side-item[data-view]").forEach(btn => {
  btn.addEventListener("click", () => showPanelView(btn.dataset.view));
});

function openServer(serverKey) {
  const server = servers[serverKey] || servers.survival;

  document.getElementById("selectedServerName").textContent = server.name;
  document.getElementById("selectedServerAddress").textContent = server.address;
  document.getElementById("infoAddress").textContent = server.address;
  document.getElementById("expiryDate").textContent = server.expiry;
  document.getElementById("expiryCountdown").textContent = server.remaining;
  document.getElementById("cpuText").textContent = server.cpu;
  document.getElementById("ramText").textContent = server.ram;
  document.getElementById("diskText").textContent = server.disk;
  document.getElementById("netText").textContent = server.network;

  document.getElementById("cpuBar").style.width = serverKey === "skyblock" ? "13.8%" : "22.5%";
  document.getElementById("ramBar").style.width = serverKey === "skyblock" ? "34%" : "45.3%";
  document.getElementById("diskBar").style.width = serverKey === "skyblock" ? "24%" : "56.8%";
  document.getElementById("netBar").style.width = serverKey === "skyblock" ? "48%" : "68%";

  showPanelView("server");
  document.getElementById("dashTitle").textContent = server.name;
  document.getElementById("dashSubtitle").textContent = "Game server management panel";
}

document.querySelectorAll(".auth-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".auth-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const login = document.getElementById("loginForm");
    const signup = document.getElementById("signupForm");
    if (tab.dataset.tab === "login") {
      login.classList.remove("hidden-form");
      signup.classList.add("hidden-form");
    } else {
      signup.classList.remove("hidden-form");
      login.classList.add("hidden-form");
    }
  });
});

document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  localStorage.setItem("creepernodesDemoUser", "signed-in");
  openDashboard();
  toast("Signed in successfully");
});

document.getElementById("signupForm").addEventListener("submit", e => {
  e.preventDefault();
  localStorage.setItem("creepernodesDemoUser", "signed-in");
  openDashboard();
  toast("Account created in demo mode");
});

document.getElementById("commandForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = document.getElementById("commandInput");
  const command = input.value.trim();
  if (!command) return;

  const output = document.getElementById("consoleOutput");
  const now = new Date().toLocaleTimeString([], { hour12: false });
  output.textContent += `\n[${now} INFO]: > ${command}\n[${now} INFO]: Command accepted by demo panel.`;
  output.scrollTop = output.scrollHeight;
  input.value = "";
});

function clearConsole() {
  document.getElementById("consoleOutput").textContent = "[Console cleared]\n";
}

function toast(message) {
  toastBox.textContent = message;
  toastBox.classList.add("show-toast");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toastBox.classList.remove("show-toast"), 2800);
}

document.getElementById("mobileToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("open");
});

document.getElementById("year").textContent = new Date().getFullYear();
