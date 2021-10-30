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
import { RecipeHeader } from '../../../components/recipe/header';
import { AddIngredientDialog } from '../../../components/addIngredientDialog/AddIngredientDialog';
import { Ingredient } from '../../../objects/ingredient';
import { RecipeDescription } from '../../../components/recipe-description/RecipeDescription';

export const NEW_RECIPE_PAGE = 'new';

export interface ReceptarDetailProps {}

export default function ReceptarDetail({}: ReceptarDetailProps) {
  const { recipe } = useAppSelector((state) => state.recipeDetail);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const router = useRouter();
  const { recipeId } = router.query;
  const [recipeModel, setRecipeModel] = useState<Recipe>();

  const mutateRecipe = useAfterReduxMutate(() => {
    axios.put(getApiUrl(`/recipes/${recipeId}`), recipe).then((response) => {});
    setRecipeModel(recipe);
  }, [recipe]);

  useEffect(() => {
    if (recipeId === null || typeof recipeId === 'undefined') {
      return;
    }

    if (isNewRecipe()) {
      setRecipeModel(new Recipe());
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

  function isNewRecipe() {
    return recipeId === NEW_RECIPE_PAGE;
  }

  function ingredientClicked(recipe: Recipe, ingrIndex: number) {
    mutateRecipe(toggleIngredient(ingrIndex));
  }

  function clearAllIngredients() {
    mutateRecipe(clearIngredients());
  }

  function onRatingSelected(rating: RecipeRating) {
    mutateRecipe(setRecipeRating(rating));
  }

  function openAddIngredient(ing: Ingredient) {
    setEditingIngredient(ing);
  }

  function addIngredient(newIngr: Ingredient) {
    alert('adding new ingredient...' + JSON.stringify(newIngr));
    setEditingIngredient(null);
  }

  useEffect(() => {
    if (!!editingIngredient) {
      document.querySelector('html').classList.add('is-clipped');
    } else {
      document.querySelector('html').classList.remove('is-clipped');
    }
  }, [editingIngredient]);

  return (
    <>
      {!isNewRecipe() && loading ? 'loading' : 'not loading'}

      {recipeModel && (
        <div className={styles.recipeDetailWrapper}>
          <div className={styles.recipeName}>
            <RecipeHeader
              value={recipeModel.name}
              editable={isNewRecipe()}
              onConfirm={(value) => alert('saving header: ' + value)}
            ></RecipeHeader>
            {!isNewRecipe() && (
              <Rating
                rating={recipeModel.rating}
                editable={true}
                onRatingSelected={(rating) => onRatingSelected(rating)}
              />
            )}
          </div>

          <div className={styles.recipeDetail}>
            <div className={styles.ingredients}>
              <ul className={`fa-ul`}>
                {recipeModel.ingredients.map((ingr, ingrIndex) => {
                  return (
                    <li
                      className={styles.ingredientItem}
                      key={`${ingr.amount}-${ingr.unit}-${ingr.name}`}
                      onClick={() => ingredientClicked(recipeModel, ingrIndex)}
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

              {!isNewRecipe() && (
                <button
                  onClick={() => clearAllIngredients()}
                  className={`button is-primary ${styles.cleanUpButton}`}
                >
                  <span className='icon'>
                    <FontAwesomeIcon icon={['fas', 'broom']} />
                  </span>
                  <span>Vyčisti</span>
                </button>
              )}
              {isNewRecipe() && (
                <button
                  onClick={() => openAddIngredient(new Ingredient())}
                  className={`button is-primary ${styles.cleanUpButton}`}
                >
                  <span className='icon'>
                    <FontAwesomeIcon icon={['fas', 'plus']} />
                  </span>
                  <span>Pridať surovinu</span>
                </button>
              )}
            </div>

            <RecipeDescription
              value={recipeModel.description}
              editable={isNewRecipe()}
              onConfirm={(descr) => alert('saving secription: ' + descr)}
            />
          </div>

          <AddIngredientDialog
            visible={!!editingIngredient}
            onIngrCreated={addIngredient}
            onCancel={() => setEditingIngredient(null)}
            ingredient={editingIngredient}
          />
        </div>
      )}
    </>
  );
}
