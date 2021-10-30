import { Request, Response } from 'express';
import { Recipe } from '../objects/recipe';
import { removeAccents } from './string-utils';
import {
  createRecipe,
  findAllUsers,
  findRecipesForUser,
  findUserByUsernameAndPass,
  SortInfo
} from './db';

const router = require('express').Router();

let recipes: Recipe[] = [
  /*
  {
    id: '1',
    name: 'aJa som recept 1',
    rating: 3,
    createDate: new Date(),
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse est augue, iaculis id ex non, commodo ornare quam. Sed a ante euismod, auctor massa non, congue arcu. Curabitur placerat lectus sit amet erat porttitor viverra. Quisque molestie purus eu sem tincidunt, id luctus lacus ullamcorper. Phasellus sed efficitur nulla, quis laoreet lectus. Quisque commodo eros sed sagittis dignissim. Proin in orci lobortis, dapibus justo eu, faucibus metus. Nam porta ultrices risus, sed fermentum dui ultricies quis. Mauris aliquam dui sit amet orci fringilla, sed accumsan libero vulputate. Aliquam pretium mi vel justo tincidunt pulvinar. Duis quis erat sit amet enim iaculis iaculis sed ut massa. Duis ultricies quam nec purus sodales fringilla. Sed interdum egestas elit.',
    ingredients: [
      {
        name: 'JablKO',
        amount: 2,
        unit: 'pcs'
      },
      {
        name: 'múka',
        amount: 1600,
        unit: 'g'
      }
    ]
  },
  {
    id: '2',
    name: 'cJa som recept 2',
    createDate: new Date(),
    rating: 1,
    description: 'Druhy recept ...',
    ingredients: [
      {
        name: 'voda',
        amount: 200,
        unit: 'ml'
      },
      {
        name: 'jablko',
        amount: 1000,
        unit: 'g'
      }
    ]
  },
  {
    id: '3',
    name: 'bJa som recept 0',
    createDate: new Date(),
    rating: 2,
    description: 'Nulty recept ...',
    ingredients: [
      {
        name: 'voda',
        amount: 200,
        unit: 'ml'
      },
      {
        name: 'jablko',
        amount: 1000,
        unit: 'g'
      }
    ]
  }*/
];

router.get('/recipes', async function (req: Request, res: Response, next) {
  // @ts-ignore
  let user = req.auth.user;

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

  let recipes = await findRecipesForUser(user, sort);
  res.json(recipes);

  /* let ingredients = req.query.ingredients as string[];
  let result: Recipe[];
  if (
    ingredients === null ||
    typeof ingredients === 'undefined' ||
    ingredients.length === 0
  ) {
    //filter
    let nameQuery = normalizeString((req.query.name as string) ?? '');
    let result = recipes.filter((r) =>
      normalizeString(r.name).includes(nameQuery)
    );

    //sort
    let sortColumn = req.query.sortColumn;
    let sortOrder = req.query.sortOrder;

    result = result.sort((r1, r2) => {
      return r1.id.localeCompare(r2.id);
    });
    res.json(result);
  } else {
    let result = recipes
      .map((r) => {
        let found = [];
        ingredients.forEach((ingr) => {
          let has = hasIngredientInRecipe(ingr, r);
          if (has) {
            found.push(ingr);
          }
        });
        if (Object.keys(found).length > 0) {
          return {
            recipe: r,
            found
          };
        } else {
          return null;
        }
      })
      .filter((o) => o !== null);
    result = result.sort((r1, r2) => {
      if (r2!.found.length === r1!.found.length) {
        return r2.recipe.id.localeCompare(r1.recipe.id);
      }
      return r2!.found.length - r1!.found.length;
    });
    res.json(result);
  }*/
});

function hasIngredientInRecipe(ingredient: string, recipe: Recipe): boolean {
  return !!recipe.ingredients.find((ingr) => {
    return normalizeString(ingr.name) === normalizeString(ingredient);
  });
}

function normalizeString(text: string): string {
  if (!text) return '';
  return removeAccents(text.trim().toLowerCase());
}

router.get('/recipes/:id', function (req: Request, res: Response, next) {
  let id = String(req.params.id);
  let rec = recipes.find((r) => r.id === id);
  if (!rec) {
    res.status(404).send('Recipe not found');
  } else {
    res.json(rec);
  }
});

router.get('/ingredients', function (req: Request, res: Response, next) {
  let allIngredients = recipes.flatMap((r) => r.ingredients);
  let result = allIngredients
    .map((ingr) => ingr.name.toLowerCase())
    .reduce((total, value) => {
      total[value] = (total[value] ?? 0) + 1;
      return total;
    }, {});
  res.json(result);
});

router.put('/recipes/:id', function (req: Request, res: Response, next) {
  let id = String(req.params.id);
  let recIndex = recipes.findIndex((r) => r.id === id);
  recipes.splice(recIndex, 1, req.body);
  res.json(recipes);
});

router.post('/recipes', function (req: Request, res: Response, next) {
  let newRecipe = req.body as Recipe;
  recipes.push(newRecipe);
  res.json(recipes);
});

router.get('/test', async function (req: Request, res: Response, next) {
  debugger;
  let user1 = await findUserByUsernameAndPass('igor', 'heslo');
  console.log('user1', user1);
  debugger;
  let user2 = await findUserByUsernameAndPass('igor', 'heslo2');
  debugger;
  let user3 = await findUserByUsernameAndPass('igor3', 'heslo');
  debugger;
  let users = await findAllUsers();
  // console.log('users', users);
  debugger;
  res.json({ ok: 1 });
});

module.exports = router;
