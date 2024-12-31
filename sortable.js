"use strict";

let currentHeroes = [];
let allHeroes = [];
let currentPage = 1;
let pageSize = 20;

const fetchHeroes = () => {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then((response) => response.json())
        .then((data) => {
            currentHeroes = data;
            allHeroes = data;
            Display(currentHeroes);
            setupPagination();
            sortByDefault()
            setupSearch();
            sortHeroes();
        })
        .catch((error) => console.error('Error fetching data:', error));
};

fetchHeroes();

function setupPagination() {
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const pageSizeInput = document.getElementById('pageSize');

    prev.addEventListener('click', () => changePage(-1));
    next.addEventListener('click', () => changePage(1));
    pageSizeInput.addEventListener('change', () => {
        pageSize = Number(pageSizeInput.value) || currentHeroes.length;
        currentPage = 1;
        Display(currentHeroes);
    });
}

function changePage(direction) {
    const totalPages = Math.ceil(currentHeroes.length / pageSize);
    if ((currentPage + direction > 0) && (currentPage + direction <= totalPages)) {
        currentPage += direction;
        Display(currentHeroes);
    }
}

function Display(heroes) {
    const tbody = document.getElementById('herosTableBody');
    tbody.innerHTML = "";
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, heroes.length);

    heroes.slice(start, end).forEach(hero => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${hero.images.xs}" alt="${hero.name}"></td>
            <td>${hero.name || ""}</td>
            <td>${hero.biography.fullName || ""}</td>
            <td>${hero.powerstats ? JSON.stringify(hero.powerstats).slice(1, -1) : ""}</td>
            <td>${hero.appearance.race || ""}</td>
            <td>${hero.appearance.gender || ""}</td>
            <td>${hero.appearance.height[1] || hero.appearance.height[0]}</td>
            <td>${hero.appearance.weight[1] || ""}</td>
            <td>${hero.biography.placeOfBirth || ""}</td>
            <td>${hero.biography.alignment || ""}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('currentPage').textContent = currentPage;
}

function setupSearch() {
    const searchInput = document.getElementById("search");
    const searchField = document.getElementById("searchField");

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const field = searchField.value;
        applySearch(query, field);
    });

    searchField.addEventListener('change', () => {
        const query = searchInput.value.toLowerCase();
        const field = searchField.value;
        applySearch(query, field);
    });
}

function applySearch(query, field) {
    currentHeroes = allHeroes.filter(hero => {
        const value = getFieldValue(hero, field).toLowerCase();
        return value.includes(query);
    });
    currentPage = 1;
    Display(currentHeroes);
}

function getFieldValue(hero, field) {
    const fields = field.split('.');
    let value = hero;

    for (let i = 0; i < fields.length; i++) {
        value = value[fields[i]];
        if (value === undefined || value === null) {
            return '';
        }
    }

    return value;
}

function sortByDefault() {
    const defaultColumnIndex = 1; 
    const defaultSortFunction = (a, b) => compareValues(a.name, b.name); 

    currentHeroes.sort(defaultSortFunction); 
    Display(currentHeroes);
}


function sortHeroes() {
    const headers = document.querySelectorAll("th");
    const sortingState = {};

    headers.forEach((header, index) => {
        sortingState[index] = false; 

        header.addEventListener("click", () => {
            const heroes = currentHeroes.length ? currentHeroes : allHeroes;

            switch (header.textContent) {
                case "Name":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.name, b.name));
                    break;
                case "Full Name":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.biography.fullName, b.biography.fullName));
                    break;
                case "Powerstats":
                    heroes.forEach(hero => {
                        hero.powerstatsSum = Object.values(hero.powerstats || {}).reduce((acc, value) => acc + (value || 0), 0);
                    });
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.powerstatsSum, b.powerstatsSum, true));
                    break;
                case "Race":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.appearance.race, b.appearance.race));
                    break;
                case "Gender":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.appearance.gender, b.appearance.gender));
                    break;
                case "Height":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(parseHeight(a.appearance.height), parseHeight(b.appearance.height), true));
                    break;
                case "Weight":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(parseWeight(a.appearance.weight), parseWeight(b.appearance.weight), true));
                    break;
                case "Place of Birth":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.biography.placeOfBirth, b.biography.placeOfBirth));
                    break;
                case "Alignment":
                    sortAndDisplay(heroes, sortingState, index, (a, b) => compareValues(a.biography.alignment, b.biography.alignment));
                    break;
                default:
                    console.warn("Unknown column for sorting:", header.textContent);
                    break;
            }
        });
    });
}

function sortAndDisplay(heroes, sortingState, index, compareFunction) {
    const ascending = sortingState[index];
    heroes.sort((a, b) => ascending ? compareFunction(a, b) : compareFunction(b, a));
    sortingState[index] = !ascending;
    currentPage = 1;
    Display(heroes);
}

function compareValues(a, b, isNumeric = false) {
    const isInvalid = (val) => val === null || val === undefined || val === "" || val === "-";

    if (isInvalid(a) && isInvalid(b)) return 0;
    if (isInvalid(a)) return 1; 
    if (isInvalid(b)) return -1;

    if (isNumeric) return a - b;
    return a.toString().localeCompare(b.toString());
}

function parseHeight(height) {
    const value = height[1] || height[0] || "0 cm";
    return parseInt(value.replace(" cm", ""), 10) || 0;
}

function parseWeight(weight) {
    const value = weight[1] || weight[0] || "0 kg";
    return parseInt(value.replace(" kg", ""), 10) || 0;
}