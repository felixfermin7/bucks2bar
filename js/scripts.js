const getMonthlyData = () => {
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    return months.map(month => {
        const income = parseFloat(document.getElementById(`${month}-income`)?.value) || 0;
        const expenses = parseFloat(document.getElementById(`${month}-expenses`)?.value) || 0;

        return { month, income, expenses };
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    usernameInput?.addEventListener('input', ({ target }) => {
        const username = target.value;
        console.log(`Username changed to: ${username}`);
        const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        target.style.border = usernameRegex.test(username) ? '2px solid green' : '2px solid red';
    });

    const downloadButton = document.getElementById('download-btn');
    const canvas = document.getElementById('barChart');

    downloadButton?.addEventListener('click', () => {
        const image = canvas?.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'chart.png';
        link.click();
    });


    const emailButton = document.getElementById('send-email');

    emailButton?.addEventListener('click', async () => {
        const image = canvas?.toDataURL('image/png');
        const email = document.getElementById('email')?.value;

        if (email && image) {
            try {
                const response = await fetch('http://localhost:3000/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, image })
                });

                if (response.ok) {
                    alert('Email sent successfully!');
                } else {
                    alert('Failed to send email. Please try again.');
                }
            } catch (error) {
                console.error('Error sending email:', error);
                alert('An error occurred. Please try again.');
            }
        } else {
            alert('Email address or chart image is missing.');
        }
    });

    let barChartInstance = null;

    const chartTab = document.getElementById('chart-tab');
    chartTab?.addEventListener('click', () => {
        const ctx = document.getElementById('barChart')?.getContext('2d');
        const monthlyData = getMonthlyData();

        const incomeData = monthlyData.map(({ income }) => income);
        const expensesData = monthlyData.map(({ expenses }) => expenses);
        const labels = monthlyData.map(({ month }) => month.charAt(0).toUpperCase() + month.slice(1));

        if (barChartInstance) {
            barChartInstance.destroy();
        }

        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expensesData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
});
