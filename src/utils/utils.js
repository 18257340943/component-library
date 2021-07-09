import { message } from "antd";

// 删除 obj 对象里面 value 为 undefined，null，''
export const removeEmptyField = (obj) => {
  let newObj = {};
  if (typeof obj === "string") {
    obj = JSON.parse(obj);
  }
  if (obj instanceof Array) {
    newObj = [];
  }
  if (obj instanceof Object) {
    // eslint-disable-next-line no-restricted-syntax
    for (const attr in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, attr) &&
        obj[attr] !== "" &&
        obj[attr] !== null &&
        obj[attr] !== undefined
      ) {
        if (obj[attr] instanceof Object) {
          newObj[attr] = removeEmptyField(obj[attr]);
        } else if (
          typeof obj[attr] === "string" &&
          ((obj[attr].indexOf("{") > -1 && obj[attr].indexOf("}") > -1) ||
            (obj[attr].indexOf("[") > -1 && obj[attr].indexOf("]") > -1))
        ) {
          try {
            const attrObj = JSON.parse(obj[attr]);
            if (attrObj instanceof Object) {
              newObj[attr] = removeEmptyField(attrObj);
            }
          } catch (e) {
            newObj[attr] = obj[attr];
          }
        } else {
          newObj[attr] = obj[attr];
        }
      }
    }
  }
  return newObj;
};
// 过滤key有关的键值
export const filterKeys = (targetObj = {}, keys = []) => {
  Object.keys(targetObj).forEach((key) => {
    if (keys.indexOf(key) > -1) {
      delete targetObj[key];
    }
  });
  return targetObj;
};
// 导入keys有关的键值
export const leadInKeys = (targetObj = {}, keys = []) => {
  const newObj = {};
  Object.keys(targetObj).forEach((key) => {
    if (keys.indexOf(key) > -1) {
      newObj[key] = targetObj[key];
    }
  });
  return newObj;
};
// 正则校验对象中的key
export const requireKeysFn = (targetObj = {}, requireKeys = []) =>
  requireKeys.every((curKey) => {
    const curMsg = curKey.message;
    // eslint-disable-next-line no-empty
    if (targetObj[curKey.requireKeyName]) {
    } else {
      message.error(curMsg);
    }
    return Boolean(targetObj[curKey.requireKeyName]);
  });
// 表格表格根据columns宽度自动生成滚动条
export const calcScrollX = (columns) => {
  let scrollX = 0;
  columns.forEach((col) => {
    const colWid = col.width || 0;
    scrollX += colWid;
  });
  return scrollX;
};

// 查找源对象 目标对象 对象识别符
export function myFindIndex(objArr = [], targetObj = {}, type) {
  const arrIndex = objArr.findIndex(
    (item) =>
      // 这里的判断条件按你需求来写
      item[type] === targetObj[type],
  );
  return arrIndex;
}

// 将search对象编译成 url
export function search(searchObj) {
  return Object.keys(searchObj).length > 0 ? `?${Object.keys(searchObj)
    .map((key) => `${key}=${searchObj[key]}`)
    .join("&")}` : '';
}
