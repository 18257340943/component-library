import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';

import { appState, customHooks } from './index';

const { Option } = Select;
const { useDebounce, useLoading } = customHooks;

export default function SearchInput({
  value: controlVal,
  onChange,
  initList,         // 初始化数据配置

  style,
  // loading,          // 部分搜索下拉框value值更新依赖于其他业务接口的loading状态
  isInit,           // 是否初始化请求数据
  url,              // 根目录
  headers,          // 默认头部 
  paramType,        // 请求类型
  defaultPage,      // 默认分页参数
  // 部分业务存在首次请求字段和 onChange 时不一致
  queryField,       // onChange时请求参数
  initQueryField,   // 首次渲染的请求参数

  dataIndex,        // list数据源对应字段映射 类似 antd.Table 使用
  schema,           // 数据映射字段配置

  labelInValue,     // 用于初始化时请求字段, 尽量不推荐使用
  ...extra
}) {
  const [data, setData] = useState(initList);

  const getData = (value) => appState.fetch(`/${url}`, {
    method: "GET",
    headers,
    [paramType]: {
      ...defaultPage,
      [queryField]: value
    }
  });

  const [loading, wrapReq] = useLoading(getData);

  console.log(loading, 'loading');

  const handleSearch = useDebounce(async (value) => {
    let dataSource;

    const data = await wrapReq(value);
    dataSource = dataIndex.length > 0 ? data[dataIndex[0]] : data;
    setData(dataSource);
  }, 1500, []);

  useEffect(() => {
    if (isInit) {
      handleSearch(labelInValue ? controlVal && controlVal.value || controlVal : controlVal, initQueryField);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = useMemo(() => data && data.map(d => <Option value={d[schema.value]} key={d[schema.key]}>{d[schema.label]}</Option>), [data]);

  const onSearch = useCallback((value) => {
    if (value) {
      handleSearch(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (<Select
    filterOption={false}        // 关闭组件自动筛选功能
    loading={loading}
    showSearch
    labelInValue={labelInValue}
    value={controlVal}
    style={style}
    onSearch={onSearch}
    onChange={onChange}
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
  style: {
    width: 200
  }
}

