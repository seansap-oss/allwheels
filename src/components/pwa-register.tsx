"use client";

import { useEffect, useState } from "react";

export function PwaRegister() {
  const [updateReady, setUpdateReady] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    let reg: ServiceWorkerRegistration | null = null;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((r) => {
          reg = r;
          if (r.waiting) setUpdateReady(true);
          r.addEventListener("updatefound", () => {
            const sw = r.installing;
            if (!sw) return;
            sw.addEventListener("statechange", () => {
              if (sw.state === "installed" && navigator.serviceWorker.controller) setUpdateReady(true);
            });
          });
        })
        .catch(() => {
          /* SW optional in dev */
        });
    }
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      void reg;
    };
  }, []);

  return (
    <>
      {offline ? (
        <div role="status" className="bg-amber-400 px-4 py-2 text-center text-sm font-bold text-amber-950">
          You are offline. Showing cached content where available.
        </div>
      ) : null}
      {updateReady ? (
        <div className="bg-navy-950 px-4 py-2 text-center text-sm text-white">
          A new version of Motora is available.{" "}
          <button className="font-bold underline" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      ) : null}
    </>
  );
}
