import Notiflix from 'notiflix';
import debounce from 'lodash.debounce'
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const searchbox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
searchbox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
    
function onSearch() {
    const name = searchbox.value.trim()
    if (name === '') {
       countryList.innerHTML = ''
        countryInfo.innerHTML = '' 
        return
    }
    fetchCountries(name).then(countries => {
        if (countries.length === 1) {
            countryList.innerHTML = ''
            countryInfo.innerHTML = buildMarkupCountry(countries)
            //console.log(buildMarkupCountry(countries))
        } else if (countries.length >= 2 && countries.length < 10) {
            countryList.innerHTML = buildMarkupList(countries)    
        } else if (countries.length > 10) {
            Notiflix.Notify.info("Too many matches found. Please enter a more specific name.")
        }
    })
        .catch (error => Notiflix.Notify.failure("Oops, there is no country with that name"))
}

function buildMarkupCountry(countries) {
    const markup = countries.map(({ flags, name, capital, population, languages }) => {
        return `<div class="country-info">
    <img
        src="${flags.svg}" width=40px height=40px
    />
    <h2>${name.official}</h2>
    <p>Capital: ${capital}</p>
    <p>Population: ${population}</p>
    <p>Languages: ${Object.values(languages)}</p>
    </div>`
    })
    return markup;
}

function buildMarkupList(countries) {
    const markup = countries.map(({ flags, name }) => {
        return `<li class="country-list__item">
    <img
        src="${flags.svg}" width=40px height=40px
    />
    <h2>${name.official}</h2>
    </li>`
    })
    return markup;
}