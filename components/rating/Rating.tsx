import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { RecipeRating } from '../../objects/recipe';
import styles from './Rating.module.scss';
import { createPopper } from '@popperjs/core';

export interface RatingProps {
  rating: RecipeRating;
  editable?: boolean;
  onRatingSelected?: (newRating: RecipeRating) => void;
}

export function Rating({
  rating,
  editable = false,
  onRatingSelected = () => {}
}: RatingProps) {
  let ratingItems = generateStars(rating);
  const [ratingChangeDropdownVisible, setRatingChangeDropdownVisible] =
    useState(false);
  const chooserElement = useRef<HTMLDivElement>(null);
  const ratingElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ratingChangeDropdownVisible) {
      chooserElement.current.classList.add(styles.visible);
      createPopper(ratingElement.current!, chooserElement.current!, {
        placement: 'bottom-start',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-10, 0]
            }
          }
        ]
      });
      document.addEventListener('click', handleClickOutside, false);
      document.addEventListener('touchstart', handleClickOutside, false);
    } else {
      document.removeEventListener('click', handleClickOutside, false);
      document.removeEventListener('touchstart', handleClickOutside, false);
      chooserElement.current.classList.remove(styles.visible);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside, false);
      document.removeEventListener('touchstart', handleClickOutside, false);
    };
  }, [ratingChangeDropdownVisible]);

  const handleClickOutside = useCallback((event) => {
    if (!chooserElement.current.contains(event.target)) {
      setRatingChangeDropdownVisible(false);
    }
  }, []);

  function generateStars(rating: RecipeRating): JSX.Element[] {
    const ratingItems: JSX.Element[] = [];

    for (let i: RecipeRating = 1; i <= rating; i++) {
      ratingItems.push(
        <FontAwesomeIcon key={`fill-star-${i}`} icon={['fas', 'star']} />
      );
    }
    for (let i = (rating + 1) as RecipeRating; i <= 5; i++) {
      ratingItems.push(
        <FontAwesomeIcon key={`unfill-star-${i}`} icon={['far', 'star']} />
      );
    }
    return ratingItems;
  }

  function onRatingClicked(rating: RecipeRating) {
    if (!editable) {
      return;
    }
    onRatingSelected(rating);
    setRatingChangeDropdownVisible(false);
  }

  function showChangeRating() {
    setRatingChangeDropdownVisible(true);
  }

  return (
    <>
      <div
        ref={ratingElement}
        className={`${styles.wrapper} ${editable ? styles.editable : ''} ${
          styles.rating
        }`}
        onClick={() => showChangeRating()}
      >
        {ratingItems}
      </div>
      <div
        ref={chooserElement}
        className={`panel ${styles.ratingChangeDropdown} ${
          ''
          // ratingChangeDropdownVisible ? styles.visible : ''
        }`}
      >
        {[0, 1, 2, 3, 4, 5].map((rating: RecipeRating) => {
          return (
            <div
              className={`${styles.rating}`}
              key={rating}
              onClick={() => onRatingClicked(rating)}
            >
              {generateStars(rating)}
            </div>
          );
        })}
      </div>
    </>
  );
}
