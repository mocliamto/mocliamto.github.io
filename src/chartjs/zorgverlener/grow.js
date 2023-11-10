// Data voor de groeigrafiek
const years = [1, 2, 3, 4]; // Leeftijden in jaren
const tnoValues = [75, 85, 95, 105]; // Referentiewaarden van TNO
const userValues = [80, 90, 92, 100]; // Gebruikerswaarden (kan worden vervangen door echte gegevens)

// Configuratie van de grafiek
const ctx = document.getElementById('growChartJs').getContext('2d');

const config = {
    type: 'line',
    data: {
        labels: years,
        datasets: [
            {
                label: 'Referentiewaarden TNO',
                data: tnoValues,
                borderColor: 'rgba(75, 192, 192, 1)', // Kleur van de lijn
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Kleur van het gebied onder de lijn
                fill: true, // Vul het gebied onder de lijn in
            },
            {
                label: 'Gebruikerswaarden',
                data: userValues,
                borderColor: 'rgba(255, 99, 132, 1)', // Kleur van de lijn
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Kleur van het gebied onder de lijn
                fill: true, // Vul het gebied onder de lijn in
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Groeigrafiek 1-4 jaar',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Leeftijd (jaar)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Lengte (cm)',
                },
            },
        },
    },
};

new Chart(ctx, config);
