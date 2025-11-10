import { useEffect } from "react";
import api from "@/services/api/api";

export function useAnalytics(pageName = window.location.pathname) {
  useEffect(() => {
    const startTime = Date.now();

    api.post("/analytics/event", {
      event: "visit",
      page: pageName,
      timestamp: new Date().toISOString(),
    }).catch(() => {});

    const handleClick = (e: MouseEvent) => {
      const element = (e.target as HTMLElement).closest("[data-track]");
      if (element) {
        api.post("/analytics/event", {
          event: "click",
          page: pageName,
          element: element.getAttribute("data-track"),
          timestamp: new Date().toISOString(),
        }).catch(() => {});
      }
    };

    document.addEventListener("click", handleClick);

    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      api.post("/analytics/event", {
        event: "leave",
        page: pageName,
        duration,
        timestamp: new Date().toISOString(),
      }).catch(() => {});
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pageName]);
}
