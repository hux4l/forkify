import { API_KEY, API_URL, REC_PER_PAGE } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  // object of recipe returned
  recipe: {},
  // object with searched results
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: REC_PER_PAGE,
  },
  bookmarks: [],
};

//create recipe object
// and insert key, if there is no key nothing happens, but if key is, will add key
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// load recipe from api
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    // create recipe object from fetched json data
    state.recipe = createRecipeObject(data);

    //check if loaded recipe is already bookmarked
    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id
    );
  } catch (err) {
    console.error(`*** ${err} ***`);
    throw err;
  }
};

// search functionality
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // reset page
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// split results into pages, so it gets 10 per page
export const getSearchResultsPage = function (page = state.search.page) {
  // store actual number of page
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  // updates every ingredient quantity based on servings
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// store bookmarks into local storage
const persistBookmarks = function () {
  // add bookmark to local storage
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// bookmarks moder
export const addBookmark = function (recipe) {
  // add new recipe object into bookmarks array
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark, checks if is displayed equal to bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  // store bookmark in local storage
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // check in bookmarks array for element with id we have selected
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as bookmark, checks if is displayed equal to bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// load bookmarks from local storage
const init = function () {
  // load items from local storage
  const storage = localStorage.getItem('bookmarks');

  // if are any bookmarks in local storage, load them into state.bookmarks
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// for testing purposes
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

// function to upload our recipe to the API
export const uploadRecipe = async function (newRecipe) {
  try {
    // get ingredients from new recipe and create an array, filters out only ingredients and not empty
    // map then
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // split ingredients into quantity, unit and description and create an array
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format, Please use correct format');
        // destructure array into 3 separate variables
        const [quantity, unit, description] = ingArr;
        // return object with keys and values
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // create new recipe object formatted as we need for API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // send the data, and store returned recipe into value
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    // convert data into our format and save to state
    state.recipe = createRecipeObject(data);

    // automatically bookmark recipe
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
