import { useState } from 'react'
import './Calculator.css'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [operator, setOperator] = useState(null)
  const [firstValue, setFirstValue] = useState(null)
  const [waitingForSecond, setWaitingForSecond] = useState(false)
  const [memory, setMemory] = useState(0)
  const [expression, setExpression] = useState('')

  const inputDigit = (digit) => {
    if (waitingForSecond) {
      setDisplay(String(digit))
      setWaitingForSecond(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecond) {
      setDisplay('0.')
      setWaitingForSecond(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setFirstValue(null)
    setOperator(null)
    setWaitingForSecond(false)
    setExpression('')
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display)

    if (firstValue == null) {
      setFirstValue(inputValue)
      setExpression(`${display} ${nextOperator}`)
    } else if (operator) {
      const currentValue = firstValue || 0
      const result = performCalculation[operator](currentValue, inputValue)
      setFirstValue(result)
      setDisplay(String(result))
      setExpression(`${result} ${nextOperator}`)
    } else {
      setExpression(`${display} ${nextOperator}`)
    }

    setWaitingForSecond(true)
    setOperator(nextOperator)
  }

  const performCalculation = {
    '/': (first, second) => first / second,
    '*': (first, second) => first * second,
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
    '=': (first, second) => second,
  }

  const handleEqual = () => {
    const inputValue = parseFloat(display)
    if (operator && firstValue != null) {
      const currentValue = firstValue
      const result = performCalculation[operator](currentValue, inputValue)
      setDisplay(String(result))
      setFirstValue(result)
      setExpression(`${firstValue} ${operator} ${display} =`)
    }
    setOperator(null)
    setWaitingForSecond(true)
  }

  const memoryClear = () => setMemory(0)
  const memoryRecall = () => setDisplay(String(memory))
  const memoryAdd = () => setMemory((m) => m + parseFloat(display))
  const memorySubtract = () => setMemory((m) => m - parseFloat(display))
  const memoryStore = () => setMemory(parseFloat(display))

  const buttons = [
    { label: 'MC', onClick: memoryClear },
    { label: 'MR', onClick: memoryRecall },
    { label: 'M+', onClick: memoryAdd },
    { label: 'M-', onClick: memorySubtract },
    { label: 'MS', onClick: memoryStore },
    { label: 'CE', onClick: clearEntry },
    { label: 'C', onClick: clearAll },
    { label: '±', onClick: toggleSign },
    { label: '/', onClick: () => handleOperator('/') },
    { label: '7', onClick: () => inputDigit(7) },
    { label: '8', onClick: () => inputDigit(8) },
    { label: '9', onClick: () => inputDigit(9) },
    { label: '*', onClick: () => handleOperator('*') },
    { label: '4', onClick: () => inputDigit(4) },
    { label: '5', onClick: () => inputDigit(5) },
    { label: '6', onClick: () => inputDigit(6) },
    { label: '-', onClick: () => handleOperator('-') },
    { label: '1', onClick: () => inputDigit(1) },
    { label: '2', onClick: () => inputDigit(2) },
    { label: '3', onClick: () => inputDigit(3) },
    { label: '+', onClick: () => handleOperator('+') },
    { label: '0', onClick: () => inputDigit(0), className: 'zero' },
    { label: '.', onClick: inputDecimal },
    { label: '=', onClick: handleEqual },
  ]

  return (
    <div className="calculator">
      <div className="expression">{expression || '\u00A0'}</div>
      <div className="display">{display}</div>
      <div className="buttons">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className={btn.className}
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator
