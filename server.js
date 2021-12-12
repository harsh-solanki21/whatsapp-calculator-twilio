const express = require('express')
require('dotenv').config({ path: './config.env' })
const app = express()
const port = 5000

app.use(express.static(__dirname + '/views'))
app.use(express.urlencoded({ extended: false }))

const accountSid = process.env.ACCOUNT_SID
const authToken = process.env.AUTH_TOKEN
const client = require('twilio')(accountSid, authToken)
const MessagingResponse = require('twilio').twiml.MessagingResponse

app.post('/', (req, res) => {
  const reply = req.body.Body
  console.log(`Received: ${reply}`)
  const sender = req.body.ProfileName
  let twiml = new MessagingResponse()

  if (
    reply === 'Hi' ||
    reply === 'Hello' ||
    reply === 'Hey' ||
    reply === 'Hola'
  ) {
    twiml.message(`Hello ${sender}. Welcome to WhatsApp Calculator`)
    twiml.message('Enter the Equation')
  } else {
    // Calc
    let result

    const value = reply.split(/[+,-,*,/,%]/)
    const values = value.map((val) => {
      return val.trim()
    })
    for (let i = 0; i < reply.length; i++) {
      let val = reply[i]
      if (
        val === '+' ||
        val == '-' ||
        val === '*' ||
        val === '/' ||
        val === '%'
      ) {
        values.push(val)
      }
    }

    let number1 = parseInt(values[0])
    let number2 = parseInt(values[1])
    switch (values[2]) {
      case '+':
        result = number1 + number2
        twiml.message(`${number1} + ${number2} = ${result}`)
        break

      case '-':
        result = number1 - number2
        twiml.message(`${number1} - ${number2} = ${result}`)
        break

      case '*':
        result = number1 * number2
        twiml.message(`${number1} * ${number2} = ${result}`)
        break

      case '/':
        result = number1 / number2
        twiml.message(`${number1} / ${number2} = ${result}`)
        break

      case '%':
        result = number1 % number2
        twiml.message(`${number1} % ${number2} = ${result}`)
        break

      default:
        twiml.message('Invalid Equation')
        break
    }
  }
  res.writeHead(200, { 'content-type': 'text/xml' })
  res.end(twiml.toString())
})

app.get('/', (req, res) => {
  res.render('index.html')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
