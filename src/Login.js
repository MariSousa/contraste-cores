import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";
import style from "./Login.module.css";

import { useNavigate } from "react-router-dom";

import CapaLogin from "./assets/capaLogin.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const formLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        console.log("Usuário Logado!");
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={style.login}>
      {/* //container login */}
      <div className={style.containerLogin}>
        <div className={style.wrapperLogin}>
          {/* capa Login */}
          <div className={style.capaLogin}>
            <img src={CapaLogin} alt="" />
          </div>
          {/* formulário Login */}
          <div className={style.containerForm}>
            <h2>Faça seu login</h2>
            <form onSubmit={formLogin} className={style.formLogin}>
              {/* email */}
              <div className={style.formEmail}>
                <label>Digite seu email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                />
              </div>
              {/* senha */}
              <div className={style.formSenha}>
                <label>Digite sua senha:</label>
                <input
                  type="password"
                  value={senha}
                  onChange={({ target }) => setSenha(target.value)}
                />
              </div>
              <button type="submit">Entrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
