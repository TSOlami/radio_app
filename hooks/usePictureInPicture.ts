import { useState, useCallback, useEffect } from 'react';

export const usePictureInPicture = () => {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const handlePictureInPicture = useCallback(async () => {
    if ("documentPictureInPicture" in window) {
      try {
        const pw = await (window as any).documentPictureInPicture.requestWindow();
        
        // Copy all stylesheets from parent window to PiP window
        window.document.head
          .querySelectorAll('link[rel="stylesheet"], style')
          .forEach((node) => {
            pw.document.head.appendChild(node.cloneNode(true));
          });
        
        // Handle PiP window close event
        pw.addEventListener("pagehide", () => setPipWindow(null));
        setPipWindow(pw);
        
        return pw;
      } catch (error) {
        console.error("Failed to open Picture-in-Picture:", error);
        return null;
      }
    } else {
      console.warn("Document Picture-in-Picture API is not supported in this browser");
      return null;
    }
  }, []);

  const closePictureInPicture = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  // Clean up PiP window when component unmounts
  useEffect(() => {
    return () => {
      if (pipWindow) {
        pipWindow.close();
      }
    };
  }, [pipWindow]);

  return {
    pipWindow,
    handlePictureInPicture,
    closePictureInPicture,
    isSupported: "documentPictureInPicture" in window,
  };
};