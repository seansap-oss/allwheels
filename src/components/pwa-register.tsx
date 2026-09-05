"use client";

import { useEffect, useState } from "react";

export function PwaRegister() {
  const [updateReady, setUpdateReady] = useState(false);
  const [offline, setOffline] = useState(false);
  const [installEvt, setInstallEvt] = useState<Event | null>(null);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    const onInstall = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    window.addEventListener("beforeinstallprompt", onInstall);

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
      window.removeEventListener("beforeinstallprompt", onInstall);
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
      {installEvt ? (
        <div className="border-b border-slate-200 bg-motora-50 px-4 py-2 text-center text-sm">
          <span className="font-semibold">Install Motora for faster access. </span>
          <button
            className="ml-2 rounded-full bg-navy-950 px-4 py-1.5 font-bold text-white"
            onClick={async () => {
              const evt = installEvt as unknown as { prompt: () => Promise<void> };
              await evt.prompt();
              setInstallEvt(null);
            }}
          >
            Install App
          </button>
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
