import React from "react";
import { ComValue } from './index';

interface SearchInputProps extends ComValue {
  initList: unknown,
  labelInValue: boolean,
  isInit: boolean,
  defaultPage: unknown,
  queryField: string,
  initQueryField: string,
  paramType: 'search' | 'body',
  headers: unknown,
  dataIndex: unknown,
  url: string,
  schema: unknown,
  // loading: boolean
}


declare const SearchInput: React.FC<SearchInputProps>;

export default SearchInput;

