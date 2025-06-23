import { useState } from 'react'
import './Calculator.css'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [waitingForNew, setWaitingForNew] = useState(false)
  const [afterEqual, setAfterEqual] = useState(false)
  const [memory, setMemory] = useState(null)

  const evaluate = (expr) =>
    Function(`"use strict"; return (${expr.replace(/\^/g, '**')})`)()

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
      setWaitingForNew(true)
      return
    }

    if (waitingForNew) {
      setExpression((e) => e.slice(0, -1) + nextOperator)
      return
    }

    try {
      const result = evaluate(expression)
      setDisplay(String(result))
    } catch {
      setDisplay('Error')
    }
    setExpression((e) => e + nextOperator)
    setWaitingForNew(true)
  }

  const handleEqual = () => {
    try {
      const expr = waitingForNew ? expression.slice(0, -1) : expression
      const result = evaluate(expr)
      setDisplay(String(result))
      setExpression(expr + '=')
    } catch {
      setDisplay('Error')
      setExpression('')
    }
    setAfterEqual(true)
    setWaitingForNew(false)
  }

  const memoryClear = () => setMemory(null)
  const memoryRecall = () => {
    if (memory !== null) setDisplay(String(memory))
  }
  const memoryAdd = () =>
    setMemory((m) => (m === null ? parseFloat(display) : m + parseFloat(display)))
  const memorySubtract = () =>
    setMemory((m) => (m === null ? -parseFloat(display) : m - parseFloat(display)))
  const memoryStore = () => setMemory(parseFloat(display))

  const factorial = (n) => {
    if (n < 0 || !Number.isInteger(n)) return NaN
    let res = 1
    for (let i = 2; i <= n; i++) res *= i
    return res
  }

  const applyUnary = (op) => {
    const value = parseFloat(display)
    let result
    let exprPart

    switch (op) {
      case 'recip':
        result = 1 / value
        exprPart = `1/(${display})`
        break
      case 'square':
        result = value ** 2
        exprPart = `(${display})^2`
        break
      case 'sqrt':
        result = Math.sqrt(value)
        exprPart = `sqrt(${display})`
        break
      case 'fact':
        result = factorial(value)
        exprPart = `fact(${display})`
        break
      default:
        return
    }

    if (afterEqual) {
      setExpression(exprPart)
      setAfterEqual(false)
    } else if (waitingForNew) {
      setExpression((e) => e + exprPart)
    } else {
      setExpression((e) => e.slice(0, -display.length) + exprPart)
    }

    setDisplay(String(result))
    setWaitingForNew(false)
  }

  const buttons = [
    { label: 'MC', onClick: memoryClear },
    { label: 'MR', onClick: memoryRecall, disabled: memory === null },
    { label: 'M+', onClick: memoryAdd },
    { label: 'M-', onClick: memorySubtract },
    { label: 'MS', onClick: memoryStore, disabled: memory === null },

    { label: 'CE', onClick: clearEntry },
    { label: 'C', onClick: clearAll },
    { label: '±', onClick: toggleSign },
    { label: '1/x', onClick: () => applyUnary('recip') },
    { label: 'x^2', onClick: () => applyUnary('square') },

    { label: '√', onClick: () => applyUnary('sqrt') },
    { label: 'x!', onClick: () => applyUnary('fact') },
    { label: '(', onClick: () => handleParenthesis('(') },
    { label: ')', onClick: () => handleParenthesis(')') },
    { label: 'x^y', onClick: () => handleOperator('^') },

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
      <div className="top-row">
        <div className="memory">{memory !== null ? memory : '\u00A0'}</div>
        <div className="expression">{expression || '\u00A0'}</div>
      </div>
      <div className="display">{display}</div>
      <div className="buttons">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            className={btn.className}
            onClick={btn.onClick}
            disabled={btn.disabled}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Calculator
