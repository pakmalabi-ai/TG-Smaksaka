// Fix: Import React to resolve 'Cannot find namespace React' error
import React from 'react';

export interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
}

export interface PageProps {
  title?: string;
}