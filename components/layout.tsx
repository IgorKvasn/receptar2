import React from 'react';
import { Header } from './header/header';
import styles from './Layout.module.scss';

export interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.mainContainer}>
      <Header />
      <main>{children}</main>
    </div>
  );
};
