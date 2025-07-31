import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { KikiLandingPage } from "./screens/KikiLandingPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <KikiLandingPage />
  </StrictMode>,
);
