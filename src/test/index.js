import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import {
  MyButton,
  FormContent,
  MyDatePicker,
  MyRangePicker,
  SearchInput,
  SearchTop,
  StaticSelect,
  ImageUpload,
  MyInputNumber
} from '../components';
import initEnv from '../utils/initEnv';


const { cookieName, baseUrl } = initEnv;
import { Input } from 'antd';

const App = () => {
  const [data, setData] = useState({});

  // 模拟预发账号token
  // if (!getCookie(cookieName)) { setCookie(cookieName, "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBVURJVF9QVVJDSEFTRSIsIlBST0pFQ1RfRklOQU5DRSIsIkFVRElUX0JVSUxEIiwiU0hPUF9VU0VSIiwiQVVESVRfUFJPRFVDVCIsIkNMSUVOVF9BRE1JTiIsIlJFTlRfQURNSU4iLCJBVURJVF9DTEFTUyIsIlBST0pFQ1RfT1JERVIiLCJQUk9KRUNUX0FETUlOIiwiQVVESVRfRklOQU5DRSIsIkFVRElUX0FSRUEiLCJBVURJVF9NRUNISU5FIiwiQVVESVRfTEVHQUwiLCJQUk9KRUNUX1JFTlQiLCJQUk9KRUNUX0FVRElUIiwiUFJPSkVDVF9XQVJFSE9VU0UiLCJBVURJVF9QUk9KRUNUIiwiUFJPSkVDVF9ERVZJQ0UiLCJTSE9QX0FETUlOIiwiUFJPSkVDVF9QRVJTT04iLCJBVURJVF9TRUNVUklUWSIsIlJFTlRfVVNFUiIsIlBST0pFQ1RfVVNFUiIsIkFVRElUX1NUT1JFWSIsIkFVRElUX1JFQ0VJVkUiXSwidXNlcm5hbWUiOiJISCIsImlzcyI6InNpdGUuaGF5b25kLmFjY291bnQiLCJzdWIiOiI3OTMiLCJhdWQiOiJISCIsImlhdCI6MTYxOTc3Nzc2NSwiZXhwIjoxNjM1MzI5NzY1fQ.vjXlVjreF-b5VtM7xO2bElZ86jm94kccEt3aiirSMGI") }

  const updateData = useCallback((key, value) => {
    data[key] = value;
    setData({ ...data });
  }, []);
  // const updateData = (key, value) => {
  //   data[key] = value;
  //   setData({ ...data });
  // }

  return (
    <div>
      <MyButton onClick={() => { }} title="标题" />
      {/* <ChangeButton /> */}
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
          info: <MyInputNumber />
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
              info: <MyDatePicker isMs={true}
                value={data.purchaseNum}
                onChange={value => updateData('purchaseNum', value)} />
            },
            {
              node: "SearchItem",
              key: "2",
              label: "流程编号",
              info: <MyRangePicker isMs={true} value={[data.startTime, data.endTime]} onChange={valArr => {
                console.log(valArr, 'valArr')
                setData(
                  {
                    startTime: valArr[0],
                    endTime: valArr[1]
                  }
                )
              }} />
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
          label: '项目列表',
          info: <SearchInput
            url="project"
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
// eslint-disable-next-line no-undef
if (module.hot) { module.hot.accept() }

ReactDOM.render(<App />, document.getElementById('root'));