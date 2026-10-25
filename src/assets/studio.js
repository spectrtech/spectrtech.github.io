/* SpectrTech Studio runtime. Source: src/assets/studio.js */
(function () {
  "use strict";
  var doc = document.documentElement;
  var S = window.ST || {};
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  /* sticky header border */
  var top = document.querySelector(".top");
  if (top) {
    var onScroll = function () { top.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* mobile menu */
  var burger = document.querySelector(".burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    var setMenu = function (open) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? burger.dataset.close : burger.dataset.open);
      nav.classList.toggle("open", open);
    };
    burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); } });
  }

  /* language switcher: remember explicit choice, close on outside click */
  document.querySelectorAll(".lang a[hreflang]").forEach(function (a) {
    a.addEventListener("click", function () { store("st-lang", a.getAttribute("hreflang")); });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll("details.lang[open]").forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute("open"); });
  });

  /* browser language suggestion (never auto-redirects) */
  (function () {
    var bar = document.getElementById("langbar");
    if (!bar || !S.alt || store("st-lang")) return;
    var cur = doc.lang.slice(0, 2);
    var prefs = (navigator.languages || [navigator.language || ""]).map(function (l) { return String(l).slice(0, 2).toLowerCase(); });
    var pick = null;
    for (var i = 0; i < prefs.length; i++) {
      if (prefs[i] === cur) return;
      if (S.alt[prefs[i]]) { pick = prefs[i]; break; }
    }
    if (!pick) return;
    var info = S.alt[pick];
    bar.querySelector("[data-t]").textContent = info.text;
    var link = bar.querySelector("a");
    link.textContent = info.cta; link.href = info.url; link.setAttribute("hreflang", pick); link.setAttribute("lang", pick);
    var btn = bar.querySelector("button");
    btn.textContent = info.stay;
    bar.setAttribute("dir", info.dir); bar.setAttribute("lang", pick);
    link.addEventListener("click", function () { store("st-lang", pick); });
    btn.addEventListener("click", function () { store("st-lang", cur); bar.hidden = true; });
    bar.hidden = false;
  })();

  /* reveal on scroll */
  var rv = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add("in"); });

  /* compare toggle (mobile) */
  document.querySelectorAll(".cmp").forEach(function (c) {
    var btns = c.querySelectorAll(".seg button");
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        c.dataset.show = b.dataset.show;
        btns.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      });
    });
  });

  /* project galleries */
  document.querySelectorAll(".gal").forEach(function (g) {
    var main = g.querySelector(".main img");
    var tb = g.querySelectorAll(".thumbs button");
    tb.forEach(function (b) {
      b.addEventListener("click", function () {
        main.src = b.dataset.src; main.alt = b.dataset.alt;
        tb.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      });
    });
  });

  /* lead form */
  var form = document.getElementById("lead");
  if (form) {
    var M = JSON.parse(form.dataset.msg);
    var stat = form.querySelector(".fstat");
    var fieldErr = function (el, msg) {
      var e = document.getElementById(el.id + "-err");
      el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (e) e.textContent = msg || "";
    };
    var validate = function () {
      var first = null;
      form.querySelectorAll("[required]").forEach(function (el) {
        var msg = "";
        if (el.type === "checkbox") { if (!el.checked) msg = M.consentRequired; }
        else if (!el.value.trim()) msg = M.required;
        else if (el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) msg = M.invalidEmail;
        fieldErr(el, msg);
        if (msg && !first) first = el;
      });
      return first;
    };
    form.querySelectorAll("input,select,textarea").forEach(function (el) {
      el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") validate(); });
    });
    var data = function () {
      var o = {};
      new FormData(form).forEach(function (v, k) { o[k] = String(v).trim(); });
      o.page = location.href; o.lang = doc.lang;
      return o;
    };
    var mailto = function (o) {
      var lines = [
        M.l.name + ": " + o.name,
        M.l.email + ": " + o.email,
        M.l.company + ": " + (o.company || "-"),
        M.l.country + ": " + (o.country || "-"),
        M.l.link + ": " + (o.link || "-"),
        M.l.interest + ": " + (o.interest || "-"),
        "",
        o.message,
        "",
        "— " + o.page
      ];
      return "mailto:" + M.to + "?subject=" + encodeURIComponent("SpectrTech — " + (o.interest || "Request") + " — " + (o.company || o.name)) + "&body=" + encodeURIComponent(lines.join("\n"));
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      stat.className = "fstat"; stat.textContent = "";
      var bad = validate();
      if (bad) { bad.focus(); return; }
      var o = data();
      if (o.website) return; /* honeypot */
      delete o.website;
      var btn = form.querySelector("[type=submit]");
      var label = btn.textContent;
      var showMail = function () {
        var go = (window.ST && window.ST.go) || function (u) { window.location.href = u; };
        go(mailto(o));
        stat.className = "fstat ok";
        stat.innerHTML = "";
        stat.append(M.mailtoReady + " " + M.mailtoFallback + " ");
        var a = document.createElement("a"); a.href = "mailto:" + M.to; a.textContent = M.to; stat.append(a, ".");
        if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "lead-mailto", event: true });
      };
      if (!M.endpoint) { showMail(); return; }
      btn.disabled = true; btn.textContent = M.sending;
      fetch(M.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(o) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () {
          form.reset(); stat.className = "fstat ok"; stat.textContent = M.success;
          if (window.goatcounter && goatcounter.count) goatcounter.count({ path: "lead-sent", event: true });
        })
        .catch(function () { showMail(); stat.className = "fstat bad"; stat.prepend(M.error + " "); })
        .finally(function () { btn.disabled = false; btn.textContent = label; stat.focus(); });
    });
  }
})();
