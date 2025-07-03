
document.addEventListener("DOMContentLoaded", () => {
  const students = [
    { name: "Pam Beesly" },
    { name: "Jim Halpert" }
  ];

  const sloList = [
    { id: "1", desc: "Analyze art using formal and contextual analysis." },
    { id: "2", desc: "Identify stylistic features in historical artworks." },
    { id: "3", desc: "Evaluate works of art and/or architecture, accounting for both similarities and differences." },
    { id: "4", desc: "Analyze the ways in which art from prehistory through the middle ages has been employed historically to express fundamental human ideals, values, and beliefs." }
  ];

  let showOnlyRequired = false;
  let showDescriptions = true;

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

    students.forEach(student => {
      const div = document.createElement("div");
      div.innerHTML = `<h2>${student.name}</h2>`;

      const visibleSLOs = showOnlyRequired
        ? sloList.filter(s => requiredSLOs.has(Number(s.id)))
        : sloList;

      visibleSLOs.forEach(slo => {
        const isRequired = requiredSLOs.has(Number(slo.id));
        const star = isRequired ? '<span class="star">★</span>' : '';
        const desc = showDescriptions ? slo.desc : truncateText(slo.desc);

        div.innerHTML += `
          <div class="slo-row">
            <div>${star}<strong>SLO ${slo.id}</strong></div>
            <div class="slo-desc">${desc}</div>
          </div>
        `;
      });

      container.appendChild(div);
    });
  }

  const descriptionToggles = document.querySelectorAll(".toggleDescriptions");
  descriptionToggles.forEach(box => {
    box.checked = false;
    box.addEventListener("change", (e) => {
      showDescriptions = !e.target.checked;
      descriptionToggles.forEach(b => b.checked = e.target.checked);
      renderStudents();
    });
  });

  const requiredOnlyToggles = document.querySelectorAll(".toggleRequiredOnly");
  requiredOnlyToggles.forEach(box => {
    box.checked = false;
    box.addEventListener("change", (e) => {
      showOnlyRequired = e.target.checked;
      requiredOnlyToggles.forEach(b => b.checked = showOnlyRequired);
      renderStudents();
    });
  });

  renderStudents();
});
