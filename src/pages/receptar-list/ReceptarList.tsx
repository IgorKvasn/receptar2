import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ReceptarList.module.scss';
import { Recipe } from '../../../objects/recipe';
import { getApiUrl } from '../../../utils/config';

export interface ReceptarListProps {}

export default function ReceptarList({}: ReceptarListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {loading ? <div>Získavam recepty</div> : ''}
      {recipes?.length === 0 ? <div>Žiadne recepty</div> : ''}
      {recipes && (
        <table
          className={`${styles.recipesTable} table is-striped is-fullwidth`}
        >
          <thead>
            <tr>
              <th>Názov</th>
              <th>Rating</th>
              <th>Dátum vytvorenia</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => {
              return (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>{recipe.rating}</td>
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
