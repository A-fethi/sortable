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
      // sortByDefault();
      setupSearch();
      setupSorting();
    })
    .catch((error) => console.error("Error fetching data:", error));
};

fetchHeroes();

function setupPagination() {
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");
  const pageSizeInput = document.getElementById("pageSize");

  prev.addEventListener("click", () => changePage(-1));
  next.addEventListener("click", () => changePage(1));
  pageSizeInput.addEventListener("change", () => {
    pageSize = Number(pageSizeInput.value) || currentHeroes.length;
    currentPage = 1;
    Display(currentHeroes);
  });
}

function changePage(direction) {
  const totalPages = Math.ceil(currentHeroes.length / pageSize);
  if (currentPage + direction > 0 && currentPage + direction <= totalPages) {
    currentPage += direction;
    Display(currentHeroes);
  }
}

function Display(heroes) {
  const tbody = document.getElementById("herosTableBody");
  tbody.innerHTML = "";
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, heroes.length);

  heroes.slice(start, end).forEach((hero) => {
    const powerstats = Object.entries(hero.powerstats).map(([key, value]) => `${key}: ${value}`).join(", ");
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><img src="${hero.images.xs}" alt="${hero.name}"></td>
            <td>${hero.name || ""}</td>
            <td>${hero.biography.fullName || ""}</td>
            <td><pre>${powerstats}</pre></td>
            <td>${hero.appearance.race || ""}</td>
            <td>${hero.appearance.gender || ""}</td>
            <td>${hero.appearance.height[1] || hero.appearance.height[0]}</td>
            <td>${hero.appearance.weight[1] || ""}</td>
            <td>${hero.biography.placeOfBirth || ""}</td>
            <td>${hero.biography.alignment || ""}</td>
        `;
    tbody.appendChild(row);
  });
  document.getElementById("currentPage").textContent = currentPage;

  const totalPages = Math.ceil(heroes.length / pageSize);

  document.getElementById("prev").disabled = currentPage <= 1;
  document.getElementById("next").disabled = currentPage >= totalPages;
}

function setupSearch() {
  const searchInput = document.getElementById("search");
  const searchField = document.getElementById("searchField");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const field = searchField.value;
    applySearch(query, field);
  });

  searchField.addEventListener("change", () => {
    const query = searchInput.value.toLowerCase();
    const field = searchField.value;
    applySearch(query, field);
  });
}

function applySearch(query, field) {
  currentHeroes = allHeroes.filter((hero) => {
    const value = getFieldValue(hero, field).toLowerCase();
    return value.includes(query);
  });
  currentPage = 1;
  Display(currentHeroes);
}

function getFieldValue(hero, field) {
  const fields = field.split(".");
  let value = hero;

  for (let i = 0; i < fields.length; i++) {
    value = value[fields[i]];
    if (value === undefined || value === null) {
      return "";
    }
  }

  return value;
}

function setupSorting() {
  const headers = document.querySelectorAll("th");
  headers.forEach((header, index) => {
    header.addEventListener("click", () => {
      const field = header.id;
      sortHeroes(field);
    });
  });
}

let lastSortedColumn = null;
let lastSortOrder = "asc";

function sortHeroes(field) {
  const columnType = getColumnType(field);
  const isNumeric = columnType === "numeric";

  if (lastSortedColumn === field) {
    lastSortOrder = lastSortOrder === "asc" ? "desc" : "asc";
  } else {
    lastSortedColumn = field;
    lastSortOrder = "asc";
  }

  const [validHeroData, invalidHeroData] = separateValidInvalidHeroes(field);

  validHeroData.sort((a, b) => {
    const valueA = getFieldValue(a, field);
    const valueB = getFieldValue(b, field);

    if (valueA === valueB) return 0;

    let result = 0;
    if (isNumeric) {
      if (field === "appearance.height") {
        result = parseHeight(valueA) - parseHeight(valueB);
      } else if (field === "appearance.weight") {
        result = parseWeight(valueA) - parseWeight(valueB);
      } 
    } else if (field === "powerstats") {
            const totalPowerA = calculateTotalPowerstats(a);
            const totalPowerB = calculateTotalPowerstats(b);
            result = totalPowerA - totalPowerB;
    } else {
      result = valueA.localeCompare(valueB);
    }

    return lastSortOrder === "asc" ? result : -result;
  });

  const sortedHeroes = validHeroData.concat(invalidHeroData);

  Display(sortedHeroes);
}

function getColumnType(field) {
  const numericColumns = ["appearance.height", "appearance.weight"];
  return numericColumns.includes(field) ? "numeric" : "string";
}

function isInvalid(value) {
  return value === null || value === undefined || value === "" || value === "-";
}

function separateValidInvalidHeroes(field) {
  const validHeroes = [];
  const invalidHeroes = [];

  currentHeroes.forEach((hero) => {
    const value = getFieldValue(hero, field);

    if (isInvalid(value)) {
      invalidHeroes.push(hero);
    } else {
      validHeroes.push(hero);
    }
  });

  return [validHeroes, invalidHeroes];
}

function parseHeight(heightString) {
  if (!heightString || heightString === "-") return 0;

  const match = heightString[0].match(/(\d+)'(\d+)/);
  if (match) {
    const feet = parseInt(match[1], 10);
    const inches = parseInt(match[2], 10);
    return feet * 12 + inches;
  }
  return 0;
}

function parseWeight(weight) {
  const value = weight[0].replace(" lb", "") || "0";
  return parseInt(value, 10) || 0;
}

function calculateTotalPowerstats(hero) {
    const stats = hero.powerstats || {};
    const total = Object.values(stats).reduce((sum, stat) => sum + (parseInt(stat) || 0), 0);
    console.log(total)
    return total;
  }