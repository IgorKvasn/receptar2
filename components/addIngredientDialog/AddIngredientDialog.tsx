import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './AddIngredientDialog.module.scss';
import { Ingredient, IngredientUnit } from '../../objects/ingredient';
import Select from 'react-select';
import axios from 'axios';
import { getApiUrl } from '../../utils/config';
import {
  IngredientType,
  selectColourStyles
} from '../../src/pages/search-ingredients';
import CreatableSelect from 'react-select/creatable';

export interface AddIngredientDialogProps {
  visible: boolean;
  onIngrCreated: (newIngr: Ingredient) => void;
  onCancel: () => void;
  ingredient: Ingredient | null;
}

export function AddIngredientDialog({
  visible,
  onIngrCreated,
  onCancel,
  ingredient
}: AddIngredientDialogProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const amountRef = useRef<HTMLInputElement>();
  const ingr = useRef<Ingredient>(
    !!ingredient ? ingredient.copy() : new Ingredient()
  );
  const [ingrName, setIngrName] = useState<IngredientType>({
    value: ingr.current.name,
    label: ingr.current.name
  } as IngredientType);

  useEffect(() => {
    setLoading(true);
    axios
      .get(getApiUrl(`/ingredients`))
      .then((response) => {
        setIngredients(Object.keys(response.data));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  let units = Object.values(IngredientUnit).map((u) => {
    return { value: u, label: u };
  });

  function onConfirm() {
    ingr.current!.amount = Number(amountRef.current!.value);
    onIngrCreated(ingr.current!);
  }

  return (
    <div
      className={`modal ${visible ? 'is-active' : ''} ${styles.addIngrDialog}`}
    >
      <div className='modal-background'></div>
      <div className='modal-card'>
        <div className='modal-card-head'>
          <p className='modal-card-title'>Pridať surovinu</p>
          <button
            className='delete'
            aria-label='close'
            onClick={() => onCancel()}
          >
            X
          </button>
        </div>
        <div className='modal-card-body'>
          <div className='field'>
            <label className='label'>Názov suroviny</label>
            <div className='control'>
              <CreatableSelect
                defaultValue={ingr.current!.name}
                placeholder='Vyberte suroviny alebo pridajte novú'
                isClearable
                isSearchable
                options={ingredients}
                onChange={(selectedOption) => {
                  // @ts-ignore
                  ingr.current!.name = selectedOption.value;
                }}
                styles={selectColourStyles}
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Množstvo</label>
            <div className='control'>
              <input
                ref={amountRef}
                className='input'
                type='number'
                placeholder='Zadajte množstvo'
              />
            </div>
          </div>
          <div className='field'>
            <label className='label'>Jednotky</label>
            <div className='control'>
              <Select
                defaultValue={ingr.current!.unit}
                placeholder='Vyberte jednotky'
                isClearable
                isSearchable
                options={units}
                classNamePrefix='select'
                onChange={(selectedOption: {
                  value: string;
                  label: string;
                }) => {
                  ingr.current!.unit = selectedOption.value as IngredientUnit;
                }}
                styles={selectColourStyles}
              />
            </div>
          </div>
        </div>
        <div className='modal-card-foot'>
          <button className='button is-success' onClick={() => onConfirm()}>
            Pridať
          </button>
          <button className='button' onClick={() => onCancel()}>
            Zrušiť
          </button>
        </div>
      </div>
    </div>
  );
}
