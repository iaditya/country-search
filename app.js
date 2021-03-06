class SearchInput {

    constructor() {
        this.input = document.querySelector('#input-search');
        this.inputContainer = document.querySelector('.input-container');
        this.resultBox = document.querySelector('.result-box');
        this.selectedItemsContainer = document.querySelector('.selected-items');
        this.completeDataContainer = document.querySelector('.full-data');
        this.alert = document.querySelector('.alert');
        this.countriesList = [];
        this.countryCodes = [];
        this.addedTags = [];

        this.completeDataContainer.innerText = '[]';
    }

    checkIfAlreadyAdded = (tag) => {
        return this.addedTags.find(item => item.numericCode === tag.numericCode);
    }

    addCountry = (country) => {

        if (this.checkIfAlreadyAdded(country)) {
            this.alert.classList.add('show');
            setTimeout(() => {
                this.alert.classList.remove('show');
            }, 1000);
            this.input.focus();
            return;
        }

        const tag = this.countriesList.find(item => country.numericCode === item.numericCode);

        const span = document.createElement('span');
        span.setAttribute('id', tag.numericCode);
        span.innerText = tag.alpha3Code + " ";
        span.classList.add('selected-item');

        const removeButton = document.createElement('span');
        removeButton.innerText = 'x';
        removeButton.classList.add('close');
        removeButton.addEventListener("click", () => this.removeCountry(tag.numericCode));


        span.appendChild(removeButton);
        this.selectedItemsContainer.appendChild(span);

        this.addedTags.push(tag);
        this.input.value = '';
        this.resultBox.classList.remove('show');
        this.focusOnInput();

        this.completeDataContainer.innerText = JSON.stringify(this.addedTags);
    }

    removeCountry = (numericCode) => {
        this.addedTags = this.addedTags.filter((item) => {
            return item.numericCode !== numericCode;
        });

        this.completeDataContainer.innerText = JSON.stringify(this.addedTags);

        const elem = document.getElementById(numericCode);
        elem.remove();
        this.focusOnInput();
    }

    removeLastAdded = () => {
        if (this.addedTags.length) {
            const lastOneAdded = this.addedTags[this.addedTags.length - 1];
            this.removeCountry(lastOneAdded.numericCode);
        }
    }

    focusOnInput = () => {
        this.input.focus();
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
    instance.input.addEventListener('keydown', logKey);
    instance.inputContainer.addEventListener('click', () => instance.focusOnInput());

    function logKey(e) {
        if (e.code === 'Backspace' && !e.target.value) {
            instance.removeLastAdded();
        }
    }

    function inputChanges(e) {
        instance.resultBox.innerHTML = '';

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
        let ul = document.createElement('ul');

        const foundList = instance.countryCodes
            .filter(country => {
                return country.alpha3Code.toLowerCase().includes(search_term.toLowerCase())
            });

        if (foundList.length > 0) {
            foundList.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('search-item');
                li.innerText = item.name + ": ";

                const span = document.createElement('span');
                span.innerText = item.alpha3Code;

                li.appendChild(span);

                li.addEventListener("click", function () {
                    instance.addCountry(item);

                });
                ul.appendChild(li);
            });
        }
        else {
            const li = document.createElement('li');
            li.classList.add('search-item-not-found');
            li.innerText = "No data found.";
            ul.appendChild(li);
        }

        instance.resultBox.appendChild(ul);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});

