import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Contraste from "./Contraste";
import Header from "./Header";
import Cadastro from "./Cadastro";
import Login from "./Login";
import CoresSalvas from "./CoresSalvas";
import PrivateRoute from "./PrivateRoute";

import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = React.useState(null);

  // observa mudanças de estado de autenticação do Firebase
  const auth = getAuth();
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Contraste />}></Route>
          <Route path="/cadastro" element={<Cadastro />}></Route>
          <Route path="/login" element={<Login />}></Route>

          <Route
            path="/coressalvas"
            element={user ? <CoresSalvas /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
