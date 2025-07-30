import { useState, useCallback, useEffect, useRef } from 'react';

export const usePictureInPicture = () => {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);
  const mediaSessionHandlerRef = useRef<(() => void) | null>(null);

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

  // Set up Media Session API for automatic PiP when leaving tab
  useEffect(() => {
    if ("mediaSession" in navigator) {
      // Create a stable handler function
      const handler = async () => {
        if (!pipWindow) {
          await handlePictureInPicture();
        }
      };
      
      mediaSessionHandlerRef.current = handler;
      
      // Set up the Media Session action handler
      navigator.mediaSession.setActionHandler(
        "enterpictureinpicture" as any,
        handler,
      );
      
      return () => {
        // Clean up the Media Session handler
        if (mediaSessionHandlerRef.current) {
          navigator.mediaSession.setActionHandler("enterpictureinpicture" as any, null);
          mediaSessionHandlerRef.current = null;
        }
      };
    }
  }, [pipWindow, handlePictureInPicture]);

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