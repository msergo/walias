import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import session from 'express-session';
import cookieParser from 'cookie-parser';

import type { Application } from './declarations'

import { logger } from './logger'
import { logError } from './hooks/log-error'
import { services } from './services/index'
import { channels } from './channels'
import { randomUUID } from 'crypto';

const app: Application = express(feathers())

// Load app configuration
app.configure(configuration())
app.use(cors())
app.use(json({
  limit: '20mb'
}))

app.use(cookieParser());
app.use(session({
  secret: randomUUID(),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Propagate session to request.params in feathers services
app.use(function (req, _res, next) {
  req.feathers = {
    ...req.feathers,
    session: req.session
  }
  next()
});

app.use('/authme', (req, res) => {
  //@ts-ignore
  req.session.user = {
    email: "her@va.mm"
  }
  res.send("done locally")
})

app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
