import { useEffect } from "react";

export function usePictureInPicture(videoContainerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!document.pictureInPictureEnabled) return;

    const enterPiP = async () => {
      const container = videoContainerRef.current;
      if (!container) return;

      const videos = container.querySelectorAll("video");
      const video = Array.from(videos).find(
        (v) => !v.muted && v.readyState >= 2
      );

      if (
        video &&
        "requestPictureInPicture" in video &&
        !document.pictureInPictureElement
      ) {
        try {
          await (video as any).requestPictureInPicture();
        } catch (err) {
          console.warn("Failed to enter PiP:", err);
        }
      }
    };

    const exitPiP = async () => {
      if (document.pictureInPictureElement) {
        try {
          await document.exitPictureInPicture();
        } catch (err) {
          console.warn("Failed to exit PiP:", err);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (window.innerWidth < 900) {
        if (document.visibilityState === "hidden") {
          enterPiP();
        } else {
          exitPiP();
        }
      }
    };

    const handleBlur = () => {
      if (window.innerWidth < 900) enterPiP();
    };
    const handleFocus = () => {
      if (window.innerWidth < 900) exitPiP();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [videoContainerRef]);
}
