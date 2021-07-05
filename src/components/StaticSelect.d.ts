import React from "react";
import { ComValue } from './index';

interface StaticSelectProps extends ComValue {
  list: unknown,
  schema: unknown,
  placeholder: string,
}


declare const StaticSelect: React.FC<StaticSelectProps>;

export default StaticSelect;

