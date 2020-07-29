import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '../css/style.css';

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('../img', false, /\.(png|jpe?g|svg|gif|jpg)$/));

/**--------------------------------------------------------------------------------------------- */
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';

const state = {};

const controlSearch = async() => {

    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);

        //ui for reset
        searchView.clearInput();
        searchView.clearResultList();
        renderLoader(elements.searchRes);


        await state.search.getForkify();

        //render
        clearLoader();
        searchView.renderResults(state.search.result)

    }

};


elements.searchForm.on('submit', (e) => {
    e.preventDefault();
    controlSearch();
})