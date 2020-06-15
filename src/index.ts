#!/usr/bin/env node

import fs from 'fs'
import express from 'express'
import bodyParser from 'body-parser'
import expressWs from 'express-ws'
import ws from 'ws'
import path from 'path'
import * as tools from './tools'

const {
  red, blue, green, cyan, magenta, log,
  noop, globDir, formatAppsResult, asyncSpawn,
  targetProjects
} = tools


const appBase = express()

const { app } = expressWs(appBase)
app.use(bodyParser.json())




// if change path, return dir 
app.post('/path/changePath', async (req: express.Request, res: express.Response) => {
  const { path: pt }: { path: string } = req.body
  const [info, msg] = await globDir(pt)
  res.send(formatAppsResult(info, msg))
})

// get target path projects
app.post('/npm/getProjects', async (req: express.Request, res: express.Response) => {
  const { path: pt }: { path: string } = req.body
  const [info, msg] = await targetProjects(pt)
  res.send(formatAppsResult(info, msg))
})

// exec npm command
app.post('/npm/command', async (req: express.Request, res: express.Response) => {
  const { command }: { command: string } = req.body
  // run command
  const { data, err } = await asyncSpawn({
    command: 'npm',
    args: ['run', command]
  })
  if (err) {
    res.send(formatAppsResult(null, err))
    return
  }
  res.send(formatAppsResult(data, null))
  return
})

app.ws('/ws/service', (ws: ws) => {
  ws.on('close', () => {
    // close process
  })
})



app.listen(5000)