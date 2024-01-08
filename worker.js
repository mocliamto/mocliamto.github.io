/**
* Just a stub worker file, to make this project installable as PWA.
*/
const cacheName = 'chartlibraries';
const precachedResources = [
    './',
    'src/types/',
    'src/apex/',
    'src/chartjs/',
    'src/d3/',
    'src/assets/css/@fortawesome/fontawesome-free/css/all.min.css',
    'src/assets/css/bootstrap/dist/css/bootstrap.min.css',
    'src/assets/css/prismjs/plugins/line-numbers/prism-line-numbers.min.css',
    'src/assets/css/prismjs/plugins/match-braces/prism-match-braces.min.css',
    'src/assets/css/styles.css',
    'src/assets/js/@popperjs/core/dist/umd/popper.min.js',
    'src/assets/js/bootstrap/dist/js/bootstrap.min.js',
    'src/assets/js/prismjs/components/prism-core.min.js',
    'src/assets/js/prismjs/components/prism-clike.min.js',
    'src/assets/js/prismjs/components/prism-javascript.min.js',
    'src/assets/js/prismjs/plugins/file-highlight/prism-file-highlight.min.js',
    'src/assets/js/prismjs/plugins/line-numbers/prism-line-numbers.min.js',
    'src/assets/js/prismjs/plugins/match-braces/prism-match-braces.min.js',
    'src/assets/js/marked/lib/marked.umd.js',
    'src/assets/js/index.js',
    'src/assets/js/apexcharts/dist/apexcharts.min.js',
    'src/assets/js/chart.js/dist/chart.umd.js',
    'src/assets/js/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js',
    'src/assets/js/chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js',
    'src/assets/js/d3/dist/d3.min.js',
    'src/apex/labResults.js',
    'src/chartjs/labResults.js',
    'src/d3/labResults.js',
    'src/apex/grow.js',
    'src/chartjs/grow.js',
    'src/d3/grow.js',
    'src/apex/epilepsy.js',
    'src/chartjs/epilepsy.js',
    'src/d3/epilepsy.js',
    'README.md',
    'src/assets/file/rapportGebruikerservaring.pdf',
    'src/assets/file/grafiekLibraries.xlsx'

];

self.addEventListener('install', function (event) {
    event.waitUntil(precache());
});

self.addEventListener('activate', function (_event) {
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    try {
        let url = new URL(event.request.url);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
            event.respondWith(cacheFirst(url.pathname));
        }
    }
    catch (error) {

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