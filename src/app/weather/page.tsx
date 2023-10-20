"use client";
import { useEffect, useState } from "react";

export default function Page() {
  const [iframeStyle, setIframeStyle] = useState({});

  useEffect(() => {
    function updateIframeSize() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Define un factor de escala para el ancho y la altura
      const scaleWidth = windowWidth < 800 ? 0.9 : 1; // Escala para dispositivos con ancho menor a 800px
      const scaleHeight = windowHeight < 600 ? 0.85 : 0.85; // Escala para dispositivos con altura menor a 600px

      // Calcula las dimensiones del iframe en función del factor de escala
      const width = windowWidth * scaleWidth;
      const height = windowHeight * scaleHeight;

      // Establece el estilo en línea para el iframe
      setIframeStyle({
        width: width + "px",
        height: height + "px",
      });
    }

    // Llama a la función para actualizar el tamaño del iframe cuando cambia el tamaño de la ventana
    window.addEventListener("resize", updateIframeSize);
    updateIframeSize();

    return () => {
      window.removeEventListener("resize", updateIframeSize);
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-between p-2">
      <iframe
        src="https://app.sab.gov.co/sab/lluvias.htm"
        style={iframeStyle}
      ></iframe>
    </main>
  );
}
