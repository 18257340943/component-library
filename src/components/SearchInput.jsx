import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import appState from '@/utils/appState';
import useDebounce from '@/utils/useDebounce';

const { Option } = Select;

export default function SearchInput({
  value: controlVal,
  labelInValue,
  defaultPage,
  dataIndex,
  schema,
  queryField,                   // onChange时请求参数
  initQueryField,               // 首次渲染的请求参数
  onChange: contorolChange,
  url,
  isInit,
  isCheckHeader,
  style,
  loading,      // 部分搜索下拉框value值更新依赖于其他业务接口的loading状态
  ...extra
}) {

  const [data, setData] = useState([]);

  const handleSearch = useDebounce(async (value, queryField) => {
    let dataSource;
    // if (JSON.stringify(searchObj.search) === "{}") { delete searchObj.search };
    const data = await appState.fetch(`/${url}`, {
      method: "GET",
      search: {
        ...defaultPage,
        [queryField]: value
      }
    });
    dataSource = dataIndex.length > 0 ? data[dataIndex[0]] : data;
    setData(dataSource);
  }, 1500, []);


  useEffect(() => {
    // console.log('useEffect')
    if (!loading && controlVal) {
      handleSearch(labelInValue ? controlVal.value : controlVal, initQueryField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const options = useMemo(() => data.map(d => <Option value={d[schema.value]} key={d[schema.key]}>{d[schema.label]}</Option>), [data]);


  return (<Select
    showSearch
    labelInValue={labelInValue}
    value={controlVal}
    defaultActiveFirstOption={false}
    style={style}
    showArrow={false}
    filterOption={false}
    onSearch={value => {
      if (value) {
        handleSearch(value, queryField);
      }
    }}
    onChange={value => { contorolChange(value) }}
    notFoundContent={null}
    {...extra}
  >
    {options}
  </Select>)
}

SearchInput.propTypes = {
  value: PropTypes.any,
  defaultPage: PropTypes.shape({
    pageNum: PropTypes.number,
    pageSize: PropTypes.number
  }),
  dataIndex: PropTypes.arrayOf(PropTypes.string),
  queryField: PropTypes.string,
  initQueryField: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  schema: PropTypes.object,
  loading: PropTypes.bool,
  labelInValue: PropTypes.bool,
  // isInit: PropTypes.bool.isRequired,
  isCheckHeader: PropTypes.bool,
  style: PropTypes.object
}

SearchInput.defaultProps = {
  value: undefined,
  labelInValue: false,
  defaultPage: {
    pageNum: 1,
    pageSize: 10
  },
  dataIndex: ['record'],
  queryField: "name",
  initQueryField: "name",
  schema: {
    value: 'value',
    key: 'value',
    label: 'label'
  },
  loading: false,
  style: {
    width: 200
  },
  isCheckHeader: false
}

