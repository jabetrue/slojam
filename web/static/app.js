
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".score-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".slo-row");
      group.querySelectorAll(".score-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const toggleBtn = document.getElementById("toggleTips");
  const tipsPanel = document.getElementById("tipsPanel");
  if (toggleBtn && tipsPanel) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = tipsPanel.style.display === "none";
      tipsPanel.style.display = isHidden ? "block" : "none";
      toggleBtn.innerHTML = isHidden ? "👁️ Hide Tips and Options" : "👁 Show Tips and Options";
    });
  }
});
