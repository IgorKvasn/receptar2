import axios, { AxiosResponse } from 'axios';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { getApiUrl, primaryColor } from '../../utils/config';
import Select, { MultiValue, StylesConfig } from 'react-select';
import chroma from 'chroma-js';
import styles from '../../styles/search-ingredients.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rating } from '../../components/rating/Rating';
import { formatDate } from '../../utils/date-utils';
import { Recipe } from '../../objects/recipe';
import { useRouter } from 'next/dist/client/router';

export interface SearchIngredientsProps {}

export interface SearchIngredientsResult {
  recipe: Recipe;
  found: string[];
}

export type IngredientType = { value: string; label: string };

export const selectColourStyles: StylesConfig = {
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? 'green'
        : isFocused
        ? chroma(primaryColor).brighten(3).hex()
        : undefined,
      color: isDisabled ? '#ccc' : 'black',
      cursor: isDisabled ? 'not-allowed' : 'default',

      ':active': {
        ...styles[':active'],
        backgroundColor: !isDisabled
          ? isSelected
            ? 'orange'
            : chroma(primaryColor).brighten(3).hex()
          : undefined
      }
    };
  }
};

export default function SearchIngredients({}: SearchIngredientsProps) {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientType[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    IngredientType[]
  >([]);
  const [searchResults, setSearchResults] = useState<SearchIngredientsResult[]>(
    []
  );
  const router = useRouter();
  const lastAllIngredients = useRef(-1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(getApiUrl(`/ingredients`))
      .then((response) => {
        setIngredients(
          Object.keys(response.data).map((i) => {
            return { value: i, label: `${i} (${response.data[i]})` };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function onIngredientChanged(
    selectedOption: IngredientType | MultiValue<IngredientType>
  ) {
    setSelectedIngredients(selectedOption as IngredientType[]);
  }

  function onSearch() {
    if (selectedIngredients.length === 0) {
      return;
    }
    let queryParams = selectedIngredients
      .map((i) => `ingredients[]=${i.value}`)
      .join('&');

    axios
      .get(getApiUrl(`/recipes?${queryParams}`))
      .then((response: AxiosResponse<SearchIngredientsResult[]>) => {
        let lastAllIngredientsTemp = -1;

        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].found.length === selectedIngredients.length) {
            lastAllIngredientsTemp = i;
          }
        }
        lastAllIngredients.current = lastAllIngredientsTemp;
        setSearchResults(response.data);
      });
  }

  function navigateToRecipe(recipe: Recipe) {
    router.push(`/detail/${recipe.id}`);
  }

  return (
    <>
      {loading && <div>loading</div>}
      {!loading && (
        <>
          <div className={styles.searchBoxWrapper}>
            <Select
              defaultValue={selectedIngredients}
              placeholder='Vyberte suroviny'
              isMulti
              isClearable
              isSearchable
              options={ingredients}
              className={styles.searchBox}
              classNamePrefix='select'
              onChange={(selectedOption) => onIngredientChanged(selectedOption)}
              styles={selectColourStyles}
            />
            <div className={styles.buttonWrapper}>
              <button className='button is-primary' onClick={() => onSearch()}>
                <span className='icon'>
                  <FontAwesomeIcon icon={['fas', 'search']} />
                </span>
                <span>Hľadaj</span>
              </button>
            </div>
          </div>

          <div className={`${styles.searchResultWrapper}`}>
            <table
              className={`${styles.recipesTable} table is-striped is-fullwidth is-hoverable`}
            >
              <thead>
                <tr>
                  <th></th>
                  <th>Názov</th>
                  <th>Nájdené ingrediencie</th>
                  <th>Rating</th>
                  <th>Dátum vytvorenia</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => {
                  return (
                    <tr
                      key={result.recipe.id}
                      className={
                        lastAllIngredients.current === index
                          ? styles.lastAllIngredientsRow
                          : ''
                      }
                      onClick={() => navigateToRecipe(result.recipe)}
                    >
                      <td>
                        <FontAwesomeIcon icon={['fas', 'edit']} />
                      </td>
                      <td>{result.recipe.name}</td>
                      <td>{result.found.join(', ')}</td>
                      <td>
                        <Rating rating={result.recipe.rating} />
                      </td>
                      <td>{formatDate(result.recipe.createDate)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
