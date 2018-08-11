#!/usr/bin/env node


const http = require('http')
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('server');
const cors = require('cors');

const app = express();

const port = process.env.PORT || '3001';
app.set('port', port);

app.use(cors());
app.use(bodyParser.json());
app.use(require('../server/routes'));

const server = http.createServer(app)

server.listen(port)
server.on('error', function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
})
server.on('listening', function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  debug(`Listening on ${bind}`)
})

const terminate = why => {
  if (process.terminating) {
    return
  }

  process.terminating = true
  console.log(`process.terminating process ${why}..`)

  //this timeout allows readiness probe to detect failure
  setTimeout(function () {
    server.close(function () {
      console.log(`server successfully closed - ${why}. terminated!`)
      dataStores.dispose()

      setTimeout(function () {
        process.exit(1)
      }, 100)
    })
  }, READINESS_PROBE_DELAY)


  setTimeout(function () {
    console.log(`${why} - killed!`)
    dataStores.dispose()

    setTimeout(function () {
      process.exit(1)
    }, 100)
  }, KILL_DELAY)
}

process.on('terminate', terminate);
process.on('SIGTERM', terminate);
