import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../../../styles/detail.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Recipe, RecipeRating} from '../../../objects/recipe';
import {getApiUrl} from '../../../utils/config';
import {useRouter} from 'next/dist/client/router';
import {Rating} from '../../../components/rating/Rating';

export interface ReceptarDetailProps {
}

export default function ReceptarDetail({}: ReceptarDetailProps) {
    const [recipe, setRecipe] = useState<Recipe>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const {recipeId} = router.query;

    useEffect(() => {
        if (recipeId === null || typeof recipeId === 'undefined') {
            return;
        }

        setLoading(true);
        axios
            .get(getApiUrl(`/recipes/${recipeId}`))
            .then((response) => {
                setRecipe(response.data);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [recipeId]);

    function ingredientClicked(recipe: Recipe, ingrIndex: number) {
        let newRecipe: Recipe = JSON.parse(JSON.stringify(recipe));
        newRecipe.ingredients[ingrIndex].selected = !newRecipe.ingredients[ingrIndex].selected;
        setRecipe(newRecipe);
        axios
            .put(getApiUrl(`/recipes/${recipeId}`), newRecipe)
            .then((response) => {

            });
    }

    function clearAllIngredients(){
        let newRecipe: Recipe = JSON.parse(JSON.stringify(recipe));
        newRecipe.ingredients.forEach((ingr)=>ingr.selected = false);
        setRecipe(newRecipe);
        axios
            .put(getApiUrl(`/recipes/${recipeId}`), newRecipe)
            .then((response) => {

            });
    }

    function onRatingSelected(rating: RecipeRating) {
        let newRecipe: Recipe = JSON.parse(JSON.stringify(recipe));
        newRecipe.rating = rating;
        setRecipe(newRecipe);
        axios
            .put(getApiUrl(`/recipes/${recipeId}`), newRecipe)
            .then((response) => {

            });
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
                            onRatingSelected={(rating)=>onRatingSelected(rating)}
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
                                            {ingr.selected ?
                                                <FontAwesomeIcon icon={['far', 'check-square']} listItem/>
                                                :
                                                <FontAwesomeIcon icon={['far', 'square']} listItem/>
                                            }
                                            <span className={styles.ingredientVolume}>{ingr.amount} {ingr.unit}</span>

                                            <span className={styles.ingredientsName}>{ingr.name}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                          <button onClick={()=>clearAllIngredients()} className={`button is-primary ${styles.cleanUpButton}`}>
                              <span className='icon'><FontAwesomeIcon icon={['fas', 'broom']}/></span>
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
