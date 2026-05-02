fetch("/navbar/navbar.json")
  .then(res => {
    if (!res.ok) throw new Error("navbar.json not found");
    return res.json();
  })
  .then(renderNavbar)
  .catch(err => console.error(err));

function renderNavbar(data) {
  document.getElementById("logo-img").src = data.logo.src;
  document.getElementById("logo-text").innerText = data.logo.text;

  const menu = document.getElementById("menu");
  data.menu.forEach(item => {
    menu.appendChild(createMenuItem(item));
  });

  initBehavior();
}

/* 递归创建菜单 - 修复版 */
function createMenuItem(item) {
  let el;

  // ✅ 有 link 且无 children → a 标签（可点击跳转）
  if (item.link && !item.children) {
    el = document.createElement("a");
    el.href = item.link;
    el.className = "menu-item";
    el.textContent = item.label;
    return el;
  }

  // ✅ 有 children 或没有 link → div（不可跳转，只做展开）
  el = document.createElement("div");
  el.className = "menu-item";
  el.textContent = item.label;

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

/* ✅ 行为逻辑 - 彻底修复版 */
function initBehavior() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  // ✅ 汉堡菜单
  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  // ✅ 区分桌面端和移动端
  if (window.innerWidth <= 768) {
    // 📱 移动端：点击展开/收起
    document.querySelectorAll(".menu-item").forEach(item => {
      item.addEventListener("click", function (e) {
        const dropdown = this.querySelector(":scope > .dropdown");
        if (!dropdown) return;

        e.preventDefault();
        e.stopPropagation();

        // 关闭同级其他菜单
        Array.from(this.parentElement.children).forEach(sibling => {
          if (sibling !== this) {
            sibling.classList.remove("active");
            sibling.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
          }
        });

        // 切换当前菜单
        this.classList.toggle("active");
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      });
    });

    // 点击空白关闭
    document.addEventListener("click", e => {
      if (!menu.contains(e.target)) {
        menu.classList.remove("open");
        document.querySelectorAll(".menu-item").forEach(i => {
          i.classList.remove("active");
          i.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
        });
      }
    });
  } else {
    // 🖥️ 桌面端：纯 CSS hover，不需要 JS 干预
    // 确保下拉菜单在桌面端可见
    document.querySelectorAll(".dropdown").forEach(dropdown => {
      dropdown.style.display = "";
    });
  }
}

// ✅ 窗口大小改变时重新初始化
window.addEventListener("resize", () => {
  // 移除所有事件监听器并重新初始化
  location.reload();
});
