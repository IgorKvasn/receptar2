import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';

export interface HeaderProps {
}

export function Header({}: HeaderProps) {
  return (
      <nav
          className={`navbar ${styles.headerAppName}`}
          role='navigation'
          aria-label='main navigation'
      >
        <div className='navbar-brand'>
          <Link href="/">
            <a className='navbar-item'>
              <h1>
          <span className={styles.icon}>
            <FontAwesomeIcon icon={['fas', 'carrot']}/>
          </span>
                Receptár
              </h1>
            </a>
          </Link>
        </div>

        <div className="navbar-menu">
          <div className="navbar-start">

            <Link href="/">
              <a className='navbar-item'>Recepty</a>
            </Link>

            <Link href='/search-ingredients'>
              <a className='navbar-item'>Vyhľadať podľa ingrediencii</a>
            </Link>
          </div>
        </div>
      </nav>
  );
}
