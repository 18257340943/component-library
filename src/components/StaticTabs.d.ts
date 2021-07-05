import React from "react";
import { ComValue } from './index';

interface StaticTabsProps extends ComValue {
  list: unknown
}

declare const StaticTabs: React.FC<StaticTabsProps>;

export default StaticTabs;

