import React, { useState, useRef, useEffect } from 'react';
import "./App.css";

function App() {
  const [inputLetters, setInputLetters] = useState(['', '', '', '', '']);
  const [wordIndex, setWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(0); // Contador de intentos para una palabra
  const firstInputRef = useRef();
  const [palabrasDesordenadas, setPalabrasDesordenadas] = useState([]);
  const [adivinadas, setAdivinadas] = useState([]);
  const palabrasParaGanar = 6;
  const maxErroresPorPalabra = 3; 
  const [letterErrors, setLetterErrors] = useState([0, 0, 0, 0, 0]); // Contador de errores por letra
  const [totalErrors, setTotalErrors] = useState(0); // Contador total de errores



  const palabrasValidas = ['limon', 'mango', 'cacao', 'perro', 'silla', 'lapiz', 'tigre', 'pluma', 'reloj', 'cebra'];

  
  useEffect(() => {
    const desordenarPalabra = (palabra) => {
      const palabraArray = palabra.split('');
      palabraArray.sort(() => Math.random() - 0.8);
      return palabraArray.join('');
    };

    const palabrasDesordenadasArray = palabrasValidas.map(palabra => desordenarPalabra(palabra));
    setPalabrasDesordenadas(palabrasDesordenadasArray);
  }, []);

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    if (/^[a-z]$/.test(value) || value === 'ñ') {
      const newInputLetters = [...inputLetters];
      newInputLetters[index] = value;
      setInputLetters(newInputLetters);

      if (index === 4) {
        const word = newInputLetters.join('');
        const currentWord = palabrasValidas[wordIndex];

        const incorrectLettersCount = word.split('').reduce((acc, letter, i) => {
          return letter !== currentWord[i] ? acc + 1 : acc;
        }, 0);

        const newLetterErrors = [...letterErrors];
        newLetterErrors[index] = incorrectLettersCount;
        setLetterErrors(newLetterErrors);

        const newTotalErrors = totalErrors + incorrectLettersCount;
        setTotalErrors(newTotalErrors);

        if (incorrectLettersCount === 0) {
          alert('¡Palabra válida!');
          setInputLetters(['', '', '', '', '']);
          if (firstInputRef.current) {
            firstInputRef.current.focus();
          }
          setAdivinadas([...adivinadas, currentWord]);
          if (adivinadas.length === palabrasParaGanar) {
            alert('¡Ganaste el juego!');
            handleRestart();
          } else {
            setWordIndex(wordIndex + 1);
          }
        } else if (newTotalErrors >= maxErroresPorPalabra) {
          alert('Te has equivocado en tres o mas letras, por lo que el juego se ha terminado');
          handleRestart();
        } else {
          alert(`Te equivocaste en ${incorrectLettersCount} letras, tienes ${maxErroresPorPalabra - newTotalErrors} oportunidades más de adivinar.`);
        }

        if (wordIndex + 1 === palabrasValidas.length) {
          if (adivinadas.length !== palabrasParaGanar) {
            alert('Has llegado al final del juego pero no lograste adivinar las 6 palabras necesarias para ganar. ¡Inténtalo de nuevo!');
          }
          handleRestart();
        }
      } else if (index < 4) {
        const nextInput = document.getElementById(`input-${index + 1}`);
        nextInput && nextInput.focus();
      }
    }
  };

  const handleReset = () => {
    setInputLetters(['', '', '', '', '']);
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  };

  const handleRestart = () => {
    setWordIndex(0);
    setInputLetters(['', '', '', '', '']);
    setAttempts(0);
    setAdivinadas([]);
    setLetterErrors([0, 0, 0, 0, 0]);
    setTotalErrors(0);
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  };

  return (
    <div className="container">
      <div className="centered-content">
        <h1>Juego de palabras</h1>
        <h3>Palabras desordenadas: {palabrasDesordenadas[wordIndex]}</h3>
        <div>
          {inputLetters.map((letter, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              value={letter}
              onChange={(e) => handleInputChange(e, index)}
              ref={index === 0 ? firstInputRef : null}
            />
          ))}
        </div>
        <div className="button-container">
          <button onClick={handleReset}>Borrar</button>
          <button onClick={handleRestart}>Reiniciar</button>
        </div>
        <p>Palabras adivinadas: {adivinadas.length}/7</p>
        <p>Errores: {totalErrors}/{maxErroresPorPalabra}</p>
      </div>
    </div>
  );
}

export default App;
