import { useActivate } from "react-activation";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function parseSearch<T>(search: string) {
  const sp = new URLSearchParams(search);
  const obj: Record<string, unknown> = {};
  for (const key of sp.keys()) obj[key] = sp.get(key);
  return obj as T;
}

export default function useSearch<T extends Record<string, unknown>>(): T {
  const location = useLocation();
  const [value, setValue] = useState<T>(() => parseSearch<T>(location.search));

  // When the component is in the route tree and updating: follow search changes normally
  useEffect(() => {
    setValue(parseSearch<T>(location.search));
  }, [location.search]);

  // When reactivated from the KeepAlive cache: sync once more (essential)
  useActivate(() => {
    setValue(parseSearch<T>(window.location.search));
  });

  return value;
}
