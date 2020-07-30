import jQuery from 'jquery';
import svg from '../../img/icons.svg';


export const elements = {
    searchForm: jQuery('.search', document),
    searchInput: jQuery('.search__field', document),
    searchResultList: jQuery('.results__list', document),
    searchRes: jQuery('.results'),
    searchResPages: jQuery('.results__pages'),
    recipe: jQuery('.recipe'),
    shoping: jQuery('.shopping__list'),
    likesMenu: jQuery('.likes__field'),
    likesList: jQuery('.likes__list')
};

export const elementStrings = {
    loader: 'loader'
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="${svg}#icon-cw"></use>
            </svg>
        </div>
    `
    jQuery(parent).prepend(loader);
};

export const clearLoader = () => {
    const loader = jQuery(`.${elementStrings.loader}`);
    if (loader) loader.remove();
}