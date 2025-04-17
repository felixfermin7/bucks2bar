function getMonthlyData() {
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    const monthlyData = months.map(month => {
        const incomeInput = document.getElementById(`${month}-income`);
        const expensesInput = document.getElementById(`${month}-expenses`);

        const income = incomeInput ? parseFloat(incomeInput.value) || 0 : 0;
        const expenses = expensesInput ? parseFloat(expensesInput.value) || 0 : 0;

        return { month, income, expenses };
    });

    return monthlyData;
}
document.addEventListener('DOMContentLoaded', () => {
const usernameInput = document.getElementById('username');
    usernameInput.addEventListener('input', (event) => {
        const username = event.target.value;
        console.log(`Username changed to: ${username}`);
        const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        if (usernameRegex.test(username)) {
            usernameInput.style.border = '2px solid green';
        } else {
            usernameInput.style.border = '2px solid red';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-btn');
    const canvas = document.getElementById('barChart');

    downloadButton.addEventListener('click', () => {
        // Convert the canvas to a data URL
        const image = canvas.toDataURL('image/png');

        // Create a temporary <a> element
        const link = document.createElement('a');
        link.href = image;
        link.download = 'chart.png'; // Set the default file name

        // Trigger the download
        link.click();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let barChartInstance = null; // Store the chart instance

    const chartTab = document.getElementById('chart-tab');
    chartTab.addEventListener('click', () => {
        const ctx = document.getElementById('barChart').getContext('2d');
        const monthlyData = getMonthlyData();

        // Extract income and expenses data from monthlyData
        const incomeData = monthlyData.map(data => data.income);
        const expensesData = monthlyData.map(data => data.expenses);
        const labels = monthlyData.map(data => data.month.charAt(0).toUpperCase() + data.month.slice(1));

        // Destroy the existing chart instance if it exists
        if (barChartInstance) {
            barChartInstance.destroy();
        }

        // Create a new chart instance
        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels, // Use month names as labels
                datasets: [{
                    label: 'Income',
                    data: incomeData, // Set income data
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }, {
                    label: 'Expenses',
                    data: expensesData, // Set expenses data
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
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