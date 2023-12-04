document.querySelectorAll(".dropdown-item").forEach(item =>
    item.addEventListener("click", () => {
        resetActive();
        item.classList.add("active");
        const activeCategoryNode = item.parentElement.parentElement.parentElement;
        const activeCategoryNodeLink = activeCategoryNode.querySelector(".nav-link:first-child");
        const activeCategory = activeCategoryNodeLink.textContent.trim();
        const body = document.querySelector("body");
        activeCategoryNode.parentElement.querySelectorAll(".nav-link").forEach((link) => link.parentElement.classList.remove("active"));
        activeCategoryNode.classList.add("active");
        body.classList.add(activeCategory == "Zorgverlener" ? "Zorgverlener" : "Patient");
        body.classList.remove(activeCategory == "Zorgverlener" ? "Patient" : "Zorgverlener");

    })
);

function resetActive() {
    document.querySelectorAll(".dropdown-item").forEach(item => item.classList.remove("active"));
}