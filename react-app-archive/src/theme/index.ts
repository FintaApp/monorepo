import { extendTheme, theme as baseTheme } from "@chakra-ui/react";

import { colors } from "./colors";
import * as customComponents from "./components";
import { config } from "./config";
import { shadows } from "./shadows";
import { styles } from "./styles";

export const theme = extendTheme({ colors, components: { ...baseTheme.components, ...customComponents }, config, styles, shadows });

