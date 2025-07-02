
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
    { id: 1, desc: "Analyze art using formal and contextual analysis.", required: true },
    { id: 2, desc: "Identify stylistic features in historical artworks.", required: false },
    { id: 3, desc: "Evaluate works of art and/or architecture, accounting for both similarities and differences.", required: true },
    { id: 4, desc: "Analyze the ways in which art from prehistory through the middle ages has been employed historically to express fundamental human ideals, values, and beliefs.", required: false }
  ];

  let currentPage = 1;
  let perPage = 5;
  let scoreData = {}; // key: "studentName-sloId", value: score
  let showOnlyRequired = false;
  let showDescriptions = true;
  const descriptionCheckboxes = document.querySelectorAll("#toggleDescriptions");

  function truncateText(text) {
    const firstPeriod = text.indexOf(".");
    if (firstPeriod > 0 && firstPeriod < 120) {
      return text.slice(0, firstPeriod + 1);
    }
    const words = text.split(" ").slice(0, 15).join(" ");
    return words + "...";
  }

  function renderStudents() {
    const container = document.getElementById("studentsContainer");
    container.innerHTML = "";
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const visible = allStudents.slice(start, end);

    const bottomPagination = document.getElementById("bottomPaginationWrapper");
    if (bottomPagination) {
      bottomPagination.style.display = visible.length <= 1 ? "none" : "flex";
    }

    visible.forEach(student => {
      const div = document.createElement("div");
      div.className = "student";

      const visibleSLOs = showOnlyRequired
	    ? sloList.filter(s => requiredSLOs.has(Number(s.id)))
	    : sloList;


      div.innerHTML = `<h2>${student.name}</h2>` + visibleSLOs.map(slo => {
        const key = `${student.name}-${slo.id}`;
        const selectedScore = scoreData[key];

        const labels = {
          4: 'Exceeded (4)',
          3: 'Met (3)',
          2: 'Partially Met (2)',
          1: 'Not Met (1)'
        };

        const buttons = [4, 3, 2, 1].map(score => {
          const isActive = selectedScore == score ? 'active' : '';
          return `<button class="score-btn ${isActive}" data-score="${score}" data-student="${student.name}" data-slo="${slo.id}">${labels[score]}</button>`;
        }).join("");

        const isRequired = requiredSLOs.has(Number(slo.id));
        const star = `<span class="star ${isRequired ? "" : "ghost-star"}">★</span>`;

        return `
          <div class="slo-row">
            <div>${star}<strong>SLO ${slo.id}</strong></div>
			<div class="slo-desc">
			  ${showDescriptions ? slo.desc : truncateText(slo.desc)}
			</div>
            <div>${buttons}</div>
          </div>`;
      }).join("");

      container.appendChild(div);
    });

    document.getElementById("pageNum").textContent = currentPage;
    document.getElementById("pageNumTop").textContent = currentPage;

    document.querySelectorAll(".score-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const student = btn.getAttribute("data-student");
        const slo = btn.getAttribute("data-slo");
        const score = btn.getAttribute("data-score");
        const key = `${student}-${slo}`;
        const group = btn.closest(".slo-row");
        const alreadyActive = btn.classList.contains("active");

        group.querySelectorAll(".score-btn").forEach(b => b.classList.remove("active"));

        if (alreadyActive) {
          delete scoreData[key];
        } else {
          scoreData[key] = score;
          btn.classList.add("active");
        }
      });
    });
  }

  function updatePerPage() {
    const selectedValue = document.getElementById("perPageSelect").value;
    perPage = selectedValue === "all" ? allStudents.length : parseInt(selectedValue);
    currentPage = 1;
    document.getElementById("perPageSelectBottom").value = selectedValue;
    renderStudents();
  }

  const perPageSelect = document.getElementById("perPageSelect");
  if (perPageSelect) {
    perPageSelect.addEventListener("change", updatePerPage);
  }

  const perPageSelectBottom = document.getElementById("perPageSelectBottom");
  if (perPageSelectBottom) {
    perPageSelectBottom.addEventListener("change", () => {
      perPageSelect.value = perPageSelectBottom.value;
      updatePerPage();
    });
  }

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

  const descriptionToggles = document.querySelectorAll("#toggleDescriptions");

  descriptionCheckboxes.forEach(box => {
    box.addEventListener("change", (e) => {
      showDescriptions = !e.target.checked; // ✅ Flip logic: checked means collapse
      descriptionCheckboxes.forEach(b => b.checked = !showDescriptions); // sync checkboxes
      renderStudents();
    });
  });

  requiredOnlyCheckboxes.forEach(box => {
    box.addEventListener("change", (e) => {
      showOnlyRequired = e.target.checked;
    
      // Sync both checkboxes
      requiredOnlyCheckboxes.forEach(b => b.checked = showOnlyRequired);

      renderStudents();
    });
  });

  renderStudents();
});
