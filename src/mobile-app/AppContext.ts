import { createContext } from "react";
import { IGlobalData } from "./src/types/AppConfig.type";

export const GlobalContext = createContext<IGlobalData>({} as any);
