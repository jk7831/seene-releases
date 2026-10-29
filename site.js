  (function(){
    var cfg = window.SEENE || {};
    var toast = document.getElementById("toast"), timer;
    function say(msg){
      if (!toast) return;
      toast.textContent = msg; toast.classList.add("show");
      clearTimeout(timer); timer = setTimeout(function(){ toast.classList.remove("show"); }, 5000);
    }
    function each(sel, fn){ Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

    // Version / size text
    each("[data-fill]", function(el){
      var k = el.getAttribute("data-fill");
      if (k === "version" && cfg.VERSION) el.textContent = cfg.VERSION;
      if (k === "mac-size" && cfg.MAC && cfg.MAC.SIZE) el.textContent = cfg.MAC.SIZE;
      if (k === "win-size" && cfg.WIN && cfg.WIN.SIZE) el.textContent = cfg.WIN.SIZE;
    });

    // Checksums: only shown once a real value is configured, so nothing advertises an empty value.
    each("[data-sha]", function(box){
      var os = box.getAttribute("data-sha").toUpperCase(), sha = (cfg[os] || {}).SHA256 || "";
      if (/^[0-9a-f]{64}$/i.test(sha)) {
        box.querySelector("code").textContent = sha.toLowerCase();
        box.hidden = false;
      }
    });

    // Download buttons: data-download="mac" | "win"
    each("[data-download]", function(a){
      a.addEventListener("click", function(e){
        var os = a.getAttribute("data-download").toUpperCase(), url = (cfg[os] || {}).URL;
        if (url) {
          a.setAttribute("href", url);   // let the browser download it
          a.setAttribute("download", "");
          return;
        }
        e.preventDefault();
        say("The download link isn't live yet — check back shortly.");
      });
    });

    // Point visitors at the right download for the computer they are on.
    var ua = (navigator.userAgent || "") + " " + (navigator.platform || "");
    var mine = /Windows/i.test(ua) ? "win" : (/Macintosh|Mac OS X|MacIntel/i.test(ua) && !/iPhone|iPad/i.test(ua) ? "mac" : "");
    if (mine) {
      var card = document.getElementById("dl-" + mine), badge = card && card.querySelector(".rec");
      if (card) { card.classList.add("mine"); }
      if (badge) { badge.hidden = false; }
    }
  })();
