import { css, useStyleConfig, useTheme } from "@chakra-ui/react";
import { default as ReactSelect, Props, ThemeConfig, StylesConfig } from 'react-select';

export interface SelectProps extends Props {
  
}

interface selectStyleProps {
  theme: any;
  isSelected: boolean;
  isFocused: boolean;
}

const selectStyle = {
  container: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.container
  }),
  control: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.control
  }),
  indicatorsContainer: (base: any, { theme }: selectStyleProps) => ({
      ...base,
      ...theme.indicatorsContainer,
  }),
  input: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.input
  }),
  menu: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.menu
  }),
  menuList: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.menuList
  }),
  option: (base: any, { theme, isSelected, isFocused }: selectStyleProps) => ({
    ...base,
    ...theme.option,
    background: isSelected ? theme.selectedOption.background : ( isFocused ? theme.focusedOption.background : theme.option.background ),
    borderColor: isFocused ? theme.focusedOption.borderColor : theme.option.borderColor,
    color: isSelected ? theme.selectedOption.color : ( isFocused ? theme.focusedOption.color : theme.option.color ),
  }),
  placeholder: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.input,
    ...theme.placeholder
  }),
  singleValue: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.singleValue
  }),
  valueContainer: (base: any, { theme }: selectStyleProps) => ({
    ...base,
    ...theme.valueContainer
  })
};

export const Select = ({ ...selectProps }: SelectProps) => {
  const theme = useTheme()
  const styles = useStyleConfig("ReactSelect", {});
  const _theme = css(styles)(theme) as ThemeConfig;;

  return (
    <ReactSelect theme = { _theme } styles = { selectStyle as unknown as StylesConfig }  { ...selectProps } />
  )
}