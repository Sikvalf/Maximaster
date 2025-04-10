let cpuData = []; 
let Numberofwrongzaprosov = 0;
let Numberofzaprosov = 0;
let Percentageofwrongzaprosov = 0;
let LastNotNullValue = 0;
const username = 'cli';
const password = '12344321';
const encodedCredentials = btoa(`${username}:${password}`);
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'http://exercise.develop.maximaster.ru/service/cpu';
const totalRequestsElement = document.getElementById("total-requests");
const errorRequestsElement = document.getElementById ("error-requests");
const errorPercentageElement = document.getElementById ("error-percentage");
const ctx = document.getElementById('myChart').getContext('2d');
const MAX_DATA_POINTS = 20;

let myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Загруженность процессора в (%)',
            data: cpuData,
            borderColor: 'rgb(138, 43, 226)',
            tension: 0.1,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

function updateChart() {
    const labels = cpuData.map((_, i) => `${i * 5}s`);
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = cpuData;
    myChart.update();
}

async function fetchCpuLoadProc() {
    try {
        const response = await fetch(proxyUrl + apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`
            }
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        const cpuLoad = Number(data);

        if (cpuLoad === 0 ){
        Numberofwrongzaprosov +=1;
        cpuLoad = LastNotNullValue;
        } else {
            LastNotNullValue = cpuLoad;
        }

        cpuData.push(cpuLoad);
        Numberofzaprosov += 1;
        totalRequestsElement.textContent = Numberofzaprosov;
        errorRequestsElement.textContent = Numberofwrongzaprosov;
        Percentageofwrongzaprosov = (Numberofwrongzaprosov *100)/Numberofzaprosov;
        errorPercentageElement.textContent = Percentageofwrongzaprosov;
        
        if (cpuData.length > MAX_DATA_POINTS) {
            cpuData.shift();
            console.warn("Была получена ошибка(0),используем предыдущее значение:", LastNotNullValue);
        }
        console.log("Массив данных:", cpuData);
        updateChart();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCpuLoadProc();
    setInterval(fetchCpuLoadProc, 5000);
});