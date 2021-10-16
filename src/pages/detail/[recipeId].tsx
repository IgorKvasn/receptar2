import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../../../styles/detail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Recipe, RecipeRating } from '../../../objects/recipe';
import { getApiUrl } from '../../../utils/config';
import { useRouter } from 'next/dist/client/router';
import { Rating } from '../../../components/rating/Rating';
import { useAppDispatch, useAppSelector } from '../../redux/redux-hooks';
import {
  clearIngredients,
  setRecipe,
  setRecipeRating,
  toggleIngredient
} from '../../redux/slices/recipeDetailSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { useAfterReduxMutate } from '../../../utils/hooks';

export interface ReceptarDetailProps {}

export default function ReceptarDetail({}: ReceptarDetailProps) {
  const { recipe } = useAppSelector((state) => state.recipeDetail);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { recipeId } = router.query;
  const mutateRecipe = useAfterReduxMutate(() => {
    axios.put(getApiUrl(`/recipes/${recipeId}`), recipe).then((response) => {});
  }, [recipe]);

  useEffect(() => {
    if (recipeId === null || typeof recipeId === 'undefined') {
      return;
    }

    setLoading(true);
    axios
      .get(getApiUrl(`/recipes/${recipeId}`))
      .then((response) => {
        dispatch(setRecipe(response.data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [recipeId]);

  function ingredientClicked(recipe: Recipe, ingrIndex: number) {
    mutateRecipe(toggleIngredient(ingrIndex));
  }

  function clearAllIngredients() {
    mutateRecipe(clearIngredients());
  }

  function onRatingSelected(rating: RecipeRating) {
    mutateRecipe(setRecipeRating(rating));
  }

  return (
    <>
      {loading ? 'loading' : 'not loading'}
      {!loading && recipe && (
        <>
          <div className={styles.recipeName}>
            <h1>{recipe.name}</h1>
            <Rating
              rating={recipe.rating}
              editable={true}
              onRatingSelected={(rating) => onRatingSelected(rating)}
            />
          </div>

          <div className={styles.recipeDetail}>
            <div className={styles.ingredients}>
              <ul className={`fa-ul`}>
                {recipe.ingredients.map((ingr, ingrIndex) => {
                  return (
                    <li
                      className={styles.ingredientItem}
                      key={`${ingr.amount}-${ingr.unit}-${ingr.name}`}
                      onClick={() => ingredientClicked(recipe, ingrIndex)}
                    >
                      {ingr.selected ? (
                        <FontAwesomeIcon
                          icon={['far', 'check-square']}
                          listItem
                        />
                      ) : (
                        <FontAwesomeIcon icon={['far', 'square']} listItem />
                      )}
                      <span className={styles.ingredientVolume}>
                        {ingr.amount} {ingr.unit}
                      </span>

                      <span className={styles.ingredientsName}>
                        {ingr.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={() => clearAllIngredients()}
                className={`button is-primary ${styles.cleanUpButton}`}
              >
                <span className='icon'>
                  <FontAwesomeIcon icon={['fas', 'broom']} />
                </span>
                <span>Vyčisti</span>
              </button>
            </div>
            <div className={`${styles.description} box`}>
              {recipe.description}
            </div>
          </div>
        </>
      )}
    </>
  );
}
