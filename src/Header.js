import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Like } from "../src/assets/like.svg";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import styles from "./Header.module.css";

const Header = () => {
  const auth = getAuth();
  const [userSingIn, setUserSingIn] = React.useState(null);
  const [displayButtons, setDisplayButtons] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserSingIn(user);
        setDisplayButtons(true);
      } else {
        setUserSingIn(null);
        setDisplayButtons(false);
      }
    });

    // unsubscribe listener
    return () => unsubscribe();
  }, [auth]);

  function singOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("user");
        setUserSingIn(null);
        setDisplayButtons(false);
        navigate("/");
      })
      .catch((error) => {
        // An error happened.
        console.log(error.message);
      });
  }
  return (
    <header className={styles.header}>
      <div className={styles.btnContraste}>
        <Link to="/">Contraste</Link>
      </div>

      <div className={styles.btns}>
        <div className={styles.cadastroLogin}>
          {!userSingIn ? <Link to="/cadastro">Cadastro</Link> : null}
          {!userSingIn ? <Link to="/login">Login</Link> : null}
        </div>

        <div className={styles.usuLike}>
          {displayButtons && userSingIn ? (
            <p>Usuário: {userSingIn.email}</p>
          ) : null}
          {displayButtons && userSingIn ? (
            <Link to="coressalvas">
              <button>Cores salvas</button>
            </Link>
          ) : null}
          {displayButtons && userSingIn ? (
            <button onClick={singOut}>Sair</button>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Header;
