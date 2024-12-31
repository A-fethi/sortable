"use strict"; 
const loadData = (heroes) => {
    console.log(heroes);
};

const fetchHeroes = () => {
    fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
        .then((response) => response.json())
        .then((data) => {
            Display(data);
            searchHeroes(data)
            prevPage(data);
            nextPage(data);
        })
        .catch((error) => console.error('Error fetching data:', error));
};

fetchHeroes();

export function prevPage(heroes) {
    console.log(heroes);
    
    const prev = document.getElementById('prev');
    prev.addEventListener('click', function () {
        const table = document.getElementById('heroesTable');
        const pageSize = document.getElementById('pageSize');
        const currentPage = document.getElementById('currentPage');
        let num = pageSize.value;
        let page = currentPage.textContent;
        if (page > 1) {
            table.innerHTML = "";
            const start = (page - 2) * num;
            Display(heroes.slice(start), num);
            currentPage.textContent = page - 1;
        }
    });
}

export function nextPage(heroes) {
    const next = document.getElementById('next');
    next.addEventListener('click', function () {
        const table = document.getElementById('heroesTable');
        const pageSize = document.getElementById('pageSize');
        const currentPage = document.getElementById('currentPage');
        let num = pageSize.value;
        let page = currentPage.textContent;
        if (page < heroes.length / num) {
            table.innerHTML = "";
            const start = (page * num);
            Display(heroes.slice(start, start + num), num);
            currentPage.textContent = +page + 1;
        }
    });
}
export function Display(heroes, num = 20) {
    let checker = 0;
    const table = document.getElementById('heroesTable');
    const pageSize = document.getElementById('pageSize')
    pageSize.addEventListener('change', function () {
        table.innerHTML = "";
        Display(heroes, pageSize.value);
    }); 
    heroes.forEach(function (hero) {
        if (checker >= num) {
            return;
        }
        const row = document.createElement("tr"); 
        row.classList.add(`hero-${hero.id}`); 
        table.appendChild(row); 

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
    input.addEventListener('input', function () {
        const filter = input.value.toLowerCase()
        const filteredHeroes = heroes.filter(hero => hero.name.toLowerCase().includes(filter));
        Display(filteredHeroes)
    });
}
