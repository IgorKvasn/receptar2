import { findUserByUsernameAndPass } from './db';

export function auth(username, password, cb) {
  findUserByUsernameAndPass(username, password).then((user) => {
    cb(null, !!user);
  });
}
