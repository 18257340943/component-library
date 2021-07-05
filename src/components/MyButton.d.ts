import { ButtonProps } from "antd";
import { ReactNode, Component } from 'react';



interface MyButtonProps extends ButtonProps {
  title: string,
  type: string,
  onClick: () => {},
  children: ReactNode
}


declare const MyButton: Component<MyButtonProps>;

export default MyButton;

