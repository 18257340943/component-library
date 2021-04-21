import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import {
  MyButton,
  FormContent,
  ChangeButton,
  MyDatePicker,
  MyRangePicker,
  RangePicker,
  SearchInput,
  SearchTop,
  StaticSelect,
  StaticTabs
} from './components';
import { Input } from 'antd'
console.log(ChangeButton, 'ChangeButton')

const content = [
  {
    node: 'Title',
    key: 'approvalInfo',
    label: '审批信息',
    info: "审批"
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
  {
    node: "SearchTop",
    key: "SearchTop",
    label: "审批流程",
  }
];



const App = () => {
  return (
    <div>
      <ChangeButton />
      <FormContent content={content} />
    </div>
  )
}

//要实现局部热更新，必须要添加此句
if (module.hot) { module.hot.accept() }

ReactDOM.render(<App />, document.getElementById('root'));