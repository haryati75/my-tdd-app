import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import { decodeHtml } from './util/decodeHtml'
import { fetchTrivia } from './api/triviaApi'

function App() {
  const [factMessage, setNumberFact] = useState("No trivia available")
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hasAnswered, setHasAnswered] = useState(false)

  async function fetchTriviaByNumber(num: number) {
    if (num > 0) {
      try {
        const results = await fetchTrivia(num); 
        const decodedQuestion = decodeHtml(results[0].question);
        setNumberFact(decodedQuestion);
        setCorrectAnswer(results[0].correct_answer);
      } catch (error) {
        console.error('Error fetching number fact:', error);
        setNumberFact('Failed to fetch trivia about this number');
        setCorrectAnswer(null);
      }
    } else {
      setNumberFact("No trivia available");
      setCorrectAnswer(null);
    }
    setHasAnswered(false)
  }

  function handleGetTriviaClick() {
    fetchTriviaByNumber(1);
  }

  function handleTrueClick() {
    setIsCorrect(correctAnswer === 'True')
    setHasAnswered(true)
  }
  function handleFalseClick() {
    setIsCorrect(correctAnswer === 'False')
    setHasAnswered(true)
  }

  return (
    <>
      <h1>Trivia World</h1>
      <div>
        <Button label="Get Trivia" onClick={handleGetTriviaClick} />
      </div>
      {factMessage && <p>{factMessage}</p>}
      {correctAnswer && 
        <div>
          <Button label="True" onClick={handleTrueClick} />
          <Button label="False" onClick={handleFalseClick} />
        </div>
      }
      {hasAnswered && isCorrect && <p>Correct!</p>}
      {hasAnswered && !isCorrect && <p>Incorrect!</p>}
    </>
  )
}

export default App
