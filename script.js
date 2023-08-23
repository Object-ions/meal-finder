// Get DOM elements
const search = document.getElementById('search');
search.focus();
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultsHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear single mealEl
  singleMealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  // Check for empty
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
         resultsHeading.innerHTML = `<h2>Search Results for '${term}'</h2>`;

         if (data.meals === null) {
          resultsHeading.innerHTML = `<p>No results found for '${term}'</p>`;
         } else {
          mealsEl.innerHTML = data.meals.map(meal => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
          `).join('');
         }
      });

      // Clear search input
      search.value = '';
  } else {
    showErrorMessage();
    setTimeout(removeMessage, 1500)
  }
}

// Show error message
function showErrorMessage() {
  const error = document.createElement('p');
  error.innerText = 'Please enter a search term';
  resultsHeading.appendChild(error)
}

// Remove message
function removeMessage() {
  resultsHeading.innerHTML = '';
}

//Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
  .then(res => res.json())
  .then(data => {
    const meal = data.meals[0];

    addMealToDOM(meal);
  });
}

// Add meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
  <div class ="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
      <p> ${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
      </ul>
  </div>
  `;
}

// Event listeners
submit.addEventListener('submit', searchMeal);
mealsEl.addEventListener('click', e => {
  const path = e.path || (e.composedPath && e.composedPath());
  const mealInfo = path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info');
    } else {
      false;
    }
  });

  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    getMealById(mealID);
  }
});