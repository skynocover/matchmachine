import 'dotenv/config';

import path, { join } from 'path';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import session from 'express-session';
import { backendSession } from './middleware/session';
import { account } from './routers/account';
import { model } from './routers/model';
import { MyRoom } from './routers/room';
import http from 'http';
import { Server, LobbyRoom } from 'colyseus';

declare module 'express-session' {
  interface SessionData {
    user: { account: string };
  }
}

const app = express();

const staticPath = join(__dirname, '../public');
console.log(`Using static path '${staticPath}'`);
app.use(express.static(staticPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/echo', (req, res) => {
  res.json({ env: process.env.NODE_ENV, echo: 'echo' });
});

const server = http.createServer(app);
const gameServer = new Server({
  server,
});

gameServer.define('lobby', LobbyRoom);

// register our TetrolyseusRoom
gameServer.define('my_room', MyRoom).enableRealtimeListing();

const port = +(process.env.PORT || 3000);

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
