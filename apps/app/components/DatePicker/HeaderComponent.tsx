import {
  Box,
  HStack,
  IconButton,
  Text
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import moment from "moment-timezone";

export interface HeaderComponentProps {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  decreaseYear: () => void;
  increaseYear: () => void;
  showMonthYearPicker: boolean;
  prevYearButtonDisabled: boolean;
  prevMonthButtonDisabled: boolean;
  nextYearButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

export const HeaderComponent = ({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear, showMonthYearPicker, prevYearButtonDisabled, prevMonthButtonDisabled, nextYearButtonDisabled, nextMonthButtonDisabled }: HeaderComponentProps) => (
  <Box>
    <HStack justifyContent = "space-between" px = "2">
      <IconButton
        rounded = "full" 
        variant = "outline"
        colorScheme = "primary" 
        aria-label = { showMonthYearPicker ? "Previous Year" : "Previous Month" }
        isDisabled = { showMonthYearPicker ? prevYearButtonDisabled : prevMonthButtonDisabled }
        onClick = { showMonthYearPicker ? decreaseYear : decreaseMonth }
        size = "sm"
        icon = { <ArrowBackIcon /> }
      />
      <Text color = "inherit" fontSize = "sm" fontWeight = "medium">{ moment(date).format(showMonthYearPicker ? "YYYY" : "MMM YYYY") }</Text>
      <IconButton
        rounded = "full" 
        variant = "outline"
        colorScheme = "primary" 
        aria-label = { showMonthYearPicker ? "Next Year" : "Next Month" }
        isDisabled = { showMonthYearPicker ? nextYearButtonDisabled : nextMonthButtonDisabled }
        onClick = { showMonthYearPicker ? increaseYear : increaseMonth }
        size = "sm"
        icon = { <ArrowForwardIcon /> }
      />
    </HStack>
  </Box>
);