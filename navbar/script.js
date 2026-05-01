fetch("/navbar/navbar.json")
  .then(res => res.json())
  .then(renderNavbar);

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
  let el;

  // ✅ 有 link 且无 children → a 标签
  if (item.link && !item.children) {
    el = document.createElement("a");
    el.href = item.link;
    el.className = "menu-item";
    el.textContent = item.label;
    return el;
  }

  // ✅ 有 children → div
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

function initBehavior() {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menu.classList.toggle("open");
  });

  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", function (e) {
      if (window.innerWidth > 768) return;
      if (this.tagName === "A") return;

      e.stopPropagation();

      const dropdown = this.querySelector(":scope > .dropdown");
      if (!dropdown) return;

      Array.from(this.parentElement.children).forEach(sib => {
        if (sib !== this) {
          sib.classList.remove("active");
          sib.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
        }
      });

      this.classList.toggle("active");
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });
  });

  document.addEventListener("click", e => {
    if (!menu.contains(e.target)) {
      menu.classList.remove("open");
      document.querySelectorAll(".menu-item").forEach(i => {
        i.classList.remove("active");
        i.querySelectorAll(".dropdown").forEach(d => d.style.display = "none");
      });
    }
  });
}
