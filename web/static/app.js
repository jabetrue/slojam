document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".score-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".slo-row");
      group.querySelectorAll(".score-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  const toggleBtn = document.getElementById("toggleTips");
  const tips = document.getElementById("tips");
  if (toggleBtn && tips) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = tips.style.display === "none";
      tips.style.display = isHidden ? "block" : "none";
      toggleBtn.innerHTML = isHidden ? "👁️ Hide Tips and Options" : "👁 Show Tips and Options";
    });
  }
});
