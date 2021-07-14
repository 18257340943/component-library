import React, { useMemo } from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import appState from '../utils/appState'


const leaveFileList = (fileList, single, status) => {
  // 单图片模式
  if (single) {
    if (fileList.length === 0) {
      return ''
    } else {
      return fileList[0].url
    }
  } else {
    return fileList.map(file => file.url);
  }

};

const changeLeaveFileList = (fileList, single, status) => {
  // 更新模式
  if (status === "uploading") {
    return fileList.map(file => file);
  } else {
    // 删除模式
    if (single) {
      return ''
    } else {
      return fileList.map(file => file.url)
    }
  }
}

const toFileList = (value) => {
  let fileList = [];
  if (typeof value === 'string') {
    if (value) {
      fileList.push({
        uid: value,
        url: value
      })
    } else {

    }
  } else if (Array.isArray(value)) {

    if (typeof value[0] === 'string') {
      fileList = value.map(v => ({
        uid: v,
        url: v
      }));
    } else {
      fileList = value.map(v => ({
        ...v
      }))
    }
  } else {

  }

  return fileList
}

const ImageUpload = function ImageUpload({ value, onChange, uploadMax, single, style, ...extra }) {
  value = value || '';
  uploadMax = uploadMax || 1;

  const fileList = toFileList(value);

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const customRequest = async (info) => {
    const formData = new FormData();
    formData.append('file', info.file);
    const data = await appState.fetch('/upload', {
      body: formData,
    });
    let newFileList = [
      ...fileList,
      {
        uid: data.link,
        url: data.link
      }
    ];
    // eslint-disable-next-line no-prototype-builtins
    newFileList = newFileList.filter(file => !file.hasOwnProperty('status'));

    onChange(leaveFileList(newFileList, single));
  }

  const uploadButton = useMemo(() => (
    <div >
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  ), []);

  return (<div style={style} className="imageUpload"
    children={<Upload
      customRequest={customRequest}
      listType="picture-card"
      fileList={fileList}
      onChange={({ fileList: newFileList, file, event }) => {
        onChange(changeLeaveFileList(newFileList, single, file.status))
      }}
      onPreview={onPreview}
      {...extra}
    >
      {fileList.length >= uploadMax ? null : uploadButton}
    </Upload>} />)

};
ImageUpload.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  uploadMax: PropTypes.number,
  single: PropTypes.bool,
  style: PropTypes.object,
};
ImageUpload.defaultProps = {
  value: '',
  uploadMax: 1,
  onChange: () => { },
  single: true,
  style: {
    minHeight: 112
  }
};

export default ImageUpload