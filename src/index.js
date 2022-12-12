import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
    const name = refs.input.value.trim();
    if (name.length < 1) reset();
    if (!name) {
        reset();
        return;
    }
    fetchCountries(name).then(success).catch(error);
}

function success(countries) {
    if (countries.length > 10) tooManyCountries(countries);
    if (countries.length > 1  && countries.length <= 10) countriesList(countries);
    if (countries.length === 1) oneCountry(countries);
}

function tooManyCountries(countries) {
    Notify.info(
        'Too many matches found. Please enter a more specific name.'
    );
    reset();
}

function countriesList(countries) {
    const markup = countries.map(({ flags: { svg }, name: { official }, }) => {
        return `<li>
        <img src="${svg}" alt="${official}" width="30" height="20" >  ${official}</li>`;
    })
        .join('');
    refs.list.insertAdjacentHTML('beforeend', markup);
    refs.info.innerHTML = '';
}

function oneCountry(countries) {
    const markup = countries.map(({
        flags: { svg }, name: { official }, capital, population, languages, }) => {
        return `<div>
        <img width="40" src="${svg}" />
        <h2>${official}</h2>
        </div>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages).join(', ')}</p>`;
    })
    refs.info.insertAdjacentHTML('beforeend', markup);
    refs.list.innerHTML = '';
}

function error() {
    Notify.failure('Oops, there is no country with that name');
    reset();
}

function reset() {
    refs.info.innerHTML = '';
    refs.list.innerHTML = '';
}