import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { RecipeRating } from '../../objects/recipe';
import styles from './Rating.module.scss';

export interface RatingProps {
  rating: RecipeRating;
}

export function Rating({ rating }: RatingProps) {
  const ratingItems = [];

  for (let i = 0; i < rating; i++) {
    ratingItems.push(
      <FontAwesomeIcon key={`fill-star-${i}`} icon={['fas', 'star']} />
    );
  }
  for (let i = 0; i < 5 - rating; i++) {
    ratingItems.push(
      <FontAwesomeIcon key={`unfill-star-${i}`} icon={['far', 'star']} />
    );
  }

  return <div className={styles.wrapper}>{ratingItems}</div>;
}
