import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styles from './recipe-header.module.scss';

const DEFAULT_VALUE = 'Názov receptu';

export interface RecipeHeaderProps {
  value: string;
  editable: boolean;
  onConfirm: (value: string) => void;
}

export function RecipeHeader({
  value,
  editable,
  onConfirm
}: RecipeHeaderProps) {
  const [editing, setEditing] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>();

  function confirmEditing() {
    onConfirm(titleRef.current!.innerHTML);
    setEditing(false);
  }

  function cancelEditing() {
    titleRef.current!.innerHTML = value ?? DEFAULT_VALUE;
    setEditing(false);
  }

  function startEditing() {
    if (isEmptyValue()) {
      titleRef.current!.innerHTML = '';
    }
    setEditing(true);
    setTimeout(() => {
      titleRef.current.focus();
    });
  }

  function isEmptyValue() {
    return value === null || typeof value === 'undefined' || value.length === 0;
  }

  return (
    <>
      <h1
        className={`title  ${styles.recipeTitle}`}
        ref={titleRef}
        contentEditable={editable && editing}
        suppressContentEditableWarning={true}
      >
        {isEmptyValue() ? DEFAULT_VALUE : value}
      </h1>
      {editable && (
        <div className={styles.buttonWrapper}>
          {editing && (
            <>
              <button className={'button is-primary'}>
                <span
                  className='icon is-small'
                  onClick={() => confirmEditing()}
                >
                  <FontAwesomeIcon icon={['fas', 'check']} />
                </span>
              </button>
              <button className={'button is-danger'}>
                <span className='icon is-small' onClick={() => cancelEditing()}>
                  <FontAwesomeIcon icon={['fas', 'times']} />
                </span>
              </button>
            </>
          )}
          {!editing && (
            <button className={'button is-primary'}>
              <span className='icon is-small' onClick={() => startEditing()}>
                <FontAwesomeIcon icon={['fas', 'pen']} />
              </span>
            </button>
          )}
        </div>
      )}
    </>
  );
}
