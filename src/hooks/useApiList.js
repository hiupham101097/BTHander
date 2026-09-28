import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api.js";

export default function useApiList(path) {
  const [data, setData] = useState([]);
  const [state, setState] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    apiRequest(path, { signal: controller.signal })
      .then((body) => {
        if (controller.signal.aborted) return;
        setData(body.data || []);
        setState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("error");
      });
    return () => controller.abort();
  }, [path, attempt]);
  return { data, state, retry: () => setAttempt(value => value + 1) };
}
