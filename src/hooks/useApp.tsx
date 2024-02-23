import { useContext } from "react";
import { AppContext } from "@/context/app/context";

export const useApp = () => useContext(AppContext);
