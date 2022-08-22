const list = document.querySelector(".countries");
const form = document.querySelector("form");
const titles = document.querySelectorAll('.place');

const capital = document.getElementById('capital');
const currency = document.getElementById('currency');
const languages = document.getElementById('languages');
const map = document.getElementById('map');
const population = document.getElementById('population');
const flag = document.getElementById('flag');

const endpoint = "https://restcountries.com/v3.1/all";
const countries = [];


const fetchData = async() => {
    try {
        const res = await fetch(endpoint);
        const data = await res.json();
        countries.push(...data);
        populateList(countries);
    } catch (error) {
        console.error(error)
    }
}
fetchData();

function populateList(countries) {
    let option = "";
    let arrCountries = [];

    countries
        .forEach(country => {
            let countryName = `${country.name.common}`
            arrCountries.push(countryName)
        });

    arrCountries
        .sort()
        .forEach(country => option += `<option value="${country}"> ${country} </option>`)

    list.innerHTML = option;
}

function getCountry(e) {
    e.preventDefault();
    let countrySelected = `${list.value}`;
    titles.forEach(title => title.textContent  = `${countrySelected}!`);
    getData(countrySelected);
}

function getData(selected) {
    let countryName = countries.find(country => country.name.common === selected);

    capital.innerHTML = handleCapital(countryName);;
    currency.innerHTML = handleCurrency(countryName);
    languages.innerHTML = handleLanguages(countryName);
    population.innerHTML = handlePopulation(countryName);
    map.innerHTML = handleMap(countryName)
    flag.innerHTML = `<img src="${countryName.flags.png}">`;
}


function handleCapital(countryName) {
    if (countryName.capital) {

        let capitals = countryName.capital;
        let allCap = [];

        for (const capital in capitals) {
            nameCap = capitals[capital];
            allCap.push(nameCap)
        }

        if(allCap.length > 1) {
            let last = allCap.pop();
            let finalCap = `${allCap.join(', ')} and ${last}`;
            return finalCap;
        } else {
            return capitals;
        }
    } else {
        return `has no official capital`
    } 
}

function handleCurrency(countryName) {
    if(countryName.currencies) {

        let objCurrencies = countryName.currencies;
        let allCurr = [];
        
        for (const currency in objCurrencies) {
            let name = countryName.currencies[currency].name;
            let symbol = countryName.currencies[currency].symbol;
            let curr = `${name} - ${currency} (${symbol || ""})`
            allCurr.push(curr)
        }

        if (allCurr.length > 1) {
            let last = allCurr.pop();
            let finalCurr = `${allCurr.join(', ')} and ${last}`;
            return finalCurr;
        } else {
            return allCurr;
        }
        
    } if(countryName.name.common === "Antarctica") {
        return `Antarctic dollar`
    } if(countryName.name.common === "Heard Island and McDonald Islands"){
        return `Australian dollar`
    }
    else {
        return `has no official currency`
    }
}


function handlePopulation(countryName) {
    if(countryName.population) {
        let population = countryName.population
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return population;
    } else {
        return `has no official data`
    }
}

function handleLanguages(countryName) {
    if(countryName.languages) {
        let langs = [];
        let objLanguages = Object.values(countryName.languages);
        
        for (const lang of objLanguages) {
            langs.push(lang);
        }

        if(langs.length > 1 ) {
            let last = langs.pop();
            let finalLangs = `${langs.join(', ')} and ${last}`;
            return finalLangs        
        } else {
            return langs;
        }
        
    } else { 
        return `has no official language.`
    }
}

function handleMap(countryName) {
    let srcMap = countryName.maps.googleMaps;
    let html = `<a href="${srcMap}" target="_blank"> <img src="../img/icon.png"></a>`;
    
    return map.innerHTML = html;
        
}




form.addEventListener('submit', getCountry);


