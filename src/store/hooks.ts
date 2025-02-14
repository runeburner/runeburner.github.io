import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, Store, RootState } from "./store";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<Store>();
