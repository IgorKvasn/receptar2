import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styles from './RecipeDescription.module.scss';
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

export interface RecipeDescriptionProps {
  value: string;
  editable: boolean;
  onConfirm: (newDescr: string) => void;
}

export function RecipeDescription({
  value,
  editable,
  onConfirm
}: RecipeDescriptionProps) {
  const [editing, setEditing] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  function confirmEditing() {
    alert('TODO confirm editing');
  }

  function cancelEditing() {
    alert('TODO cancel editing');
  }

  return (
    <div className={`${styles.description} box`}>
      {!editable && value}

      {editing && (
        <Editor editorState={editorState} onChange={setEditorState} />
      )}

      {editable && (
        <div className={styles.buttonWrapper}>
          {editing && (
            <div className={styles.editingButtons}>
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
            </div>
          )}
          {!editing && (
            <button className={'button is-primary'}>
              <span className='icon is-small' onClick={() => setEditing(true)}>
                <FontAwesomeIcon icon={['fas', 'pen']} />
              </span>
            </button>
          )}
        </div>
      )}

      {/*    {editable && !editing && (
        <button className={`button is-primary ${styles.editDescriptionButton}`}>
          <span className='icon is-small' onClick={() => setEditing(true)}>
            <FontAwesomeIcon icon={['fas', 'pen']} />
          </span>
        </button>
      )}*/}
    </div>
  );
}
