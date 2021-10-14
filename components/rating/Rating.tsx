import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import {RecipeRating} from '../../objects/recipe';
import styles from './Rating.module.scss';

export interface RatingProps {
    rating: RecipeRating;
    editable?: boolean;
    onRatingSelected?: (newRating: RecipeRating) => void;
}

export function Rating({rating, editable = false, onRatingSelected = ()=> {}}: RatingProps) {
    const ratingItems = [];

    for (let i: RecipeRating = 0; i < rating; i++) {

        ratingItems.push(
            <FontAwesomeIcon key={`fill-star-${i}`} icon={['fas', 'star']} onClick={() => onIconClicked(i)}/>
        );
    }
    for (let i = rating; i < 5; i++) {
        ratingItems.push(
            <FontAwesomeIcon key={`unfill-star-${i}`} icon={['far', 'star']} onClick={() => onIconClicked(i)}/>
        );
    }

    function onIconClicked(rating: RecipeRating) {
        if (!editable) {
            return;
        }
        onRatingSelected(rating);
    }

    return <div className={`${styles.wrapper} ${editable?styles.editable:''}`}>{ratingItems}</div>;
}

