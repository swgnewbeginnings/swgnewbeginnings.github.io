
(function(){
  // --- Config ---
  const cfgUrl = "assets/config.json";

  // --- Wire links & load patch notes ---
  fetch(cfgUrl).then(r=>r.json()).then(cfg => {
    const { launcherDownloadUrl, launcherPublicViewUrl, discordUrl, donateUrl, patchNotesPreCU } = cfg;

    // Wire nav + hero buttons
    for (const id of ["nav-download","cta-download"]) {
      const a = document.getElementById(id);
      if (!a) continue;
      a.href = launcherDownloadUrl || launcherPublicViewUrl || "#";
      a.rel = "noopener"; a.target = "_blank";
    }
    for (const id of ["nav-discord","cta-discord"]) {
      const a = document.getElementById(id);
      if (!a) continue;
      a.href = discordUrl || "#";
      a.rel = "noopener"; a.target = "_blank";
    }
    for (const id of ["nav-donate","cta-donate"]) {
      const a = document.getElementById(id);
      if (!a) continue;
      a.href = donateUrl || "#";
      a.rel = "noopener"; a.target = "_blank";
    }

    // Load Pre-CU patch notes (local file avoids mixed-content blocking)
    const pre = document.getElementById("patchnotes");
    if (pre && patchNotesPreCU) {
      fetch(patchNotesPreCU, {cache:"no-store"})
        .then(r => r.text())
        .then(t => pre.textContent = t.trim() || "No notes yet.")
        .catch(()=> pre.textContent = "Patch notes unavailable.");
    }
  }).catch(()=>{});

  // --- Animated starfield ---
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio||1));
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  ctx.scale(DPR,DPR);

  let stars = [];
  const COUNT = Math.min(450, Math.floor(W*H/4000));
  for (let i=0;i<COUNT;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      z: Math.random()*1 + 0.2,
      s: Math.random()*1.4 + 0.2,
      tw: Math.random()*6.28
    });
  }

  function frame(t){
    ctx.clearRect(0,0,W,H);
    // faint nebula
    const g = ctx.createRadialGradient(W*0.7, H*0.1, 0, W*0.7, H*0.1, Math.max(W,H)*0.8);
    g.addColorStop(0, "rgba(24,48,74,0.25)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    for (const st of stars){
      st.tw += 0.02;
      const a = 0.4 + Math.sin(st.tw)*0.35;
      ctx.globalAlpha = a;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(st.x, st.y, st.s, st.s);
      // subtle parallax drift
      st.x += st.z * 0.06; st.y += st.z * 0.02;
      if (st.x > W) st.x = 0;
      if (st.y > H) st.y = 0;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  window.addEventListener("resize",()=>{
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; ctx.scale(DPR,DPR);
  });
})();
