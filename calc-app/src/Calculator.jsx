import { useState } from 'react'
import './Calculator.css'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForNew, setWaitingForNew] = useState(false)
  const [afterEqual, setAfterEqual] = useState(false)
  const [memory, setMemory] = useState(0)

  const inputDigit = (digit) => {
    if (afterEqual) {
      setExpression(String(digit))
      setDisplay(String(digit))
      setAfterEqual(false)
      setWaitingForNew(false)
      return
    }

    if (waitingForNew) {
      setDisplay(String(digit))
      setWaitingForNew(false)
      setExpression((e) => e + digit)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
      setExpression((e) => e + digit)
    }
  }

  const inputDecimal = () => {
    if (afterEqual) {
      setDisplay('0.')
      setExpression('0.')
      setAfterEqual(false)
      setWaitingForNew(false)
      return
    }
    if (waitingForNew) {
      setDisplay('0.')
      setExpression((e) => e + '0.')
      setWaitingForNew(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
      setExpression((e) => e + '.')
    }
  }

  const clearAll = () => {
    setDisplay('0')
    setExpression('')
    setWaitingForNew(false)
    setAfterEqual(false)
  }

  const clearEntry = () => {
    setDisplay('0')
    setWaitingForNew(true)
  }

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  const handleParenthesis = (paren) => {
    if (afterEqual) {
      setExpression(paren)
      setDisplay('0')
      setAfterEqual(false)
      setWaitingForNew(true)
      return
    }

    if (paren === '(') {
      if (!waitingForNew && expression && /[0-9)]$/.test(expression)) {
        setExpression((e) => e + '*' + paren)
      } else {
        setExpression((e) => e + paren)
      }
      setWaitingForNew(true)
    } else {
      setExpression((e) => e + paren)
    }
  }

  const handleOperator = (nextOperator) => {
    if (afterEqual) {
      setExpression(display + nextOperator)
      setAfterEqual(false)
    } else if (waitingForNew) {
      setExpression((e) => e.slice(0, -1) + nextOperator)
    } else {
      setExpression((e) => e + nextOperator)
    }
    setWaitingForNew(true)
  }

  const handleEqual = () => {
    try {
      // Avoid evaluating trailing operator
      const expr = waitingForNew ? expression.slice(0, -1) : expression
      const result = Function(`"use strict"; return (${expr})`)()
      setDisplay(String(result))
      setExpression(expr + '=')
    } catch {
      setDisplay('Error')
      setExpression('')
    }
    setAfterEqual(true)
    setWaitingForNew(false)
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
    { label: '(', onClick: () => handleParenthesis('(') },
    { label: ')', onClick: () => handleParenthesis(')') },
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
