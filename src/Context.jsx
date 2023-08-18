import { createContext } from "react";

export const TeamsFxContext = createContext({
  theme: undefined,
  scope:"User.ReadBasic.All",
  themeString: "",
  teamsfx: undefined
});
