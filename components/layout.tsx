import React from 'react';
import { LayoutHeader } from './layout-header/layout-header';
import styles from './Layout.module.scss';

export interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.mainContainer}>
      <LayoutHeader />
      <main>{children}</main>
    </div>
  );
};
