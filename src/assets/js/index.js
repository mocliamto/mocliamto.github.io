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

document.querySelectorAll(".code").forEach((btn) => {
    btn.addEventListener("click", () => {
        let modalElement = window.parent.document.querySelector("#code-modal");
        let codeElement = modalElement.querySelector("pre");
        let titleElement = modalElement.querySelector("h5");
        titleElement.textContent = btn.parentElement.parentElement.querySelector("span").textContent;

        codeElement.dataset.src = btn.dataset.src;
        const modal = new window.parent.bootstrap.Modal("#code-modal");
        Prism.highlightElement(codeElement);
        modal.show();
    });
})
