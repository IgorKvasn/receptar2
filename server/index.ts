import express, { Request, Response } from 'express';
import cors from 'cors';
import next from 'next';
import { auth } from './auth';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();

    server.use(express.json());

    //artificially delay all requests
    /* server.use(function (req, res, next) {
      setTimeout(next, 3000);
    }); */

    server.use(cors());

    server.use('/api', require('./api'));

    server.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    //--------

    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
