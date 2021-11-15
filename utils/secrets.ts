import { Role } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export type LoggedUser = { username: string; role: Role };
export type NextApiRequestWithUser = NextApiRequest & { user: LoggedUser };

const AUTH_HEADER = /^Bearer (.+)$/;
export const JWT_KEY = 'lkshvf;ljnsxvljklfdf4s';

export function auth(
  handler: (
    req: NextApiRequestWithUser,
    resp: NextApiResponse
  ) => any | Promise<any>
): any | Promise<any> {
  function parseJwtToken(req: NextApiRequestWithUser): LoggedUser | null {
    if (!req.headers || !req.headers['authorization']) {
      return null;
    }
    let authHeader = req.headers['authorization'] as string;
    let match = AUTH_HEADER.exec(authHeader);
    if (match == null) {
      return null;
    }

    let token = match[1];
    return jwt.verify(token, JWT_KEY) as LoggedUser;
  }

  return function (req: any, res) {
    let jwtUser = parseJwtToken(req);
    if (!jwtUser && req.route.path !== '/login') {
      return res.status(401).end();
    } else {
      req.user = jwtUser;
    }
    return handler(req, res);
  };
}
