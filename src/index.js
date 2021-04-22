import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {
  MyButton,
  FormContent,
  ChangeButton,
  MyDatePicker,
  MyRangePicker,
  SearchInput,
  SearchTop,
  StaticSelect,
  ImageUpload
} from './components';

import { Input } from 'antd';

const App = () => {
  const [data, setData] = useState({});

  const updateData = useCallback((key, value) => {
    data[key] = value;
    setData({ ...data });
  }, []);
  console.log(data, 'data111')
  // const updateData = (key, value) => {
  //   data[key] = value;
  //   setData({ ...data });
  // }

  return (
    <div>
      123
      <ChangeButton />
      <FormContent content={[
        {
          node: "Title",
          key: "Title",
          label: "标题"
        },
        {
          node: "FormItem",
          key: 'input',
          label: 'input',
          info: <Input value={data.input} onChange={e => updateData('input', e.target.value)} />
        },
        {
          node: "FormItem",
          key: "ImageUpload",
          label: "图片上传",
          info: <ImageUpload
            value={data.ImageUpload}
            onChange={value => updateData('ImageUpload', value)} />
        },
        {
          node: "SearchTop",
          key: "SearchTop",
          label: "审批流程",
          info: [
            {
              node: "SearchItem",
              key: "purchaseNum",
              label: "采购单号",
              info: <MyDatePicker
                value={data.purchaseNum}
                onChange={value => updateData('purchaseNum', value)} />
            },
            {
              node: "SearchItem",
              key: "2",
              label: "流程编号",
              info: <MyRangePicker />
            },
            {
              node: "Btn",
              key: "Btn",
              label: "查找",
            },
          ]
        },
        {
          node: 'FormItem',
          key: 'approvalInfo',
          label: '审批信息',
          info: <SearchInput
            url="saas"
            schema={{
              value: 'id',
              key: 'id',
              label: 'name'
            }}
            initQueryField="name"
            queryField="name"
          />
        },
        {
          node: 'FormItem',
          key: 'custom',
          label: 'custom',
          info: <Input />
        },
        {
          node: "FormItem",
          key: "purchaseTable",
          label: "审批流程",
          info: <StaticSelect list={[{
            label: '一',
            value: 1
          }]} />
        },
      ]} />
    </div>
  )
}

//要实现局部热更新，必须要添加此句
if (module.hot) { module.hot.accept() }

ReactDOM.render(<App />, document.getElementById('root'));