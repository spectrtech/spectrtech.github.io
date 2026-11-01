/* SpectrTech site chrome: header behaviour on every page. Source: src/assets/chrome.js */
(function () {
  "use strict";
  var top = document.querySelector(".st-top");
  if (!top) return;
  var nav = document.getElementById("st-nav");
  var burger = top.querySelector(".st-burger");
  var dds = [].slice.call(top.querySelectorAll(".st-dd-btn"));

  function onScroll() { top.classList.toggle("st-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeDDs(except) {
    dds.forEach(function (b) { if (b !== except) b.setAttribute("aria-expanded", "false"); });
  }
  dds.forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.getAttribute("aria-expanded") === "true";
      closeDDs(b);
      b.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });

  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? burger.getAttribute("data-close") : burger.getAttribute("data-open"));
    nav.classList.toggle("st-open", open);
    if (!open) closeDDs();
  }
  if (burger) burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });

  document.addEventListener("click", function (e) { if (!e.target.closest(".st-dd")) closeDDs(); });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openBtn = dds.filter(function (b) { return b.getAttribute("aria-expanded") === "true"; })[0];
    if (openBtn) { closeDDs(); openBtn.focus(); return; }
    if (nav && nav.classList.contains("st-open")) { setMenu(false); burger.focus(); }
  });

  var mq = window.matchMedia("(min-width: 1000px)");
  var onMq = function () { if (mq.matches) setMenu(false); };
  if (mq.addEventListener) mq.addEventListener("change", onMq); else if (mq.addListener) mq.addListener(onMq);

  /* remember an explicit language choice, so the language suggestion does not come back */
  [].forEach.call(top.querySelectorAll(".st-lang a[hreflang]"), function (a) {
    a.addEventListener("click", function () { try { localStorage.setItem("st-lang", a.getAttribute("hreflang")); } catch (e) {} });
  });
})();
