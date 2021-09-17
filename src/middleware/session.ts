import { Request, Response, NextFunction, Router } from 'express';
import { Resp } from '../resp/resp';
import * as credotlog from 'credotlog';

export const backendSession = async (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'development') {
    credotlog.colorlog(`session: ${JSON.stringify(req.session.user)}`, 'debug');
    if (!req.session.user) {
      res.clearCookie('user');
      res.json(Resp.backendCheckSessionFail);
      return;
    }
  } else {
    req.session.user = { account: 'admin' };
  }
  next();
};
