const months = Array.from({length: 16}, (_, i) => i); // Leeftijden in maanden (0-15)

fetch('../../assets/grow.json')
    .then(response => response.json())
    .then(data => {
        // Transformeer de opgehaalde data naar een formaat dat geschikt is voor de grafiek
        const userValues = months.map(month => {
            const record = data.find(d => d.LeeftijdInMaanden === month);
            return record ? record.Lengte : null; // Gebruik null voor maanden zonder data
        });

        // Referentiewaarden van TNO
        const tnoValues = [40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92];

        // Configuratie van de grafiek
        const ctx = document.getElementById('growChartJs').getContext('2d');

        const config = {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Referentiewaarden TNO',
                        data: tnoValues,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Gebruikerswaarden',
                        data: userValues, // Gebruik de getransformeerde data
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Groeigrafiek 0-15 maanden',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Leeftijd (maanden)',
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
    })
    .catch(error => console.error('Error loading user values:', error));

