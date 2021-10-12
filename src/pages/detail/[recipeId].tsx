import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../../styles/detail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Recipe } from '../../../objects/recipe';
import { getApiUrl } from '../../../utils/config';
import { useRouter } from 'next/dist/client/router';
import { Rating } from '../../../components/rating/Rating';

export interface ReceptarDetailProps {}

export default function ReceptarDetail({}: ReceptarDetailProps) {
  const [recipe, setRecipe] = useState<Recipe>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { recipeId } = router.query;

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

  return (
    <>
      {loading ? 'loading' : 'not loading'}
      {!loading && recipe && (
        <>
          <div className={styles.recipeName}>
            <h1>{recipe.name}</h1>
            <Rating rating={recipe.rating}></Rating>
          </div>

          <div></div>
        </>
      )}
    </>
  );
}
