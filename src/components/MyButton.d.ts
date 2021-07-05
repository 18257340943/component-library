import { ButtonProps } from "antd";
import React from "react";


interface MyButtonProps extends ButtonProps {
  title: string,
  type: string,
  onClick: () => {},
  children: React.ReactChildren
}


declare const MyButton: React.FC<MyButtonProps>;

export default MyButton;

