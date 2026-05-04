// 获取当前路径（标准化处理）
const currentPath = window.location.pathname;

fetch("/navbar/navbar.json")
  .then(res => res.json())
  .then(renderNavbar)
  .catch(console.error);

function renderNavbar(data) {
  document.getElementById("logo-img").src = data.logo.src;
  document.getElementById("logo-text").innerText = data.logo.text;

  const menu = document.getElementById("menu");
  menu.innerHTML = ""; // 清空旧内容
  data.menu.forEach(item => {
    menu.appendChild(createMenuItem(item));
  });

  initBehavior();
  disableCurrentPathLinks(); // 确保调用
}

function createMenuItem(item) {
  // 🔴 关键修复：所有带 link 的项都生成 <a>，无论是否有子菜单
  if (item.link) {
    const el = document.createElement("a");
    el.className = "menu-item";
    el.href = item.link;
    el.textContent = item.label;

    // 检查是否为当前路径
    if (isCurrentPath(item.link)) {
      el.classList.add("current-page");
      el.href = "javascript:void(0)";
      el.setAttribute("aria-disabled", "true");
      // 强制阻止跳转
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    }

    // 处理子菜单（如果有）
    if (item.children) {
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.innerHTML = "▾";
      el.appendChild(arrow);

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";
      item.children.forEach(child => {
        dropdown.appendChild(createMenuItem(child));
      });
      el.appendChild(dropdown);
    }

    return el;
  } else {
    // 无 link 的纯容器项
    const el = document.createElement("div");
    el.className = "menu-item";
    el.innerHTML = item.label;

    if (item.children) {
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.innerHTML = "▾";
      el.appendChild(arrow);

      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";
      item.children.forEach(child => {
        dropdown.appendChild(createMenuItem(child));
      });
      el.appendChild(dropdown);
    }

    return el;
  }
}

// 🔴 修复路径匹配逻辑（支持相对/绝对路径）
function isCurrentPath(linkPath) {
  try {
    // 解析链接路径（处理相对路径）
    const linkUrl = new URL(linkPath, window.location.origin);
    const linkPathname = linkUrl.pathname;
    const currentPathname = window.location.pathname;

    // 标准化：去掉尾部斜杠，根路径特殊处理
    const normalize = (path) => path.replace(/\/$/, "") || "/";
    return normalize(linkPathname) === normalize(currentPathname);
  } catch (e) {
    console.warn("Invalid link path:", linkPath);
    return false;
  }
}

function initBehavior() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  if (window.innerWidth <= 768) setupMobileMenu();

  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      setupMobileMenu();
    } else {
      cleanupMobileMenu();
    }
  });

  document.addEventListener("click", e => {
    if (window.innerWidth <= 768 && !menu.contains(e.target)) {
      menu.classList.remove("open");
      closeAllDropdowns();
    }
  });
}

let mobileListenersAttached = false;

function setupMobileMenu() {
  if (mobileListenersAttached) return;
  mobileListenersAttached = true;

  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", handleMobileClick);
  });
}

function handleMobileClick(e) {
  // 🔴 关键：如果是当前页面的链接，直接阻止
  if (this.tagName === "A" && this.classList.contains("current-page")) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (this.tagName === "A") return; // 普通链接直接跳转

  e.stopPropagation();
  const dropdown = this.querySelector(":scope > .dropdown");
  if (!dropdown) return;

  // 关闭同级菜单
  Array.from(this.parentElement.children).forEach(sibling => {
    if (sibling !== this) {
      sibling.classList.remove("active");
      const siblingDropdown = sibling.querySelector(":scope > .dropdown");
      if (siblingDropdown) siblingDropdown.style.display = "none";
    }
  });

  this.classList.toggle("active");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

function cleanupMobileMenu() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.removeEventListener("click", handleMobileClick);
  });
  mobileListenersAttached = false;
  closeAllDropdowns();
  document.getElementById("menu").classList.remove("open");
}

function closeAllDropdowns() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
    item.querySelectorAll(".dropdown").forEach(d => {
      d.style.display = "none";
    });
  });
}

// 🔴 强制样式注入（防止被覆盖）
function disableCurrentPathLinks() {
  const style = document.createElement("style");
  style.textContent = `
    .menu-item.current-page {
      color: #999 !important;
      cursor: default !important;
      pointer-events: none !important;
      opacity: 0.7;
      text-decoration: none !important;
    }
    .menu-item.current-page:hover {
      background: transparent !important;
      color: #999 !important;
    }
    @media (min-width: 769px) {
      .menu-item.current-page:hover {
        color: #999 !important;
      }
    }
  `;
  document.head.appendChild(style);
}
