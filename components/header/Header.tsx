import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Header.module.scss';

export interface HeaderProps {}

export function Header({}: HeaderProps) {
  return (
    <nav
      className={`navbar ${styles.headerAppName}`}
      role='navigation'
      aria-label='main navigation'
    >
      <div className='navbar-brand'>
        <h1>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={['fas', 'carrot']} />
          </span>
          Receptár
        </h1>
      </div>
    </nav>
  );
}
