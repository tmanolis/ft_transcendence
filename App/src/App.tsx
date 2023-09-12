import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authentification from "./pages/Authentification";
import Pong from "./pages/Pong";
import Landing from "./pages/Landing";
import GlobalStyle from "./theme/GlobalStyle";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/auth" element={React.createElement(Authentification)} />
          <Route path="/" element={React.createElement(Landing)} />
          <Route path="/pong" element={React.createElement(Pong)} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
