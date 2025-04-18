    const CACHE_FILE = 'cities_cache.json';


    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    function getFromCache() {
        try {
            const cacheData = localStorage.getItem(CACHE_FILE);
            if (!cacheData) return null;

            const { data, timestamp } = JSON.parse(cacheData);
            const cacheDate = new Date(timestamp);

            if (isToday(cacheDate)) {
                return data;
            }
            return null;
        } catch (e) {
            console.error('Ошибка чтения кэша:', e);
            return null;
        }
    }

    function saveToCache(data) {
        try {
            const cacheData = {
                data: data,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(CACHE_FILE, JSON.stringify(cacheData));
        } catch (e) {
            console.error('Ошибка сохранения кэша:', e);
        }
    }

    async function getCitiesfromMaximaster() {
        const cachedCities = getFromCache();
        if (cachedCities) {
            console.log('Используем данные из кэша');
            populateCitySelect(cachedCities);
            return;
        }

        try {
            const response = await fetch('getcities.php', { method: 'GET' });

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const cities = await response.json();
            console.log('Получены данные с сервера:', cities);
            saveToCache(cities);
            populateCitySelect(cities);

        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            document.getElementById('result').innerHTML = `<p class="error">Ошибка: ${error.message}</p>`;
        }
    }


    function populateCitySelect(cities) {
        const select = document.getElementById('city');
        select.innerHTML = '';

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.text = city;
            select.appendChild(option);

            if (city === 'Москва') {
                option.selected = true;
            }
        });
    }

    async function calculatedelievering() {
        const city = document.getElementById('city').value;
        let weight = document.querySelector('input[name="weight"]').value.trim(); 

        if (weight.startsWith("+")) {
            weight = weight.substring(1);
        }

        if (!city || !weight) {
            document.getElementById('result').innerHTML = '<p class="error">Пожалуйста, выберите город из списка и введите вес.</p>';
            return;
        }

        const weightNumber = parseFloat(weight);
        if (isNaN(weightNumber) || weightNumber <= 0) {
            document.getElementById('result').innerHTML = '<p class="error">Пожалуйста, введите корректное и положительное число (вес).</p>';
            return;
        }

        const apiUrl = `process.php?city=${encodeURIComponent(city)}&weight=${encodeURIComponent(weightNumber)}`;
        let attempts = 0; 
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;
            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === "error" && result.price === 0) {
                    if (attempts < maxAttempts) {
                        console.log(`Попытка ${attempts} не удалась: ${result.message}. Повторяем запрос...`);
                        continue; 
                    } else {
                        document.getElementById('result').innerHTML = `<p class="error">Ошибка: ${result.message}. Превышено количество попыток.</p>`;
                        return;
                    }
                }

                document.getElementById('result').innerHTML = `<p>Стоимость доставки в город ${city} груза весом ${weightNumber} кг равна ${result.price} руб.</p>`;
                return; 

            } catch (error) {
                console.error('Ошибка при отправке данных:', error);
                document.getElementById('result').innerHTML = `<p class="error">Ошибка: ${error.message}</p>`;
                return; 
            }
        }
    }
    document.getElementById('calculateButton').onclick = calculatedelievering;
    window.onload = getCitiesfromMaximaster;