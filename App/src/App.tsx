import Authentification from "./pages/Authentification";
import Pong from "./pages/Pong";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Hello from "./pages/Hello";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={React.createElement(Authentification)} />
        <Route path="/hello" element={React.createElement(Hello)} />
        <Route path="/pong" element={React.createElement(Pong)} />
      </Routes>
    </Router>
  );
};

export default App;
