import express, { Request, Response, NextFunction } from 'express';
import { Resp } from '../resp/resp';
import * as credotlog from 'credotlog';

const routes = express.Router();

// redirect
routes.get('/redirect', async (req, res) => {
  res.status(200).json(Resp.success);
});

routes.get('/modelData', async (req, res: Response) => {
  try {
    res.json({ ...Resp.success });
  } catch (error: any) {
    credotlog.log('Err', `get model data fail, error: ${error.message}`);
    res.json({ ...Resp.sqlExecFail, error: error.message });
  }
});

export { routes as model };
