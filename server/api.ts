import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../objects/recipe';

const router = require('express').Router();

let number = 0;
let recipes: Recipe[] = [
  {
    id: 1,
    name: 'Ja som recept 1',
    rating: 1,
    createDate: new Date(),
    description: 'Vsetko dame dokopy, zamiesame a hotovo...',
    ingredients: [
      {
        name: 'jablko',
        volume: 2,
        unit: 'pcs'
      },
      {
        name: 'muka',
        volume: 1600,
        unit: 'g'
      }
    ]
  },
  {
    id: 2,
    name: 'Ja som recept 2',
    createDate: new Date(),
    rating: 0,
    description: 'Druhy recept ...',
    ingredients: [
      {
        name: 'voda',
        volume: 200,
        unit: 'ml'
      }
    ]
  }
];

router.get('/recipes', function (req: Request, res: Response, next) {
  res.json(recipes);
});

router.post('/recipes', function (req: Request, res: Response, next) {
  let newRecipe = req.body;
  recipes.push(newRecipe);
  res.json(recipes);
});

module.exports = router;
