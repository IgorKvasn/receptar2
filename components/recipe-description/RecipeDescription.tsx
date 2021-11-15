import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styles from './RecipeDescription.module.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

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
    EditorState.createWithContent(ContentState.createFromText(value))
  );

  function confirmEditing() {
    onConfirm(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    setEditing(false);
  }

  function cancelEditing() {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(value))
    );
    setEditing(false);
  }

  function onEditorStateChange(editorState) {
    setEditorState(editorState);
  }

  return (
    <div className={`${styles.description} box`}>
      {!editable && value}
      <div className={styles.textDescription}>
        {editing && (
          <Editor
            editorState={editorState}
            onEditorStateChange={(s) => onEditorStateChange(s)}
            toolbar={{
              options: [
                'inline',
                'list',
                'textAlign',
                'link',
                'image',
                'history'
              ],
              inline: {
                inDropdown: false,
                options: [
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  'superscript',
                  'subscript'
                ]
              },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true }
            }}
          />
        )}
        {!editing && (
          <div
            dangerouslySetInnerHTML={{
              __html: value
            }}
          />
        )}
      </div>
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
