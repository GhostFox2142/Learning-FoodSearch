import { elements } from './base';
import jQuery from 'jquery';
import svg from '../../img/icons.svg';
import { recipeTitleReducer } from './searchView';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    jQuery('.recipe__love use').attr(`href`, `${svg}#${iconString}`);
}

export const toggleLikeMenu = numLikes => {
    ((numLikes > 0) ? elements.likesMenu.show() : elements.likesMenu.hide());
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${recipeTitleReducer(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.append(markup);
};

export const deleteLike = id => {
    jQuery(`.likes__link[href="#${id}"]`).remove();

}