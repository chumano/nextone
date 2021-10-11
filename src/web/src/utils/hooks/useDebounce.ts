import _ from "lodash"
import { useCallback, useEffect, useRef } from "react";
import { useIsMounted } from "./useIsMounted";

export const useDebounce = (cb:(...args:any)=>void, delay:number) => {
    const options = {
      leading: false,
      trailing: true
    };
    const inputsRef = useRef({cb, delay});
    const isMounted = useIsMounted();
    useEffect(() => {
      inputsRef.current = { cb, delay };
    });
  
    return useCallback(
      _.debounce(
        (...args) => {
          // Don't execute callback, if (1) component in the meanwhile 
          // has been unmounted or (2) delay has changed
          if (inputsRef.current.delay === delay && isMounted())
            inputsRef.current.cb(...args);
        },
        delay,
        options
      ),
      [delay, _.debounce]
    );
  }