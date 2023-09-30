// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Authentification from "./pages/Authentification";
// import Register from "./pages/Register";
// import Pong from "./pages/Pong";
// import Landing from "./pages/Landing";
// import Leaderboard from "./pages/Leaderboard";
// import Settings from "./pages/Settings";
// import Profile from "./pages/Profile";
// import Play from "./pages/Play";
// import GlobalStyle from "./theme/GlobalStyle";
// import Verify2FA from "./pages/Verify2FA";
// import Friends from "./pages/Friends";
// import Home from "./pages/Home";

// const App = () => {
//   return (
//     <>
//       <GlobalStyle />
//       <Router>
//         <Routes>
//           <Route path="/auth" element={React.createElement(Authentification)} />
//           <Route path="/auth/register" element={React.createElement(Register)} />
//           <Route path="/auth/verify2fa-42api" element={React.createElement(Verify2FA)} />
//           <Route path="/landing" element={React.createElement(Landing)} />
//           <Route
//             path="/leaderboard"
//             element={React.createElement(Leaderboard)}
//           />
//           <Route path="/settings" element={React.createElement(Settings)} />
//           <Route path="/profile" element={React.createElement(Profile)} />
//           <Route path="/friends" element={React.createElement(Friends)} />
//           <Route path="/play" element={React.createElement(Play)} />
//           <Route path="/pong" element={React.createElement(Pong)} />
//           <Route path="/" element={React.createElement(Home)} />
//         </Routes>
//       </Router>
//     </>
//   );
// };

// export default App;


import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Authentification from "./pages/Authentification";
import Register from "./pages/Register";
import Pong from "./pages/Pong";
import Landing from "./pages/Landing";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Play from "./pages/Play";
import GlobalStyle from "./theme/GlobalStyle";
import Verify2FA from "./pages/Verify2FA";
import Friends from "./pages/Friends";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/auth" element={React.createElement(Authentification)} />
          <Route path="/auth/register" element={React.createElement(Register)} />
          <Route path="/auth/verify2fa-42api" element={React.createElement(Verify2FA)} />
          <Route path="/" element={React.createElement(Home)} />
        </Routes>
          <PrivateRoute path="/leaderboard" element={React.createElement(Leaderboard)} />
          <PrivateRoute path="/settings" element={React.createElement(Settings)} />
          <PrivateRoute path="/profile" element={React.createElement(Profile)} />
          <PrivateRoute path="/friends" element={React.createElement(Friends)} />
          <PrivateRoute path="/play" element={React.createElement(Play)} />
          <PrivateRoute path="/pong" element={React.createElement(Pong)} />
          <PrivateRoute path="/landing" element={React.createElement(Landing)} />
      </Router>
    </>
  );
};

export default App;
