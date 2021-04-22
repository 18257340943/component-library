import React from 'react';
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
} from './components';

import { Input } from 'antd';

const App = () => {
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
          node: "SearchTop",
          key: "SearchTop",
          label: "审批流程",
          info: [
            {
              node: "SearchItem",
              key: "1",
              label: "采购单号",
              info: <MyDatePicker />
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