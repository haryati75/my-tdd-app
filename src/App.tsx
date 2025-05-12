import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import Input from './components/Input'

function App() {
  const [showMessage, setShowMessage] = useState(false)
  const [numberFact, setNumberFact] = useState("No fact available")
  const labelButton = showMessage ? 'Hide' : 'Show'
  
  function handleClick() {
    setShowMessage((prev) => !prev)
  }

  async function handleInputChange(value: number) {
    if (value > 0) {
      try {
        const response = await fetch(`http://numbersapi.com/${value}`)
        const data = await response.text()
        setNumberFact(data)
      } catch (error) {
        console.error('Error fetching number fact:', error)
        setNumberFact('Failed to fetch fact about this number')
      }
    } else {
      setNumberFact("No fact available")
    }
  }

  return (
    <>
      <h1>Trivia World</h1>
      <Input onChange={handleInputChange} label='Trivia Number' min={1} max={1000} />
      <Button label={labelButton} onClick={handleClick} />
      {showMessage && numberFact && <p>{numberFact}</p>}
    </>
  )
}

export default App
