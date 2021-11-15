import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/index.module.scss';
import { getApiUrl } from '../../utils/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/dist/client/router';
import { Rating } from '../../components/rating/Rating';
import { useAppDispatch, useAppSelector } from '../redux/redux-hooks';
import { addAllRecipes, reorderRecipes } from '../redux/slices/recipesSlice';
import { formatDate } from '../../utils/date-utils';
import { NEW_RECIPE_PAGE } from './detail/[recipeId]';
import { Recipe } from '@prisma/client';

interface ReceptarListProps {}

export interface SortInfo {
  column: string | null;
  order: 'ASC' | 'DESC' | null;
}

export default function ReceptarList({}: ReceptarListProps) {
  // const [recipes, setRecipes] = useState<Recipe[]>(null);
  const { recipes } = useAppSelector((state) => state.recipes);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [sortInfo, setSortInfo] = useState<SortInfo>({
    column: null,
    order: null
  });
  const router = useRouter();
  const searchInputElement = useRef<HTMLInputElement>();

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        getApiUrl(
          `/recipes?${
            sortInfo !== null
              ? `sortColumn=${sortInfo.column}&sortOrder=${sortInfo.order}`
              : ''
          }`
        )
      )
      .then((response) => {
        dispatch(addAllRecipes(response.data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sortInfo]);

  function navigateToRecipe(recipe: Recipe) {
    router.push(`/detail/${recipe.id}`);
  }

  function sortColumn(column: keyof Recipe) {
    if (sortInfo.column === column) {
      let newOrder;
      if (sortInfo.order === 'ASC') {
        newOrder = 'DESC';
      } else if (sortInfo.order === 'DESC') {
        newOrder = null;
      } else if (sortInfo.order === null) {
        newOrder = 'ASC';
      }
      setSortInfo({
        column,
        order: newOrder
      });
    } else {
      setSortInfo({
        column,
        order: 'ASC'
      });
    }
  }

  function getSortIcon(column: keyof Recipe): JSX.Element {
    if (sortInfo.column !== column || sortInfo.order === null) {
      return <FontAwesomeIcon icon={['fas', 'sort']} />;
    }
    if (sortInfo.order === 'ASC') {
      return <FontAwesomeIcon icon={['fas', 'sort-up']} />;
    }
    if (sortInfo.order === 'DESC') {
      return <FontAwesomeIcon icon={['fas', 'sort-down']} />;
    }
  }

  function onSearch() {
    let query = searchInputElement.current.value;
    alert('searching ' + query);
  }

  function addRecipe() {
    router.push(`/detail/${NEW_RECIPE_PAGE}`);
  }

  return (
    <>
      {loading ? <div>Získavam recepty</div> : ''}
      {recipes && (
        <>
          <div className={styles.filterWrapper}>
            <div className={styles.searchWrapper}>
              <input
                ref={searchInputElement}
                className='input'
                placeholder={'Hľadaj názov'}
              />
            </div>
            <div className={styles.buttonWrapper}>
              <button className='button is-primary' onClick={() => onSearch()}>
                <span className='icon'>
                  <FontAwesomeIcon icon={['fas', 'search']} />
                </span>
                <span>Hľadaj</span>
              </button>
              <button
                className='button is-primary is-light'
                onClick={() => addRecipe()}
              >
                <span className='icon'>
                  <FontAwesomeIcon icon={['fas', 'plus']} />
                </span>
                <span>Nový recept</span>
              </button>
            </div>
          </div>

          <table
            className={`${styles.recipesTable} table is-striped is-fullwidth is-hoverable`}
          >
            <thead>
              <tr>
                <th></th>
                <th
                  className={styles.sortableColumn}
                  onClick={() => sortColumn('name')}
                >
                  <span>Názov</span>
                  <span className={`icon ${styles.sortIcon}`}>
                    {getSortIcon('name')}
                  </span>
                </th>
                <th
                  className={styles.sortableColumn}
                  onClick={() => sortColumn('rating')}
                >
                  <span>Rating</span>
                  <span className={`icon ${styles.sortIcon}`}>
                    {getSortIcon('rating')}
                  </span>
                </th>
                <th
                  className={styles.sortableColumn}
                  onClick={() => sortColumn('createDate')}
                >
                  <span>Dátum vytvorenia</span>
                  <span className={`icon ${styles.sortIcon}`}>
                    {getSortIcon('createDate')}
                  </span>
                </th>
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
                    <td>{formatDate(recipe.createDate)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      {recipes?.length === 0 ? (
        <div className={styles.noRecipesNote}>
          <i>Žiadne recepty</i>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
