import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import Input from './components/Input'

function App() {
  const [inputValue, setInputValue] = useState(2)
  const [showMessage, setShowMessage] = useState(false)
  const [numberFact, setNumberFact] = useState("No fact available")
  const labelButton = showMessage ? 'Hide' : 'Show'

  async function fetchNumberFact(num:number) {
    if (num > 0) {
      try {
        const response = await fetch(`http://numbersapi.com/${num}`)
        const data = await response.text()
        setNumberFact(data)
      } catch (error) {
        console.error('Error fetching number fact:', error)
        setNumberFact('Failed to fetch fact about this number')
      }
    } else {
      setNumberFact("No fact available")
    }
    setShowMessage(true)
  }  

  function handleToggleMessage() {
    setShowMessage((prev) => !prev)
  }

  async function handleInputChange(value: number) {
    setInputValue(value)
  }

  return (
    <>
      <h1>Trivia World</h1>
      <Input onChange={handleInputChange} label='Trivia Number:' min={1} value={inputValue}/>
      <div>
        <Button label="Get Trivia" onClick={async () => await fetchNumberFact(inputValue)} />
        <Button label={labelButton} onClick={handleToggleMessage} />
      </div>
      {showMessage && numberFact && <p>{numberFact}</p>}
    </>
  )
}

export default App
