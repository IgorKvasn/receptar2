import express, { Request, Response } from 'express';
import next from 'next';
import mongoose from 'mongoose';

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

    server.use('/api', require('./api'));

    server.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    //init DB
    let url = process.env.DATABASE_URL;
    await mongoose.connect(url);
    console.log('DB connected');
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    process.on('SIGINT', function () {
      mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
      });
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
