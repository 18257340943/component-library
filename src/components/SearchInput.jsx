import React, { useCallback, useEffect, useState, useMemo, useContext } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import appState from '@/utils/appState';
import useDebounce from '@/utils/useDebounce';

const { Option } = Select;


export default function SearchInput({
  value: controlVal,
  onChange,
  initList,
  labelInValue,     // 用于初始化时请求字段

  isInit,           // 是否初始化，默认初始化
  defaultPage,      // 默认分页传参
  queryField,       // onChange时请求参数
  initQueryField,   // 首次渲染的请求参数
  paramType,        // 请求类型
  headers,          // 初始化 fetch 头部

  dataIndex,        // list数据源对应字段映射
  url,
  schema,
  style,
  loading,          // 部分搜索下拉框value值更新依赖于其他业务接口的loading状态
  ...extra
}) {
  // console.log(isInit, 'isInit');
  const [data, setData] = useState(initList);

  const handleSearch = useDebounce(async (value, queryField) => {
    let dataSource;

    const data = await appState.fetch(`/${url}`, {
      method: "GET",
      headers,
      [paramType]: {
        ...defaultPage,
        [queryField]: value
      }
    });
    dataSource = dataIndex.length > 0 ? data[dataIndex[0]] : data;
    setData(dataSource);
  }, 1500, []);


  useEffect(() => {
    if (isInit && !loading) {
      handleSearch(labelInValue ? controlVal && controlVal.value || controlVal : controlVal, initQueryField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const options = useMemo(() => data && data.map(d => <Option value={d[schema.value]} key={d[schema.key]}>{d[schema.label]}</Option>), [data]);

  const onSearch = useCallback((value) => {
    if (value) {
      handleSearch(value, queryField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<Select
    loading={loading}
    showSearch
    labelInValue={labelInValue}
    value={controlVal}
    defaultActiveFirstOption={false}
    style={style}
    showArrow={false}
    filterOption={false}
    onSearch={onSearch}
    onChange={value => { onChange(value) }}
    {...extra}
  >
    {options}
  </Select>)
}

SearchInput.propTypes = {
  isInit: PropTypes.bool,
  value: PropTypes.any,
  initList: PropTypes.array,
  defaultPage: PropTypes.shape({
    pageNum: PropTypes.number,
    pageSize: PropTypes.number
  }),
  dataIndex: PropTypes.arrayOf(PropTypes.string),
  queryField: PropTypes.string,
  initQueryField: PropTypes.string,
  onChange: PropTypes.func,
  url: PropTypes.string.isRequired,
  schema: PropTypes.object,
  loading: PropTypes.bool,
  labelInValue: PropTypes.bool,
  headers: PropTypes.object,
  style: PropTypes.object,
  paramType: PropTypes.oneOf(['search', 'body', 'inline']),
}

SearchInput.defaultProps = {
  initList: [],
  isInit: true,
  value: undefined,
  onChange: () => { },
  labelInValue: false,
  defaultPage: {
    pageNum: 1,
    pageSize: 10
  },
  headers: {},
  dataIndex: ['records'],
  queryField: "name",
  initQueryField: "name",
  schema: {
    value: 'id',
    key: 'id',
    label: 'name'
  },
  paramType: "search",
  loading: false,
  style: {
    width: 200
  },
  // isCheckHeader: false
}

