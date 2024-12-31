"use strict";
const loadData = (heroes) => {
    console.log(heroes);
};

let currentHeroes = [];
let sorted = true;

const fetchHeroes = () => {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then((response) => response.json())
        .then((data) => {
            currentHeroes = data;
            console.log(currentHeroes);
            Display(currentHeroes);
            searchHeroes(data)
            sortHeroes(data)
            prevPage(currentHeroes);
            nextPage(currentHeroes);
        })
        .catch((error) => console.error('Error fetching data:', error));
};

fetchHeroes();

export function prevPage(heroes) {
    console.log(heroes);

    const prev = document.getElementById('prev');
    prev.addEventListener('click', function () {
        const tbody = document.getElementById('herosTableBody')
        const pageSize = document.getElementById('pageSize');
        const currentPage = document.getElementById('currentPage');
        let num = pageSize.value;
        let page = currentPage.textContent;
        if (page > 1) {
            tbody.innerHTML = "";
            const start = (page - 2) * num;
            Display(heroes.slice(start), num);
            currentPage.textContent = page - 1;
        }
    });
}

export function nextPage(heroes) {
    const next = document.getElementById('next');
    next.addEventListener('click', function () {
        const tbody = document.getElementById('herosTableBody')
        const pageSize = document.getElementById('pageSize');
        const currentPage = document.getElementById('currentPage');
        let num = pageSize.value;
        let page = currentPage.textContent;
        if (page < heroes.length / num) {
            tbody.innerHTML = "";
            const start = (page * num);
            Display(heroes.slice(start, start + num), num);
            currentPage.textContent = +page + 1;
        }
    });
}
export function Display(heroes, num = 20) {
    let checker = 0;
    const tbody = document.getElementById('herosTableBody')
    const pageSize = document.getElementById('pageSize')
    pageSize.addEventListener('change', function () {
        tbody.innerHTML = "";
        Display(heroes, pageSize.value);
    });

    heroes.forEach(function (hero) {
        if (checker >= num) {
            return;
        }
        const row = document.createElement("tr");
        row.classList.add(`hero-${hero.id}`);
        tbody.appendChild(row);

        const imageCell = document.createElement("td");
        imageCell.innerHTML = `<img src="${hero.images.xs}" alt="${hero.name}">`;
        row.appendChild(imageCell);

        const nameCell = document.createElement("td");
        hero.name ? nameCell.textContent = `${hero.name}` : nameCell.textContent = "";
        row.appendChild(nameCell);

        const fullnameCell = document.createElement("td");
        hero.biography.fullName ? fullnameCell.textContent = `${hero.biography.fullName}` : fullnameCell.textContent = "";
        row.appendChild(fullnameCell);

        const powerstatsCell = document.createElement("td");
        hero.powerstats ? powerstatsCell.textContent = `${JSON.stringify(hero.powerstats).slice(1, -1)}` : powerstatsCell.textContent = "";
        row.appendChild(powerstatsCell);

        const raceCell = document.createElement("td");
        hero.appearance.race ? raceCell.textContent = `${hero.appearance.race}` : raceCell.textContent = "";
        row.appendChild(raceCell);

        const genderCell = document.createElement("td");
        hero.appearance.gender ? genderCell.textContent = `${hero.appearance.gender}` : genderCell.textContent = "";
        row.appendChild(genderCell);

        const heightCell = document.createElement("td");
        heightCell.textContent = hero.appearance.height[1] ? `${hero.appearance.height[1]}` : hero.appearance.height[0];
        row.appendChild(heightCell);

        const weightCell = document.createElement("td");
        weightCell.textContent = hero.appearance.weight[1] ? `${hero.appearance.weight[1]}` : "";
        row.appendChild(weightCell);

        const placeofbirthCell = document.createElement("td");
        hero.biography.placeOfBirth ? placeofbirthCell.textContent = `${hero.biography.placeOfBirth}` : placeofbirthCell.textContent = "";
        row.appendChild(placeofbirthCell);

        const alignmentCell = document.createElement("td");
        hero.biography.alignment ? alignmentCell.textContent = `${hero.biography.alignment}` : alignmentCell.textContent = "";
        row.appendChild(alignmentCell);
        checker++;
    });
};

export const searchHeroes = (heroes) => {
    let input = document.getElementById("search")
    const tbody = document.getElementById('herosTableBody')
    input.addEventListener('input', function () {
        const filter = input.value.toLowerCase()
        const filteredHeroes = heroes.filter(hero => hero.name.toLowerCase().includes(filter));
        currentHeroes = filteredHeroes;
        tbody.innerHTML = ""
        Display(currentHeroes)
        nextPage(currentHeroes)
        prevPage(currentHeroes)
    });
}

export const sortHeroes = (heroes) => {
    let elements = document.querySelectorAll("th");
    const tbody = document.getElementById('herosTableBody')
    elements.forEach(element => {
        element.addEventListener("click", function () {
            console.log(element.textContent === "Name");

            switch (element.textContent) {
                case "Name":
                    const sortedNames = heroes.sort((a, b) => a.name.localeCompare(b.name));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedNames)
                        sorted = false
                    } else {
                        Display(sortedNames.reverse());
                        sorted = true
                    }
                    break;
                case "Full Name":
                    const sortedFullName = heroes.sort((a, b) => a.biography.fullName.localeCompare(b.biography.fullName));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedFullName)
                        sorted = false
                    } else {
                        Display(sortedFullName.reverse());
                        sorted = true
                    }
                    break;
                case "Powerstats":
                    heroes.forEach(hero => {
                        hero.powerstatsSum = Object.values(hero.powerstats).reduce((acc, value) => acc + value, 0);
                    });
                    
                    const sortedPowerstats = heroes.sort((a, b) => a.powerstatsSum - b.powerstatsSum);
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedPowerstats)
                        sorted = false
                    } else {
                        Display(sortedPowerstats.reverse());
                        sorted = true
                    }
                    break;
                case "Race":
                    const sortedRace = heroes.sort((a, b) => a.appearance.race.localeCompare(b.appearance.race));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedRace)
                        sorted = false
                    } else {
                        Display(sortedRace.reverse());
                        sorted = true
                    }
                    break;
                case "Gender":
                    const sortedGender = heroes.sort((a, b) => a.appearance.gender.localeCompare(b.appearance.gender));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedGender)
                        sorted = false
                    } else {
                        Display(sortedGender.reverse());
                        sorted = true
                    }
                    break;
                case "Height":
                    const sortedHeight = heroes.sort((a, b) => a.appearance.height.localeCompare(b.appearance.height));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedHeight)
                        sorted = false
                    } else {
                        Display(sortedHeight.reverse());
                        sorted = true
                    }
                    break;
                case "Weight":
                    const sortedWeight = heroes.sort((a, b) => a.appearance.weight.localeCompare(b.appearance.weight));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedWeight)
                        sorted = false
                    } else {
                        Display(sortedWeight.reverse());
                        sorted = true
                    }
                    break;
                case "Place Of Birth":
                    const sortedPoB = heroes.sort((a, b) => a.biography.placeOfBirth.localeCompare(b.biography.placeOfBirth));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedPoB)
                        sorted = false
                    } else {
                        Display(sortedPoB.reverse());
                        sorted = true
                    }
                    break;
                case "Alignment":
                    const sortedAlignment = heroes.sort((a, b) => a.biography.alignment.localeCompare(b.biography.alignment));
                    tbody.innerHTML = "";
                    if (sorted) {
                        Display(sortedAlignment)
                        sorted = false
                    } else {
                        Display(sortedAlignment.reverse());
                        sorted = true
                    }
                    break;
                default:
                    break;
            }
        });
    });
}

