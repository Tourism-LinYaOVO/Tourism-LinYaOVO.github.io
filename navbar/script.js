fetch("/navbar/navbar.json")
  .then(res => {
    if (!res.ok) throw new Error("navbar.json not found");
    return res.json();
  })
  .then(renderNavbar)
  .catch(err => console.error(err));

function renderNavbar(data) {
  // 设置 Logo
  document.getElementById("logo-img").src = data.logo.src;
  document.getElementById("logo-text").innerText = data.logo.text;

  // 渲染菜单
  const menu = document.getElementById("menu");
  data.menu.forEach(item => {
    menu.appendChild(createMenuItem(item));
  });

  initBehavior();
}

/* 递归创建菜单项 */
function createMenuItem(item) {
  // ✅ 有链接且无子菜单 → 使用 <a>
  if (item.link && !item.children) {
    const el = document.createElement("a");
    el.className = "menu-item";
    el.href = item.link;
    el.textContent = item.label;
    return el;
  }

  // ✅ 有子菜单 → 使用 <div>
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

/* ✅ 初始化行为 - 桌面端和移动端分离 */
function initBehavior() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  // ✅ 汉堡菜单（移动端）
  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  // ✅ 桌面端：只使用 hover，不绑定 click
  // ✅ 移动端：绑定 click 事件
  if (window.innerWidth <= 768) {
    setupMobileMenu();
  }

  // ✅ 窗口大小改变时重新设置
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      setupMobileMenu();
    } else {
      // 桌面端：清理移动端事件
      cleanupMobileMenu();
    }
  });

  // ✅ 点击页面其他地方关闭菜单（仅移动端）
  document.addEventListener("click", e => {
    if (window.innerWidth <= 768 && !menu.contains(e.target)) {
      menu.classList.remove("open");
      closeAllDropdowns();
    }
  });
}

/* ✅ 移动端菜单逻辑 */
function setupMobileMenu() {
  const menuItems = document.querySelectorAll(".menu-item");
  
  menuItems.forEach(item => {
    // 移除旧的事件监听器（防止重复绑定）
    item.replaceWith(item.cloneNode(true));
  });

  // 重新获取元素并绑定事件
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", function(e) {
      e.stopPropagation();
      
      const dropdown = this.querySelector(":scope > .dropdown");
      if (!dropdown) return;

      // ✅ 关闭同级其他菜单
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

      // ✅ 切换当前菜单
      this.classList.toggle("active");
      dropdown.style.display = 
        dropdown.style.display === "block" ? "none" : "block";
    });
  });
}

/* ✅ 清理移动端事件（桌面端用） */
function cleanupMobileMenu() {
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => {
    const newItem = item.cloneNode(true);
    item.parentNode.replaceChild(newItem, item);
  });
  
  // 关闭所有下拉菜单
  closeAllDropdowns();
  document.getElementById("menu").classList.remove("open");
}

/* ✅ 关闭所有下拉菜单 */
function closeAllDropdowns() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
    item.querySelectorAll(".dropdown").forEach(dropdown => {
      dropdown.style.display = "none";
    });
  });
}
