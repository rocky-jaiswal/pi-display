const blessed = require('blessed')
const axios = require('axios').default

const key = require('./key')

let content = ''
let weather = {}

const randomPercentage = () => `${Math.floor(Math.random() * 30)}%`

const getDate = () => `${new Date().toString().substr(0, 24)}`

const getWeather = () => {
  axios
    .get(`http://api.openweathermap.org/data/2.5/forecast/daily?q=Berlin,DE&cnt=3&appid=${key}&units=metric`)
    .then((resp) => (weather = resp.data))
    .catch((_err) => undefined)
}

const getContent = () => {
  content = getDate()
  const hour = new Date().getHours()
  if (!weather.list || hour % 4 === 0) {
    getWeather()
  } else {
    const day1 = weather.list[0]
    const day2 = weather.list[1]
    content = `
      ${getDate()}
      
      Today - Min: ${day1.temp.min}, Max: ${day1.temp.max}, ${day1.weather[0].description}
      
      Tomorrow - Min: ${day2.temp.min}, Max: ${day2.temp.max}, ${day2.weather[0].description}
    `
  }
  return content
}

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
})

screen.title = 'Pi'

// Create a box perfectly centered horizontally and vertically.
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '60%',
  height: '60%',
  content: `${getContent()}`,
  tags: true,
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0',
    },
    hover: {
      bg: 'green',
    },
  },
})

// Append our box to the screen.
screen.append(box)

setInterval(() => {
  box.top = randomPercentage()
  box.left = randomPercentage()
  box.setContent(getContent())
  screen.render()
}, 2000)

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0)
})

// Focus our element.
box.focus()

// Render the screen.
screen.render()

// http://api.openweathermap.org/data/2.5/forecast/daily?q=Berlin,DE&cnt=3&appid=583e617fbea5a171c1c1c897ff5b0b7d&units=metric
