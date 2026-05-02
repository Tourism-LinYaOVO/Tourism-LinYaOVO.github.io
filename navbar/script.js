fetch("/navbar/navbar.json")
  .then(res => res.json())
  .then(renderNavbar)
  .catch(console.error);

function renderNavbar(data) {
  document.getElementById("logo-img").src = data.logo.src;
  document.getElementById("logo-text").innerText = data.logo.text;

  const menu = document.getElementById("menu");
  data.menu.forEach(item => {
    menu.appendChild(createMenuItem(item));
  });

  initBehavior();
}

function createMenuItem(item) {
  if (item.link && !item.children) {
    const el = document.createElement("a");
    el.className = "menu-item";
    el.href = item.link;
    el.textContent = item.label;
    return el;
  }

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

function initBehavior() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  // ✅ 只处理移动端
  if (window.innerWidth <= 768) {
    setupMobileMenu();
  }

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

function setupMobileMenu() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", handleMobileClick);
  });
}

function handleMobileClick(e) {
  e.stopPropagation();
  const dropdown = this.querySelector(":scope > .dropdown");
  if (!dropdown) return;

  // 关闭同级
  Array.from(this.parentElement.children).forEach(sibling => {
    if (sibling !== this) {
      sibling.classList.remove("active");
      sibling.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
    }
  });

  this.classList.toggle("active");
}

function cleanupMobileMenu() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.removeEventListener("click", handleMobileClick);
  });
  closeAllDropdowns();
  document.getElementById("menu").classList.remove("open");
}

function closeAllDropdowns() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
  });
}
