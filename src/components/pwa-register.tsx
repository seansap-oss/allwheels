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

    // If a new service worker takes control (e.g. a stale cached page is
    // open), reload once so the user always sees the current site.
    let reloaded = false;
    const onControl = () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };

    let reg: ServiceWorkerRegistration | null = null;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("controllerchange", onControl);
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
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("controllerchange", onControl);
      }
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
