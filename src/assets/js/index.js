document.querySelectorAll(".dropdown-item").forEach(item =>
    item.addEventListener("click", () => {
        resetActive();
        item.classList.add("active");
        const categoryNode = item.parentElement.parentElement.parentElement;
        const category = categoryNode.querySelector(".nav-link:first-child").textContent.trim()
        const body = document.querySelector("body");
        body.classList.add(category == "Zorgverlener" ? "Zorgverlener" : "Patient");
        body.classList.remove(category == "Zorgverlener" ? "Patient" : "Zorgverlener");
    })
);

function resetActive() {
    document.querySelectorAll(".dropdown-item").forEach(item => item.classList.remove("active"));
}