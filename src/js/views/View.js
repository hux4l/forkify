export default class View {
  // all the data that is common to all views
  _data;

  // how to do documentation
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author tobas.sk
   * @todo Finish implementation
   */
  render(data, render = true) {
    // check if data exists
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    // here are stored data from loaded recipe
    this._data = data;

    // generate html markup
    const markup = this._generateMarkup(data);

    if (!render) return markup;

    // clear parent element before inserting something new
    this._clear();

    // render markup on the page
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // will update only text not other elements
  update(data) {
    // here are stored data from loaded recipe
    this._data = data;

    // generate html markup
    const newMarkup = this._generateMarkup(data);

    // we convert it to new virtual DOM object that is in memory and compare with existing
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // compare two HTML markups and change only what is changed
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // if is newElement other than Current elements change current with new
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // change only nodeValue of element
        curEl.textContent = newEl.textContent;
      }

      // change attribute on the servings + / - buttons
      if (!newEl.isEqualNode(curEl)) {
        // convert object to array and copy attributes from new to cur
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    // clears the paren element
    this._parentElement.innerHTML = '';
  }

  // render spinner when waiting for data to fetch from api
  renderSpinner() {
    const markup = `
    <div class='spinner'>
      <svg>
        <use href='src/img/icons.svg#icon-loader'></use>
      </svg>
    </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // render error message passed in
  renderError(message = this._errorMessage) {
    const markup = `
    <div class='error'>
      <div>
        <svg>
          <use href='src/img/icons.svg#icon-alert-triangle'></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // message when success
  renderMessage(message = this._message) {
    const markup = `
    <div class='message'>
      <div>
        <svg>
          <use href='src/img/icons.svg#icon-smile'></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
