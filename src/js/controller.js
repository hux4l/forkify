import * as model from './model.js';
import { MODAL_CLOSES } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { getSearchResultsPage } from './model.js';

// fake just for dev
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    //check the hash in the web browser url
    const id = window.location.hash.slice(1);

    // if no id , do nothing
    if (!id) return;
    recipeView.renderSpinner();

    // 0 update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // bookmarks view update
    bookmarksView.update(model.state.bookmarks);

    //1 loading recipe, will return promise
    await model.loadRecipe(id);

    //2 rendering recipe
    // method called from recipeView
    recipeView.render(model.state.recipe);

    // control servings test
    controlServings;
  } catch (err) {
    // recipeView.renderError();
  }
};

// new controller for searched results
const controlSearchResults = async function () {
  try {
    // render spinner for loading search results
    resultsView.renderSpinner();

    // 1 get query from search input on page
    const query = searchView.getQuery();

    // guard class
    if (!query) return;

    // 2 load search results array of objects
    await model.loadSearchResults(query);

    // console.log(model.state.search.results);
    // 3 render data from search result
    // resultsView.render(model.state.search.results);
    // we want only some results
    resultsView.render(model.getSearchResultsPage());

    // 4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    // recipeView.renderError();
  }
};

const controlPagination = function (pageToGo) {
  // render new results
  resultsView.render(model.getSearchResultsPage(pageToGo));

  // render new pagination buttons
  paginationView.render(model.state.search);
};

// updates serving based on number of portions user specified
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark icon
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// load bookmarks on load
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

// controls adding new recipe to the data
const controlAddRecipe = async function (newRecipe) {
  try {
    // spinner for uploading
    addRecipeView.renderSpinner();

    // upload new recipe
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // update ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSES * 1000);
  } catch (err) {
    addRecipeView.renderError(err);
  }
};

// initializes event handler with control function
const init = function () {
  // load bookmarks on page load
  bookmarksView.addHandlerRender(controlBookmarks);

  // on page load add handlers for load recipes
  recipeView.addHandlerRender(controlRecipes);

  // servings buttons handler
  recipeView.addHandlerUpdateServings(controlServings);

  // event handler for bookmark button
  recipeView.addHandlerAddBookmark(controlAddBookmark);

  // on page load add handler to search input
  searchView.addHandlerSearch(controlSearchResults);

  // controllers for pagination buttons
  paginationView.addHandlerClick(controlPagination);

  // handle upload of new recipe
  addRecipeView._addHandlerUploadRecipe(controlAddRecipe);
};
init();
