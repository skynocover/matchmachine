import express from 'express';
import sha256 from 'crypto-js/sha256';
import dayjs from 'dayjs';

import { Resp } from '../resp/resp';
import { prisma } from '../database/db';
import * as credotlog from 'credotlog';

const routes = express.Router();

routes.post('/login', async (req, res) => {
  try {
    // colorlog(`id:  ${req.body.id}`, 'debug');
    let user = await prisma.users.findFirst({ where: { id: req.body.id } });
    if (!user) {
      res.status(200).json(Resp.UserNotExist);
      return;
    }
    if (user.password !== sha256(req.body.password).toString()) {
      res.status(200).json(Resp.LoginFail);
      return;
    }
    let sign = { account: user.account };
    req.session.user = sign;
    res.cookie('user', JSON.stringify(sign), {
      httpOnly: false,
      expires: dayjs().add(1, 'hour').toDate(),
    });
    res.status(200).json(Resp.success);
  } catch (error: any) {
    credotlog.log('Err', `user login fail, error: ${error.message}`);
    res.status(200).json({ ...Resp.sqlQueryFail, error });
  }
});

routes.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('user');
    res.status(200).json(Resp.success);
  });
});

export { routes as account };
