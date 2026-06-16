import { useCallback, useEffect, useState } from "react";

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requesting, setRequesting] = useState(false);

  const request = useCallback(async () => {
    setRequesting(true);
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      setStream(s);
      return s;
    } catch (e: any) {
      setError(e?.message ?? "Camera access denied");
      return null;
    } finally {
      setRequesting(false);
    }
  }, []);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  useEffect(() => () => stream?.getTracks().forEach((t) => t.stop()), [stream]);

  return { stream, error, requesting, request, stop };
}
