import React from "react";
import * as ReactDOM from "react-dom/client";
import * as serviceWorker from "./serviceWorker";
import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";
import { App } from "./App";
import { TodoProvider } from "./context/todoContext";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <TodoProvider>
          <ColorModeScript />
          <App />
        </TodoProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
