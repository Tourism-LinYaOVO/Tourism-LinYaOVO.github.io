// 获取当前路径信息
const currentPath = window.location.pathname;
const currentOrigin = window.location.origin;
// 🔧 修复：正确获取当前目录
const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1) || '/';

fetch("/navbar/navbar.json")
  .then(res => res.json())
  .then(renderNavbar)
  .catch(console.error);

function renderNavbar(data) {
  document.getElementById("logo-img").src = data.logo.src;
  document.getElementById("logo-text").innerText = data.logo.text;

  const menu = document.getElementById("menu");
  menu.innerHTML = "";
  data.menu.forEach(item => {
    menu.appendChild(createMenuItem(item));
  });

  initBehavior();
  disableCurrentPathLinks();
}

function createMenuItem(item) {
  // 🔧 修复：检查是否为外部链接
  const isExternalLink = item.link && (
    item.link.startsWith('http://') ||
    item.link.startsWith('https://') ||
    item.link.startsWith('//')
  );

  // 如果是链接（无论是否有子菜单）
  if (item.link) {
    const el = document.createElement("a");
    el.className = "menu-item";
    el.href = item.link;
    el.textContent = item.label;

    // 🔧 关键修复：对所有链接项应用路径检测
    if (!isExternalLink && isCurrentPath(item.link)) {
      el.classList.add("current-page");
      el.href = "javascript:void(0)";
      el.setAttribute("aria-disabled", "true");
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
        const childItem = createMenuItem(child); // 🔧 递归创建子菜单项
        dropdown.appendChild(childItem);
      });
      el.appendChild(dropdown);
    }

    return el;
  } else {
    // 无link的纯容器项
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
        const childItem = createMenuItem(child); // 🔧 递归创建子菜单项
        dropdown.appendChild(childItem);
      });
      el.appendChild(dropdown);
    }

    return el;
  }
}

// 🔧 终极修复：正确处理所有类型的路径
function isCurrentPath(linkPath) {
  try {
    // 1. 外部链接直接排除
    if (linkPath.startsWith('http://') || 
        linkPath.startsWith('https://') || 
        linkPath.startsWith('//')) {
      const linkUrl = new URL(linkPath);
      if (linkUrl.origin !== currentOrigin) return false;
      linkPath = linkUrl.pathname;
    } 
    // 2. 绝对路径（以/开头）直接使用
    else if (linkPath.startsWith('/')) {
      // 无需处理
    } 
    // 3. 相对路径：基于当前目录解析
    else {
      // 🔧 关键修复：使用当前目录作为基URL
      linkPath = new URL(linkPath, currentOrigin + currentDir).pathname;
    }

    // 4. 标准化路径（去除尾部斜杠）
    const normalize = (path) => path.replace(/\/$/, '') || '/';
    const normalizedLinkPath = normalize(linkPath);
    const normalizedCurrentPath = normalize(currentPath);

    // 🔧 调试：打印比较信息
    console.log('Comparing:', normalizedLinkPath, 'with', normalizedCurrentPath);

    return normalizedLinkPath === normalizedCurrentPath;
  } catch (e) {
    console.warn("Invalid link path:", linkPath);
    return false;
  }
}

function initBehavior() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  // 汉堡菜单
  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  // 移动端逻辑
  if (window.innerWidth <= 768) {
    setupMobileMenu();
  }

  // 窗口大小改变时重新初始化
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      setupMobileMenu();
    } else {
      cleanupMobileMenu();
    }
  });

  // 点击页面其他地方关闭菜单
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
  // 如果是当前页面的链接，直接阻止
  if (this.tagName === "A" && this.classList.contains("current-page")) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (this.tagName === "A") return; // 普通链接直接跳转

  e.stopPropagation();

  const dropdown = this.querySelector(":scope > .dropdown");
  if (!dropdown) return;

  // 关闭同级的其他菜单
  const siblings = Array.from(this.parentElement.children);
  siblings.forEach(sibling => {
    if (sibling !== this) {
      sibling.classList.remove("active");
      const siblingDropdown = sibling.querySelector(":scope > .dropdown");
      if (siblingDropdown) {
        siblingDropdown.style.display = "none";
      }
    }
  });

  // 切换当前菜单
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

// 强制样式注入（防止被覆盖）
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
