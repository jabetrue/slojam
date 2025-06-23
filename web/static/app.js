.nav-btn {
  min-width: 80px;
  padding: 6px 12px;
  font-size: 0.9rem;
  margin-left: 4px;
}


document.addEventListener("DOMContentLoaded", () => {
  const allStudents = [
    { name: "Beesly, Pam" },
    { name: "Bratton, Creed" },
    { name: "Halpert, Jim" },
    { name: "Martin, Angela" },
    { name: "Bernard, Andy" },
    { name: "Howard, Stanley" },
    { name: "Vance, Phyllis" },
  ];

  const sloList = [
    { id: 1, desc: "Analyze art using formal and contextual analysis." },
    { id: 2, desc: "Identify stylistic features in historical artworks." },
  ];

  let currentPage = 1;
  let perPage = 5;

  function renderStudents() {
    const container = document.getElementById("studentsContainer");
    container.innerHTML = "";
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visible = allStudents.slice(start, end);

    visible.forEach(student => {
      const div = document.createElement("div");
      div.className = "student";
      div.innerHTML = `<h2>${student.name}</h2>` + sloList.map(slo => `
        <div class="slo-row">
          <div><strong>SLO ${slo.id}</strong></div>
          <div>${slo.desc}</div>
          <div>
            <button class="score-btn" data-score="4">Exceeded (4)</button>
            <button class="score-btn" data-score="3">Met (3)</button>
            <button class="score-btn" data-score="2">Partially Met (2)</button>
            <button class="score-btn" data-score="1">Not Met (1)</button>
          </div>
        </div>`).join("");
      container.appendChild(div);
    });

    document.getElementById("pageNum").textContent = currentPage;
    document.getElementById("pageNumTop").textContent = currentPage;

    document.querySelectorAll(".score-btn").forEach(btn => {
      btn.classList.remove("active");
      btn.addEventListener("click", () => {
        const group = btn.closest(".slo-row");
        group.querySelectorAll(".score-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  function updatePerPage() {
    const select = document.getElementById("perPageSelect").value;
    const custom = parseInt(document.getElementById("customPerPage").value, 10);
    perPage = select === "all" ? allStudents.length : (isNaN(custom) ? parseInt(select) : custom);
    currentPage = 1;
    renderStudents();
  }

  document.getElementById("perPageSelect").addEventListener("change", updatePerPage);
  document.getElementById("customPerPage").addEventListener("input", updatePerPage);

  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderStudents();
    }
  });
  document.getElementById("nextBtn").addEventListener("click", () => {
    if ((currentPage * perPage) < allStudents.length) {
      currentPage++;
      renderStudents();
    }
  });
  document.getElementById("prevBtnTop").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderStudents();
    }
  });
  document.getElementById("nextBtnTop").addEventListener("click", () => {
    if ((currentPage * perPage) < allStudents.length) {
      currentPage++;
      renderStudents();
    }
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

  renderStudents();
});
