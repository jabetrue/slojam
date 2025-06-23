
document.addEventListener("DOMContentLoaded", function () {
    const perPageSelect = document.getElementById("students-per-page");
    const customInput = document.getElementById("custom-students-per-page");

    function updateStudentsPerPage(value) {
        const url = new URL(window.location);
        url.searchParams.set("per_page", value);
        url.searchParams.set("page", 1); // reset to first page
        window.location = url.toString();
    }

    if (perPageSelect) {
        perPageSelect.addEventListener("change", function () {
            updateStudentsPerPage(this.value);
        });
    }

    if (customInput) {
        customInput.addEventListener("change", function () {
            const value = this.value;
            if (value && !isNaN(value) && value > 0) {
                updateStudentsPerPage(value);
            }
        });
    }
});
