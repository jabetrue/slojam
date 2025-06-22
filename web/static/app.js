document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".score-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const score = btn.dataset.score;
      const sloEl = btn.closest(".slo");
      const studentEl = btn.closest(".student");

      sloEl.querySelectorAll(".score-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const payload = {
        student_id: studentEl.dataset.studentId,
        slo_id: sloEl.dataset.sloId,
        score: parseInt(score)
      };

      fetch("/submit_score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => console.log("Saved!", data))
      .catch(err => console.error("Error saving score", err));
    });
  });
});
