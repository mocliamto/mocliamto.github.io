let home = document.getElementById('home');
let iframe = window.parent.document.getElementById('content');
let typeSelector = window.parent.document.getElementById('type-selector');
let hash = window.top.location.hash;

if (typeSelector) {
    typeSelector.querySelectorAll('input').forEach((input) => {
        input.addEventListener('click', () => {
            const activeCategory = input.parentElement.querySelector('label').textContent.trim();
            console.log(activeCategory);
            document.body.classList.add(activeCategory === 'Zorgverlener' ? 'Zorgverlener' : 'Patient');
            document.body.classList.remove(activeCategory === 'Zorgverlener' ? 'Patient' : 'Zorgverlener');
            iframe.contentWindow.location.reload();
        });
    });
}

document.querySelectorAll('.code').forEach((btn) => {
    btn.addEventListener('click', () => {
        let modalElement = window.parent.document.querySelector('#code-modal');
        let codeWrapperElement = document.createElement('pre');
        let codeElement = document.createElement('code');
        let titleElement = modalElement.querySelector('h5');
        let modal = new window.parent.bootstrap.Modal('#code-modal');

        modalElement.querySelector('pre')?.remove();
        codeWrapperElement.appendChild(codeElement);
        codeWrapperElement.classList.add('language-javascript');
        codeWrapperElement.dataset.src = btn.dataset.src;
        codeWrapperElement.classList.add('line-numbers');
        codeWrapperElement.classList.add('match-braces');
        codeWrapperElement.dataset.src = btn.dataset.src;
        modalElement.querySelector('.modal-body').appendChild(codeWrapperElement);
        titleElement.textContent = btn.parentElement.parentElement.querySelector('span').textContent;

        window.parent.Prism.highlightElement(codeWrapperElement);
        modal.show();
    });
});

if (hash) {
    let currentSource = new URL(iframe?.contentWindow.location.href)?.pathname;
    let newSource = hash.substring(1);
    if (newSource !== currentSource) {
        iframe.src = newSource;
    }
}

if (home) {
    fetch('../README.md')
        .then(response => response.text())
        .then(data => {
            marked.use({
                gfm: true
            });
            home.innerHTML = marked.parse(data);
        });
} else if (iframe && new URL(iframe.contentWindow.location.href).pathname !== '/src/index.html') {
    typeSelector.classList.remove('d-none');
}

if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("../worker.js").then(function (_registration) {
                // Registration was successful
            }, function (_err) {
                // registration failed :(
            });
        });
}
