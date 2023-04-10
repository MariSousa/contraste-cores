import React from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import style from "./Cadastro.module.css";

import Capacadastro from "./assets/capa_Cadastro.png";

const Cadastro = () => {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const [cadastro, setCadastro] = React.useState(false);
  const [mensagem, setMensagem] = React.useState("");

  async function formCadastro(event) {
    event.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, senha);
      setCadastro(true);
      setMensagem("Usuário cadastrado com sucesso");
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className={style.cadastro}>
      {/* //container cadastro */}
      <div className={style.containerCadastro}>
        <div className={style.wrapperCadastro}>
          {/* capa cadastro */}
          <div className={style.capaCadastro}>
            <img src={Capacadastro} alt="" />
          </div>
          {/* formulário cadastro */}
          <div className={style.containerForm}>
            <h2>Faça seu cadastro</h2>
            <form onSubmit={formCadastro} className={style.formCadastro}>
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
              <button type="submit">Cadastrar</button>
              {cadastro ? (
                <p className={style.mensagemSucesso}>{mensagem}</p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
