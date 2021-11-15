import { Request, Response } from 'express';
import { removeAccents } from './string-utils';
import {
  createRecipe,
  findAllUsers,
  findIngredients,
  findRecipeById,
  findRecipesForUser,
  findUserByUsernameAndPass,
  SortInfo,
  updateRecipe
} from './db';
import { Ingredient, Recipe, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { auth, JWT_KEY, NextApiRequestWithUser } from '../utils/secrets';
const router = require('express').Router();

router.post(
  '/login',
  async function (req: NextApiRequest, res: NextApiResponse, next) {
    if (!req.body) {
      res.statusCode = 404;
      res.end('Error');
      return;
    }
    const { username, password } = req.body;
    const logged = await findUserByUsernameAndPass(username, password);
    if (!logged) {
      res.status(403).end();
    } else {
      res.json({
        token: jwt.sign(
          {
            username,
            role: logged.role
          },
          JWT_KEY
        )
      });
    }
  }
);

router.get(
  '/recipes',
  auth(async function (req: NextApiRequestWithUser, res: NextApiResponse) {
    let sortColumn = req.query.sortColumn;
    let sortOrder = req.query.sortOrder;

    let sort = sortColumn
      ? [
          {
            property: sortColumn as string,
            direction: sortOrder as 'ASC' | 'DESC' | 'null'
          } as SortInfo
        ]
      : null;
    // @ts-ignore
    let recipes = await findRecipesForUser(req.user.username, sort);
    res.json(recipes);
  })
);

router.get(
  '/recipes/ingredients',
  auth(async function (req: NextApiRequestWithUser, res: NextApiResponse) {
    // @ts-ignore

    let sortColumn = req.query.sortColumn;
    let sortOrder = req.query.sortOrder;

    let sort = sortColumn
      ? [
          {
            property: sortColumn as string,
            direction: sortOrder as 'ASC' | 'DESC' | 'null'
          } as SortInfo
        ]
      : null;

    let ingredients = (req.query.ingredients as string[]) ?? undefined;

    let recipes = await findRecipesForUser(
      req.user.username,
      sort,
      ingredients
    );

    let result = recipes.map((r) => {
      return {
        recipe: r,
        found: foundIngredientsInRecipe(r, ingredients)
      };
    });

    res.json(result);
  })
);

function foundIngredientsInRecipe(r: Recipe, ingredients: string[]): number {
  // @ts-ignore
  return r.ingredients.reduce((acc, i: Ingredient) => {
    if (ingredients.includes(i.name)) {
      acc.push(i.name);
    }
    return acc;
  }, []);
}

function normalizeString(text: string): string {
  if (!text) return '';
  return removeAccents(text.trim().toLowerCase());
}

router.get(
  '/recipes/:id',
  auth(async function (req: NextApiRequestWithUser, res: NextApiResponse) {
    // @ts-ignore
    let rec = await findRecipeById(req.user.username, Number(req.params.id));
    if (!rec) {
      res.status(404).send('Recipe not found');
    } else {
      res.json(rec);
    }
  })
);

router.get(
  '/ingredients',
  auth(async function (req: NextApiRequestWithUser, res: NextApiResponse) {
    let allIngredients = await findIngredients(req.user.username);
    let result = allIngredients
      .map((ingr) => ingr.name.toLowerCase())
      .reduce((total, value) => {
        total[value] = (total[value] ?? 0) + 1;
        return total;
      }, {});
    res.json(result);
  })
);

router.put(
  '/recipes/:id',
  auth(async function (req: NextApiRequestWithUser, res: NextApiResponse) {
    // @ts-ignore
    let id = Number(req.params.id);
    if (isNaN(id)) {
      // @ts-ignore
      res.status(404).json({ error: `Invalid recipe ID=${req.params.id}` });
      return;
    }
    let data = await updateRecipe(req.user.username, id, req.body);
    res.json(data);
  })
);

router.post(
  '/recipes',
  auth(async function (req: NextApiRequestWithUser, res: NextApiResponse) {
    let newRecipe = req.body as Recipe;
    res.status(204).json(await createRecipe(req.user.username, newRecipe));
  })
);

module.exports = router;
