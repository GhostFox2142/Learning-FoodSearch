import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/style.css';
import jQuery from 'jquery';

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../img', false, /\.(png|jpe?g|svg|gif)$/));

/**--------------------------------------------------------------------------------------------- */
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as likesView from './views/likesView';


/**
 * search control
 */
const controlSearch = async() => {

    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);

        //ui for reset
        searchView.clearInput();
        searchView.clearResultList();
        renderLoader(elements.searchRes);

        try {
            await state.search.getForkify();

            //render
            clearLoader();
            searchView.renderResults(state.search.result)

        } catch {
            clearLoader();
            alert('Hiba történt a receptek lekérdezése közben')
        }

    }

};


elements.searchForm.on('submit', (e) => {
    e.preventDefault();
    controlSearch();
})

elements.searchResPages.on('click', (e) => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const goToPage = parseInt(jQuery(btn).data('goto'), 10);
        searchView.clearResultList();
        searchView.renderResults(state.search.result, goToPage)
    }
});


/**
 * recipe control
 */
const controlRecipe = async() => {
    const id = window.location.hash.replace('#', '');

    if (id) {

        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();

            state.recipe.parseIngredients();

            state.recipe.calcTime();
            state.recipe.calcServings();


            clearLoader();
            recipeView.clearRecipe();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch (error) {
            alert('Hiba történt a kiválasztott recept lekérdezése közben')
            console.log(error);
        }

    }
};

['hashchange', 'load'].forEach(event => jQuery(window).on(event, controlRecipe));


/**
 * list control
 */

const controlList = () => {
    if (!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.rendetItem(item);
    });
}



/**
 * likes control
 */

const controlLikes = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.recipeId;

    if (!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes())

};

jQuery(window).on('load', e => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikeBtn(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like))
})


elements.shoping.on('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__item, .shopping__item *')) {
        state.list.deleteItem(id);

        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.val(), 10);
        state.list.updateCount(id, val);
    }
})

elements.recipe.on('click', (e) => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
})