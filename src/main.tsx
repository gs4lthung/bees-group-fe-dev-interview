import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
