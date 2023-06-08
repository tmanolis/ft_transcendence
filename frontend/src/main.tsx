import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import RootRouter from "./Router/RootRouter"
import Game from "./components/Game";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRouter />,
    children: [
      {
        path: "/",
        element: <h1>This is an Index page</h1>,
      },
      {
        path: "/game",
        element: <Game />,
      },
      {
        path: "/Login",
        element: <Login />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
