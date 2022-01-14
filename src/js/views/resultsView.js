import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  // get parent element container
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! please try again';
  _message = '';

  _generateMarkup() {
    // generate preview for results
    // need to return string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
