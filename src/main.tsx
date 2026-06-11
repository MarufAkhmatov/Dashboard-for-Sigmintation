import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { I18nProvider } from "./app/i18n.tsx";
import { PortfolioProvider } from "./app/portfolio.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  </I18nProvider>
);
