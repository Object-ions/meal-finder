//Get DOM elements
const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultsHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

//Searc meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  //Clear single mealEl
  singleMealEl.innerHTML = '';

  //Get search term
  const term = search.value;

  //Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        resultsHeading.innerHTML = `<h2>Search  results for '${term}':</h2>`;

        if (data.meals === null) {
          resultsHeading.innerHTML = `<p>there are no search result, try again</p>`
        } else {
          mealsEl.innerHTML = data.meals.map(meal => `
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="meal.strMeal" />
            <div class="meal-info" data-mealID="${data.idMeal}">
            <h3>${meal.strMeal}</h3>
            </div>
          </div>
          `)
            .join();
        }
      });
    //Clear search content
    search.value = '';
  } else {
    showErrorMessage();
    setTimeout(removeMessage, 1500)
  }
}

//Show error message
function showErrorMessage() {
  const error = document.createElement('p');
  error.innerText = 'Please enter a search value';
  resultsHeading.appendChild(error)
}

//Remove message
function removeMessage() {
  resultsHeading.innerHTML = '';
}

//Event listeners
submit.addEventListener('submit', searchMeal)