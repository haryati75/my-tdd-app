import { useState } from 'react'
import './App.css'
import Button from './components/Button'

function App() {
  const [showMessage, setShowMessage] = useState(false)
  const labelButton = showMessage ? 'Hide' : 'Show'
  const message = "This is my first React app with TypeScript"

  function handleClick() {
    setShowMessage(!showMessage)
  }

  return (
    <>
      <h1>Hello World!!</h1>
      <Button label={labelButton} onClick={handleClick} />
      {showMessage && <p>{message}</p>}
    </>
  )
}

export default App
