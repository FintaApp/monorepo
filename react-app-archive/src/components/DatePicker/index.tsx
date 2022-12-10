import { useColorMode } from "@chakra-ui/react";
import { default as ReactDatePicker }  from "react-datepicker";

import { HeaderComponent } from "./HeaderComponent";
import { InputComponent } from "./InputComponent";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

export interface DatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
}

export const DatePicker = ({ selected, onChange }: DatePickerProps) => {
  const { colorMode } = useColorMode();

  return (
    <ReactDatePicker 
      customInput = { <InputComponent /> }
      renderCustomHeader = {(headerProps: any) => HeaderComponent({ ...headerProps}) }
      popperClassName = { colorMode }
      dayClassName = { () => colorMode }
      showPopperArrow = { false }
      selected = { selected }
      onChange = { onChange }
      filterDate = {(date: Date) => date <= new Date() }
    />
  )
}
  