import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import { decodeHtml } from './util/decodeHtml'
import { fetchTrivia } from './api/triviaApi'

function App() {
  const [factMessage, setFactMessage] = useState("No trivia available")
  const [category, setCategory] = useState<string | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const isCorrect = selectedAnswer === correctAnswer;

  async function fetchTriviaByNumber(num: number = 1) {
    setFactMessage("Loading trivia...");
    setCategory(null);
    setCorrectAnswer(null);
    setHasAnswered(false);
    try {
      const results = await fetchTrivia(num); 
      if (results.length === 0) {
        setFactMessage("No trivia results fetched");
        return;
      }
      const decodedQuestion = decodeHtml(results[0].question);
      const decodedCategory = decodeHtml(results[0].category);
      setFactMessage(decodedQuestion);
      setCategory(decodedCategory);
      setCorrectAnswer(results[0].correct_answer);
    } catch (error) {
      console.error('Error fetching number fact:', error);
      setFactMessage('Failed to fetch trivia about this number');
    }
  }

  async function handleGetTriviaClick() {
    await fetchTriviaByNumber(1);
  }

  function handleTrueClick() {
    setSelectedAnswer('True');
    setHasAnswered(true);
  }
  function handleFalseClick() {
    setSelectedAnswer('False');
    setHasAnswered(true);
  }

  const answerContent = isCorrect ? <div>Correct!🎉</div> : <div>Incorrect! 😬</div>;

  return (
    <>
      <h1>Trivia World</h1>
      <div>
        <Button label={!hasAnswered ? "Load Trivia" : "Next Trivia"} onClick={handleGetTriviaClick} />
      </div>
      <div className="card">
        {category && <h4>{category}</h4>}
        {factMessage && <p>{factMessage}</p>}
        {correctAnswer && 
          <div className='button-group'>
            <Button label="True" onClick={handleTrueClick} disabled={hasAnswered && selectedAnswer !== 'True'} />
            <Button label="False" onClick={handleFalseClick} disabled={hasAnswered && selectedAnswer !== 'False'} />
          </div>
        }
        {hasAnswered && answerContent}
      </div>
      <footer>
        <>Powered by <span><a href="https://opentdb.com/" target="_blank" rel="noopener noreferrer">
            Open Trivia Database
          </a></span>
        </>
      </footer>
    </>
  )
}

export default App
