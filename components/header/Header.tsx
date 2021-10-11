import React from 'react';
import styles from './Header.module.scss';

export interface HeaderProps {}

export function Header({}: HeaderProps) {
  return <h1 className={styles.header}>Receptár</h1>;
}
