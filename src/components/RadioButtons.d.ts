import React from "react";
import { ComValue } from './index';

interface RadioButtonsProps extends ComValue {
  list: object
}


declare const RadioButtons: React.FC<RadioButtonsProps>;

export default RadioButtons;

