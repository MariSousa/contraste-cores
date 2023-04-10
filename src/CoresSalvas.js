import React from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

import style from "./CoresSalvas.module.css";

const CoresSalvas = () => {
  const [coresSalvas, setCoresSalvas] = React.useState([]);

  React.useEffect(() => {
    async function cores() {
      const userId = getAuth().currentUser.uid;
      const docRef = doc(db, "color_palette", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCoresSalvas(docSnap.data().color_palette);
      } else {
        console.log("No such document!");
      }
    }
    cores();
  }, []);
  console.log(coresSalvas);
  return (
    <div className={style.containerCoresSalvas}>
      {coresSalvas.map((cores, index) => (
        <div key={index} className={style.listaCores}>
          <div className={style.cardCoresSalvas}>
            <div className={style.temas}>
              <div
                className={style.coresBackground}
                style={{
                  background: `${cores.background}`,
                }}
              >
                <div className={style.codigoBakground}>
                  <p>{cores.background}</p>
                </div>
              </div>
              <div
                className={style.coresText}
                style={{
                  background: `${cores.text}`,
                }}
              >
                <div className={style.codigoText}>
                  <p>{cores.text}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoresSalvas;
