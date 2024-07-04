import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hangman.css';

const Hangman = () => {
  const [name, setName] = useState('');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');
  const [hintUsed, setHintUsed] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      const response = await axios.get('http://localhost:5000/word');
      setWord(response.data.word);
    };
    fetchWord();
  }, []);

  const handleGuess = (letter) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters([...guessedLetters, letter]);
      if (!word.includes(letter)) {
        setWrongGuesses(wrongGuesses + 1);
      }
    }
  };

  useEffect(() => {
    if (wrongGuesses >= 10) {
      setGameStatus('lose');
    } else if (word && word.split('').every((letter) => guessedLetters.includes(letter))) {
      setGameStatus('win');
    }
  }, [wrongGuesses, guessedLetters, word]);

  const handleReset = () => {
    setName('');
    setWord('');
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameStatus('playing');
    setHintUsed(false);
    const fetchWord = async () => {
      const response = await axios.get('http://localhost:5000/word');
      setWord(response.data.word);
    };
    fetchWord();
  };

  const handleHint = () => {
    if (!hintUsed && gameStatus === 'playing') {
      const unguessedLetters = word.split('').filter(letter => !guessedLetters.includes(letter));
      if (unguessedLetters.length > 0) {
        const hintLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        setGuessedLetters([...guessedLetters, hintLetter]);
        setHintUsed(true);
      }
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => 
      guessedLetters.includes(letter) ? letter : '_'
    ).join(' ');
  };

  const renderButtons = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const firstRow = alphabet.slice(0, 13);
    const secondRow = alphabet.slice(13);

    return (
      <div className="hangman-buttons">
        <div className="button-row">
          {firstRow.map((letter) => (
            <button 
              key={letter} 
              onClick={() => handleGuess(letter)} 
              disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
              className="hangman-button"
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="button-row">
          {secondRow.map((letter) => (
            <button 
              key={letter} 
              onClick={() => handleGuess(letter)} 
              disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
              className="hangman-button"
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="hangman-container">
      {gameStatus === 'playing' ? (
        <>
          <h1 className="hangman-header">Hangman</h1>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={handleChangeName} 
            disabled={gameStatus !== 'playing'}
            className="hangman-input"
          />
          <p className="hangman-word">Word: {renderWord()}</p>
          <p className="wrong-guesses">Wrong guesses: {wrongGuesses}</p>
          {renderButtons()}
          <button className="hint-button" onClick={handleHint} disabled={hintUsed || gameStatus !== 'playing'}>
            {hintUsed ? 'Hint Used' : 'Get a Hint'}
          </button>
        </>
      ) : (
        <>
          <h1 className="hangman-header">Hangman</h1>
          {gameStatus === 'win' && (
            <div className="hangman-result hangman-win">
              <p>🎉 {name}, you win! 🎉</p>
              <p>Congratulations! You've guessed the word correctly.</p>
            </div>
          )}
          {gameStatus === 'lose' && (
            <div className="hangman-result hangman-lose">
              <p>😢 {name}, you lose! 😢</p>
              <p>Wrong guesses: {wrongGuesses}</p>
              <p>The word was: {word}</p>
            </div>
          )}
          <button className="play-again-button" onClick={handleReset}>Play Again</button>
        </>
      )}
    </div>
  );
};

export default Hangman;
