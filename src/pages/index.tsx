import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/index.module.scss';
import { Recipe } from '../../objects/recipe';
import { getApiUrl } from '../../utils/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/dist/client/router';
import { Rating } from '../../components/rating/Rating';

interface ReceptarListProps {}

export default function ReceptarList({}: ReceptarListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    axios
      .get(getApiUrl('/recipes'))
      .then((response) => {
        setRecipes(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function navigateToRecipe(recipe: Recipe) {
    router.push(`/detail/${recipe.id}`);
  }

  return (
    <>
      {loading ? <div>Získavam recepty</div> : ''}
      {recipes?.length === 0 ? <div>Žiadne recepty</div> : ''}
      {recipes && (
        <table
          className={`${styles.recipesTable} table is-striped is-fullwidth is-hoverable`}
        >
          <thead>
            <tr>
              <th></th>
              <th>Názov</th>
              <th>Rating</th>
              <th>Dátum vytvorenia</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => {
              return (
                <tr key={recipe.id} onClick={() => navigateToRecipe(recipe)}>
                  <td>
                    <FontAwesomeIcon icon={['fas', 'edit']} />
                  </td>
                  <td>{recipe.name}</td>
                  <td>
                    <Rating rating={recipe.rating} />
                  </td>
                  <td>{recipe.createDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
