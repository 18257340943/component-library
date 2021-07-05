import React from "react";
import { ComValue } from './index';

interface MyRangePickerProps extends ComValue {
  type: "timestamp" | "format",
  isMs: boolean,
  format: string,
}


declare const MyRangePicker: React.FC<MyRangePickerProps>;

export default MyRangePicker;

