const API_URL = "http://exercise.develop.maximaster.ru/service/products"; 
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; 
let table = document.getElementById("product-table");
let tbody = table.querySelector("tbody");
let priceFromInput = document.getElementById("price-from");
let priceToInput = document.getElementById("price-to");
let applyFilterButton = document.getElementById("apply-filter");
let messageDiv = document.getElementById("message");
let loaderDiv = document.getElementById("loader");
const username = 'cli';
const password = '12344321';

let productsData = []; 

function toggleLoader(show) {
    loaderDiv.style.display = show ? "block" : "none";
}

function showMessage(text) {
    messageDiv.textContent = text;
    messageDiv.style.display = "block";
    table.style.display = "none"; 
}

function clearMessage() {
    messageDiv.textContent = "";
    messageDiv.style.display = "none";
    table.style.display = "table"; 
}

function applyFilter() {
clearMessage();
const priceFromValue = priceFromInput.value;
const priceToValue = priceToInput.value;
if (isNaN(priceFromValue) || isNaN(priceToValue)) {
    showMessage("Ошибка: Введите корректные числовые значения.");
    return;
}

const priceFrom = parseFloat(priceFromValue);
const priceTo = parseFloat(priceToValue);
if (priceFrom === 0 && priceTo === 0) {
    displayProducts(productsData);
    return;
}

if (!isNaN(priceFrom) && !isNaN(priceTo) && priceFrom > priceTo) {
    showMessage("Ошибка: Цена 'от' не может быть больше цены 'до'.");
    return;
}

const filteredProducts = productsData.filter(product => {
    const price = product.price;
    return price >= priceFrom && price <= priceTo;
});

displayProducts(filteredProducts);
}
function displayProducts(products) {
    tbody.innerHTML = ""; 

    if (products.length === 0) {
        showMessage("Нет данных, попадающих под условие фильтра");
        return; 
    }

    products.forEach((product, index) => { 
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = index + 1; 
        const nameCell = document.createElement("td");
        nameCell.textContent = product.name; 
        const quantityCell = document.createElement("td");
        quantityCell.textContent = product.quantity;
        const priceCell = document.createElement("td");
        priceCell.textContent = product.price; 
        const sumCell = document.createElement("td");
        const sum = product.quantity * product.price; 
        sumCell.textContent = sum.toFixed(2); 
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(sumCell);
        tbody.appendChild(row);
    });
    table.style.display = "table";
}

async function fetchproducts() {
    toggleLoader(true);
    try {
        const encodedCredentials = btoa(`${username}:${password}`);
        const response = await fetch(proxyUrl + API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${encodedCredentials}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        productsData = await response.json(); 
        applyFilter(); 

    } catch (error) {
        console.error("Ошибка при получении данных:", error);
        showMessage(`Ошибка при получении данных: ${error.message}`);

    } finally {
        toggleLoader(false); 
    }
}
applyFilterButton.addEventListener("click", applyFilter);
fetchproducts();