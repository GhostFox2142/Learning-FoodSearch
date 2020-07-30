import { elements } from './base';
import svg from '../../img/icons.svg';
import jQuery from 'jquery';

export const getInput = () => elements.searchInput.val();

export const clearInput = () => {
    elements.searchInput.val('');
};

export const clearResultList = () => {
    elements.searchResultList.empty();
    elements.searchResPages.empty();
};

export const highlightSelected = (id) => {
    const resArr = Array.from(jQuery('.results__link'));
    resArr.forEach(el => {
        jQuery(el).removeClass('results__link--active');
    })
    jQuery(`.results__link[href="#${id}"]`).addClass('results__link--active');
}

export const recipeTitleReducer = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((ac, cur) => {
            if (ac + cur.length <= limit) {
                newTitle.push(cur);
            }
            return ac + cur.length;
        }, 0);

        return `${newTitle.join(' ')}...`;
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt=">${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipeTitleReducer(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResultList.append(markup);
};

/**
 * 
 * @page {*} page 
 * @type {*} 'prev' or 'next' 
 */
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="${svg}#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButton = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }

    elements.searchResPages.append(button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    renderButton(page, recipes.length, resPerPage);
};