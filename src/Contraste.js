import React from "react";
import { ChromePicker } from "react-color";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

import "./App.css";
import style from "./Contraste.module.css";

function Contraste() {
  //autenticação
  const auth = getAuth();
  const [userSingIn, setUserSingIn] = React.useState(null);
  const [displayButtons, setDisplayButtons] = React.useState(false);
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

    const coresSalvas = JSON.parse(localStorage.getItem("coresSalvas"));

    if (coresSalvas) {
      setCoresSalvas(coresSalvas);
    }

    // unsubscribe listener
    return () => unsubscribe();
  }, [auth]);

  // Estados para armazenar as cores inseridas pelo usuario
  const [cor1, setCor1] = React.useState("#000000");
  const [cor2, setCor2] = React.useState("#ffffff");

  //estado resultado para armazenar o resultado do constraste
  const [resultado, setResultado] = React.useState(0);

  //estado para armazenar o nível do contraste
  const [contraste, setContraste] = React.useState();

  //estado para armazenar as cores salvas
  const [coresSalvas, setCoresSalvas] = React.useState([]);
  const [mensagem, setMensagem] = React.useState("");

  //banco de dados para salvar as cores
  const db = getFirestore();

  //função para converter cores em hexadecimal para rgb
  function hexToRgb(hex) {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    return { r, g, b };
  }

  //função para calcular a luminosidade das cores em rgb
  function calculateLuminance(rgb) {
    const { r, g, b } = rgb;
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance / 255; // normaliza o valor para ficar entre 0 e 1
  }

  //função para mostrar o nível de constraste
  const MIN_CONTRAST_RATIO_AAA = 7;
  const MIN_CONTRAST_RATIO_AA = 4.5;
  function nivelContraste() {
    if (resultado >= MIN_CONTRAST_RATIO_AAA) {
      setContraste("AAA");
    } else if (resultado >= MIN_CONTRAST_RATIO_AA) {
      setContraste("AA");
    } else {
      setContraste("F");
    }
  }

  //função para calcular o constraste das cores (final)
  function handleContrast(event) {
    event.preventDefault();

    const rgb1 = hexToRgb(cor1);
    const rgb2 = hexToRgb(cor2);

    const luminance1 = calculateLuminance(rgb1);
    const luminance2 = calculateLuminance(rgb2);

    const contrastRatio =
      (Math.max(luminance1, luminance2) + 0.05) /
      (Math.min(luminance1, luminance2) + 0.05);

    setResultado(contrastRatio.toFixed(2));
    nivelContraste();
  }

  //salvar cores no banco de dados
  async function salvandoCores(user_id, background, text) {
    const docRef = doc(db, "color_palette", user_id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Se o documento do usuário já existe, adicione as novas cores ao array existente
      const existingColors = docSnap.data().color_palette;
      existingColors.push({ background, text });

      await setDoc(docRef, { color_palette: existingColors });
    } else {
      // Se o documento do usuário não existe, crie um novo com a nova cor
      await setDoc(docRef, { color_palette: [{ background, text }] });
    }

    console.log("cores salvas");
  }
  function salvarCores() {
    salvandoCores(userSingIn.uid, cor1, cor2);
    setCoresSalvas(true);
    setMensagem("Cores salvas com sucesso!");
  }

  React.useEffect(() => {
    if (coresSalvas) {
      setTimeout(() => {
        setCoresSalvas(false);
        setMensagem("");
      }, 1000);
    }
  }, [coresSalvas]);

  return (
    <div className="App">
      <div className={style.containerApp}>
        {/*Formulario para o usuario inserir duas cores*/}
        <div className={style.containerForm}>
          <form className="form" onSubmit={handleContrast}>
            <div className={style.formBackText}>
              <div className={style.formBack}>
                <label htmlFor="cor1">Escolha a cor de fundo</label>
                {/* Substituir o campo input text pelo chromepicker e inserir o código da cor no input */}
                <ChromePicker
                  color={cor1}
                  onChange={(cor) => setCor1(cor.hex)}
                  className={style.chromepicker}
                />
                <input type="text" name="cor1" value={cor1} readOnly />
              </div>

              <div className={style.formText}>
                <label htmlFor="cor2">Escolha a cor do texto</label>
                {/* Substituir o campo input text pelo chromepicker e inserir o código da cor no input */}
                <ChromePicker
                  color={cor2}
                  onChange={(cor) => setCor2(cor.hex)}
                  className={style.chromepicker}
                />
                <input type="text" name="cor2" value={cor2} readOnly />
              </div>
            </div>

            <button className={style.buttonVerificar}>
              Verificar contraste das cores
            </button>
            <p className={style.textVerificado}>
              O constraste entre as cores é {resultado}:1 / {contraste}{" "}
            </p>
          </form>
        </div>

        {/* visor automatico */}
        <div className={style.containerVisor}>
          <div
            style={{
              background: `${cor1}`,
            }}
            className={style.visorBack}
          >
            <p style={{ color: `${cor2}` }} className={style.visorTexto}>
              WCAG são diretrizes e recomendações organizadas e mantidas pelo
              W3C que fundamentam a construção de conteúdos digitais com
              qualidade e acessíveis a qualquer pessoa independentemente de sua
              deficiência e/ou habilidade. Atualmente na versão 2.1 (2018),
              desde a versão 2.0 (2008) foram organizadas de forma que fossem
              independentes de qualquer tecnologia criada e que também fossem
              facilmente testáveis e validadas.
            </p>
          </div>
          {displayButtons && userSingIn ? (
            <button onClick={salvarCores} className={style.salvarCores}>
              Salvar Cores
            </button>
          ) : null}
          {coresSalvas ? <p className={style.mensagem}>{mensagem}</p> : null}
        </div>
      </div>
    </div>
  );
}

export default Contraste;
