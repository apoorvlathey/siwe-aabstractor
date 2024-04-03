import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const colors = {
  brand: {
    greenLight: "#19cb01",
    greenDark: "#16b201",
    greenDarker: "#129801",
    yellow: "#EDF676",
    pale: "#f0f0f0",
    black: "#121212",
  },
};

const fonts = {
  brand: "Poppins",
};

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  styles: {
    global: {
      html: {
        scrollBehavior: "smooth",
      },
      body: {
        bg: "brand.black",
        color: "white",
        fontFamily: "Poppins",
      },
    },
  },
  config,
  colors,
  fonts,
});

export default theme;
