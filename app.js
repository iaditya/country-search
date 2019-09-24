class SearchInput {

    constructor() {
        this.input = document.querySelector('#input-search');
        this.resultBox = document.querySelector('.result-box');
        this.ul = document.createElement('ul');


        this.countriesList = [];
        this.countryCodes = [];



    }
}


function init() {
    const instance = new SearchInput();

    // Ajax call
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onload = function () {
        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(typeof xhr.response);
            instance.countriesList = xhr.response;

            instance.countryCodes = instance.countriesList.map(item => {
                return {
                    alpha3Code: item.alpha3Code,
                    numericCode: item.numericCode,
                    name: item.name
                };
            })
        } else {
            console.log('The request failed!');
        }
    };
    xhr.open('GET', 'https://restcountries.eu/rest/v2/all');
    xhr.send();



    instance.input.addEventListener('input', (e) => inputChanges(e));

    function inputChanges(e) {
        //if finds value
        if (e.target.value.length) {
            instance.resultBox.classList.add('show');
            instance.input.value = (e.target.value).toUpperCase();
            searchCountry(instance.input.value);
        } 
        // hide the search box
        else {
            instance.resultBox.classList.remove('show');
        }
    }

    function searchCountry(search_term) {
        console.log(search_term);
        instance.countryCodes
            .filter(country => {
                console.log(search_term);
                return country.alpha3Code.toLowerCase().includes(search_term.toLowerCase())
            })
            .forEach(item => {
                const li = document.createElement('li');
                //li.classList.add('country-item');

            })
    }
}

document.addEventListener('DOMContentLoaded', function () {
    init();
})