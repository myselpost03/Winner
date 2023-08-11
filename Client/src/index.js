import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./Context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactGA from "react-ga";
import { LanguageProvider } from "./Context/languageContext";

ReactGA.initialize("G-WNC7H7TTW2");

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </AuthContextProvider>
    </LanguageProvider>
  </React.StrictMode>
);

reportWebVitals();
