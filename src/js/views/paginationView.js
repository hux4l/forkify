import View from './View.js';

class PaginationView extends View {
  // get parent element container
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      // choose the closest btn elements
      const btn = e.target.closest('.btn--inline');

      // if nmo button do nothing
      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      // send page number to go to handler
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    // calculate number of pages based on number of results from search
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are less than 10 recipes
    if (currentPage === 1 && numPages === 1) {
      return '';
    }

    // Page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupPreview(currentPage, 'next');
    }
    // Last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupPreview(currentPage, 'prev');
    }
    // Other page
    if (currentPage > 1 && this._data.page < numPages) {
      return (
        this._generateMarkupPreview(currentPage, 'prev') +
        this._generateMarkupPreview(currentPage, 'next')
      );
    }
  }

  // generates page markup for pagination navigation
  _generateMarkupPreview(page, direction) {
    return `
        <button data-goto="${
          direction === 'prev' ? page - 1 : page + 1
        }" class="btn--inline pagination__btn--${direction}">
          <svg class="search__icon">
            <use href="src/img/icons.svg#icon-arrow-${
              direction === 'prev' ? 'left' : 'right'
            }"></use>
          </svg>
          <span>Page ${direction === 'prev' ? page - 1 : page + 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
