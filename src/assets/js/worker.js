/**
* Just a stub worker file, to make this project installable as PWA.
*/
const cacheName = "chartlibraries";
const precachedResources = [
    "../css/@fortawesome/fontawesome-free/css/all.min.css",
    "../css/bootstrap/dist/css/bootstrap.min.css",
    "../css/prismjs/plugins/line-numbers/prism-line-numbers.min.css",
    "../css/prismjs/plugins/match-braces/prism-match-braces.min.css",
    "../css/styles.css",
    "@popperjs/core/dist/umd/popper.min.js",
    "bootstrap/dist/js/bootstrap.min.js",
    "prismjs/components/prism-core.min.js",
    "prismjs/components/prism-clike.min.js",
    "prismjs/components/prism-javascript.min.js",
    "prismjs/plugins/file-highlight/prism-file-highlight.min.js",
    "prismjs/plugins/line-numbers/prism-line-numbers.min.js",
    "prismjs/plugins/match-braces/prism-match-braces.min.js",
    "marked/lib/marked.umd.js",
    "index.js",
    "apexcharts/dist/apexcharts.min.js",
    "chart.js/dist/chart.umd.js",
    "chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js",
    "chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js",
    "../../d3/dist/d3.min.js",
    "../../apex/labResults.js",
    "../../chartjs/labResults.js",
    "../../d3/labResults.js",
    "../../apex/grow.js",
    "../../chartjs/grow.js",
    "../../d3/grow.js",
    "../../apex/epilepsy.js",
    "../../chartjs/epilepsy.js",
    "../../d3/epilepsy.js"
];

self.addEventListener("install", function (_event) {
    event.waitUntil(precache());
});

self.addEventListener("activate", function (_event) {
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (precachedResources.includes(url.pathname)) {
        event.respondWith(cacheFirst(event.request));
    }
});

async function precache() {
    const cache = await caches.open(cacheName);
    return cache.addAll(precachedResources);
}

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return Response.error();
    }
}