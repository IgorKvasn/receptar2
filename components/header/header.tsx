import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../src/redux/redux-hooks';
import { logoutUser } from '../../src/redux/slices/userSlice';
import { useRouter } from 'next/router';

export interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { loggedUser } = useAppSelector((state) => state.loggedUser);

  return (
    <nav
      className={`navbar ${styles.headerAppName}`}
      role='navigation'
      aria-label='main navigation'
    >
      <div className='navbar-brand'>
        <Link href='/'>
          <a className='navbar-item'>
            <h1>
              <span className={styles.icon}>
                <FontAwesomeIcon icon={['fas', 'carrot']} />
              </span>
              Receptár
            </h1>
          </a>
        </Link>
      </div>

      <div className='navbar-menu'>
        <div className='navbar-start'>
          <Link href='/'>
            <a className='navbar-item'>Recepty</a>
          </Link>

          <Link href='/search-ingredients'>
            <a className='navbar-item'>Vyhľadať podľa surovín</a>
          </Link>

          <LogoutUser loggedUser={loggedUser} />
        </div>
      </div>
    </nav>
  );
}

function LogoutUser({ loggedUser }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function onLogout(e) {
    e.preventDefault();
    dispatch(logoutUser());
    router.push('/login');
  }

  return (
    <>
      {loggedUser && (
        <a
          className={`navbar-item ${styles.logoutLink}`}
          onClick={(e) => onLogout(e)}
        >
          <FontAwesomeIcon icon={['fas', 'sign-out-alt']} />
          Odhlásiť{' '}
          <span className={styles.loggedUsername}>{loggedUser.username}</span>
        </a>
      )}
    </>
  );
}
