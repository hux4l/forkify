class SearchView {
  // parent element in DOM, search container
  #parentElement = document.querySelector('.search');

  // get the query from search input
  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  // clear input search
  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  // add event handler fot search input field
  addHandlerSearch(handler) {
    this.#parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

// as default export new object of SearchView()
export default new SearchView();
