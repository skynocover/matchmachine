import 'dotenv/config';

import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import session from 'express-session';
import { backendSession } from './middleware/session';
import { account } from './routers/account';
import { model } from './routers/model';

declare module 'express-session' {
  interface SessionData {
    user: { account: string };
  }
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/echo', (req, res) => {
  res.json({ env: process.env.NODE_ENV, echo: 'echo' });
});

const admin = express.Router();
admin.use(
  session({
    secret: process.env.SESSION_KEY || '32970dafd91350b91f34376e88531f86',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000 },
  }),
);
const checkSession = express.Router();
checkSession.use(backendSession);
checkSession.use(model);

admin.use(account);
admin.use(checkSession);
app.use('/api', admin);

app.listen(process.env.PORT, () => {
  console.log(new Date(), `env: ${process.env.NODE_ENV}`);
  console.log(new Date(), `version: ${process.env.VERSION}`);
  console.log(new Date(), `server listening on ${process.env.PORT}`);
});
