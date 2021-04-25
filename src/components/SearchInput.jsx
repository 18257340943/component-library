import React, { useCallback, useEffect, useState, useMemo, useContext } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import appState from '@/utils/appState';
import useDebounce from '@/utils/useDebounce';

const { Option } = Select;

export default function SearchInput({
  value: controlVal,
  labelInValue,                 // 用于初始化时请求字段
  defaultPage,                  // 默认分页传参
  dataIndex,                    // list数据源对应字段映射
  queryField,                   // onChange时请求参数
  initQueryField,               // 首次渲染的请求参数
  onChange,
  url,
  schema,
  // isInit,
  // isCheck  Header,
  style,
  loading,            // 部分搜索下拉框value值更新依赖于其他业务接口的loading状态
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
    console.log(dataSource, 'dataSource');
    setData(dataSource);
  }, 1500, []);


  useEffect(() => {
    // console.log('useEffect')
    if (!loading) {
      handleSearch(labelInValue ? controlVal.value : controlVal, initQueryField);
    }
  }, [loading]);

  const options = useMemo(() => data && data.map(d => <Option value={d[schema.value]} key={d[schema.key]}>{d[schema.label]}</Option>), [data]);

  const onSearch = useCallback((value) => {
    if (value) {
      handleSearch(value, queryField);
    }
  }, []);

  return (<Select
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
  value: PropTypes.any,
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
  isCheckHeader: PropTypes.bool,
  style: PropTypes.object
}

SearchInput.defaultProps = {
  value: undefined,
  onChange: () => { },
  labelInValue: false,
  defaultPage: {
    pageNum: 1,
    pageSize: 10
  },
  dataIndex: ['records'],
  queryField: "name",
  initQueryField: "name",
  schema: {
    value: 'id',
    key: 'id',
    label: 'name'
  },
  loading: false,
  style: {
    width: 200
  },
  // isCheckHeader: false
}

