import { useEffect, useRef } from 'react';

export function useUnmount(fn: Function) {
  const fnRef = useRef<Function>(fn);
  fnRef.current = fn;
  useEffect(
    () => () => {
      if (fnRef.current) {
        fnRef.current();
      }
    },
    [],
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
export function useMount(fn: Function) {
  useEffect(() => {
    fn();
  }, []);
}
