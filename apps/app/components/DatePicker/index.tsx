import { useColorMode } from "@chakra-ui/react";
import { default as ReactDatePicker }  from "react-datepicker";

import { HeaderComponent } from "./HeaderComponent";
import { InputComponent } from "./InputComponent";
import "react-datepicker/dist/react-datepicker.css";

export interface DatePickerProps {
  selected: Date;
  onChange: (date: Date) => void;
  isDisabled?: boolean;
}

export const DatePicker = ({ selected, onChange, isDisabled = false }: DatePickerProps) => {
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
      disabled = { isDisabled }
    />
  )
}
  