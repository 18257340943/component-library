import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Input, Button } from 'antd';
import {
  MyButton,
  FormContent,
  MyDatePicker,
  MyRangePicker,
  SearchInput,
  MyInputNumber,
  SearchTop,
  StaticSelect,
  ImageUpload,
  initEnv,
  appState,
  loadingPage,
  customHooks
} from '../components';

import { getCookie, setCookie } from '../utils/cookie';


const {
  useLoadingPage,
  useLoading
} = customHooks;
const { cookieName } = initEnv;

const App = () => {
  const [data, setData] = useState({});
  const getData = () => {
    return appState.fetch('/projectSaas', {
      method: "GET",
      search: { pageNum: 1, pageSize: 10 },
      headers: {
        projectId: 2
      }
    }).then(res => {
      console.log(res, 'res')
    });
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve({ code: 200 })
    //   }, 1000);
    // })

  }
  // 模拟预发账号token
  if (!getCookie(cookieName)) { setCookie(cookieName, "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBVURJVF9QVVJDSEFTRSIsIlBST0pFQ1RfRklOQU5DRSIsIkFVRElUX0JVSUxEIiwiU0hPUF9VU0VSIiwiQVVESVRfUFJPRFVDVCIsIkNMSUVOVF9BRE1JTiIsIlJFTlRfQURNSU4iLCJBVURJVF9DTEFTUyIsIlBST0pFQ1RfT1JERVIiLCJQUk9KRUNUX0FETUlOIiwiQVVESVRfRklOQU5DRSIsIkFVRElUX0FSRUEiLCJBVURJVF9NRUNISU5FIiwiQVVESVRfTEVHQUwiLCJQUk9KRUNUX1JFTlQiLCJQUk9KRUNUX0FVRElUIiwiUFJPSkVDVF9XQVJFSE9VU0UiLCJBVURJVF9QUk9KRUNUIiwiUFJPSkVDVF9ERVZJQ0UiLCJTSE9QX0FETUlOIiwiUFJPSkVDVF9QRVJTT04iLCJBVURJVF9TRUNVUklUWSIsIlJFTlRfVVNFUiIsIlBST0pFQ1RfVVNFUiIsIkFVRElUX1NUT1JFWSIsIkFVRElUX1JFQ0VJVkUiXSwidXNlcm5hbWUiOiJISCIsImlzcyI6InNpdGUuaGF5b25kLmFjY291bnQiLCJzdWIiOiI3OTMiLCJhdWQiOiJISCIsImlhdCI6MTYxOTc3Nzc2NSwiZXhwIjoxNjM1MzI5NzY1fQ.vjXlVjreF-b5VtM7xO2bElZ86jm94kccEt3aiirSMGI") }
  const { wrapReq } = useLoading(getData);
  // const result = useLoadingPage(getData);
  // console.log(result, 'result');
  // console.log(loading, 'loading')
  useEffect(() => {
    // wrapReq();
  }, []);

  const updateData = useCallback((key, value) => {
    data[key] = value;
    setData({ ...data });
  }, []);


  return (
    <div>
      <Button onClick={loadingPage.start}>开始加载</Button>
      <Button onClick={loadingPage.end} style={{ zIndex: 2 }}>加载结束</Button>
      <Button children="测试useLoading" onClick={wrapReq} />
      {/* <LoadingPage display={loading ? 'block' : 'none'} /> */}
      <MyButton title={"1231"} />
      <MyInputNumber value={123} onChange={() => { }} />
      {/* <ChangeButton /> */}
      <FormContent
        content={[
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
                  // console.log(valArr, 'valArr')
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
              url="projectSaas"
              schema={{
                value: 'id',
                key: 'id',
                label: 'name'
              }}
              initQueryField="queryField"
              queryField="queryField"
              value={data.projectId}
              onChange={(value) => { setData({ ...data, projectId: value }) }}
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