const list = document.querySelector(".countries");
const form = document.querySelector("form");
const title = document.querySelector('.place');

const capital = document.getElementById('capital');
const currency = document.getElementById('currency');
const languages = document.getElementById('languages');
const map = document.getElementById('map');
const population = document.getElementById('population');
const flag = document.getElementById('flag');

const endpoint = "https://restcountries.com/v3.1/all";
const countries = [];

const joinAnd = (arr) => {
    if(arr.length > 1) {
        let last = arr.pop();
        let finalArr = `${arr.join(', ')} and ${last}`;
        return finalArr;
    } else {
        return arr[0];
    }
} 

const handleCapital = (countryName) => {
    if (countryName.capital) {
        let capitals = countryName.capital;
        let allCap = [];

        for (const capital in capitals) {
            let nameCap = capitals[capital];
            allCap.push(nameCap);
        }

        return joinAnd(allCap);
    } else {
        return `has no official capital`;
    }
}

const handleCurrency = (countryName) => {
    if (countryName.currencies) {

        let objCurrencies = countryName.currencies;
        let allCurr = [];

        for (const currency in objCurrencies) {
            let name = countryName.currencies[currency].name;
            let symbol = countryName.currencies[currency].symbol;
            let curr = `${name} - ${currency} (${symbol || ""})`;
            allCurr.push(curr);
        }
        return joinAnd(allCurr);
    } 
    
    if (countryName.name.common === "Antarctica") {
        return `Antarctic dollar`;
    } if (countryName.name.common === "Heard Island and McDonald Islands") {
        return `Australian dollar`;
    } else {
        return `has no official currency`;
    }
}

const handlePopulation = (countryName) => {
    if (countryName.population) {
        let population = countryName.population
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return population;
    } else {
        return `has no official data`;
    }
}

const handleLanguages = (countryName) => {
    if (countryName.languages) {
        let allLangs = [];
        let objLanguages = Object.values(countryName.languages);

        for (const lang of objLanguages) {
            allLangs.push(lang);
        }

        return joinAnd(allLangs);
    } else {
        return `has no official language`;
    }
}

const handleMap = (countryName) => {
    let srcMap = countryName.maps.googleMaps;
    let html = `<a href="${srcMap}" target="_blank"> <img src="../img/icon.png"></a>`;

    return map.innerHTML = html;
}

const getData = (selected) => {
    let countryName = countries.find(country => country.name.common === selected);

    capital.innerHTML = handleCapital(countryName);
    currency.innerHTML = handleCurrency(countryName);
    languages.innerHTML = handleLanguages(countryName);
    population.innerHTML = handlePopulation(countryName);
    map.innerHTML = handleMap(countryName)
    flag.innerHTML = `<img src="${countryName.flags.svg}">`;
}

const getCountry = (e) => {
    e.preventDefault();
    let countrySelected = `${list.value}`;
    title.textContent = `${countrySelected}!`;
    getData(countrySelected);
}

const populateList = (countries) => {
    let option = "";
    let arrCountries = [];

    countries
        .forEach(country => {
            let countryName = `${country.name.common}`;
            arrCountries.push(countryName);
        });

    arrCountries
        .sort()
        .forEach(country => option += `<option value="${country}"> ${country} </option>`);

    list.innerHTML = option;
}

const fetchData = async() => {
    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        countries.push(...data);
        populateList(countries);
    } catch (error) {
        alert(`Ops! Something went wrong! 
        Please, reload the page.`);
        console.error(error);
    }
}

form.addEventListener('submit', getCountry);
fetchData();