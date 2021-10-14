import { Request, Response, NextFunction } from 'express';
import { Recipe } from '../objects/recipe';

const router = require('express').Router();

let recipes: Recipe[] = [
  {
    id: 1,
    name: 'Ja som recept 1',
    rating: 1,
    createDate: new Date(),
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse est augue, iaculis id ex non, commodo ornare quam. Sed a ante euismod, auctor massa non, congue arcu. Curabitur placerat lectus sit amet erat porttitor viverra. Quisque molestie purus eu sem tincidunt, id luctus lacus ullamcorper. Phasellus sed efficitur nulla, quis laoreet lectus. Quisque commodo eros sed sagittis dignissim. Proin in orci lobortis, dapibus justo eu, faucibus metus. Nam porta ultrices risus, sed fermentum dui ultricies quis. Mauris aliquam dui sit amet orci fringilla, sed accumsan libero vulputate. Aliquam pretium mi vel justo tincidunt pulvinar. Duis quis erat sit amet enim iaculis iaculis sed ut massa. Duis ultricies quam nec purus sodales fringilla. Sed interdum egestas elit.',
    ingredients: [
      {
        name: 'jablko',
        amount: 2,
        unit: 'pcs'
      },
      {
        name: 'muka',
        amount: 1600,
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
        amount: 200,
        unit: 'ml'
      },
      {
        name: 'jablko',
        amount: 1000,
        unit: 'g'
      }
    ]
  }
];

router.get('/recipes', function (req: Request, res: Response, next) {
  console.log('adad');
  res.json(recipes);
});

router.get('/recipes/:id', function (req: Request, res: Response, next) {
  let id = Number(req.params.id);
  let rec = recipes.find((r) => r.id === id);
  if (!rec) {
    res.status(404).send('Recipe not found');
  } else {
    res.json(rec);
  }
});


router.get('/ingredients', function (req: Request, res: Response, next) {
  let allIngredients = recipes.flatMap(r=>r.ingredients);
  let result = allIngredients.map(ingr=>ingr.name.toLowerCase()).reduce((total, value) => {
    total[value] = (total[value] ?? 0) + 1;
    return total;
  }, {});
  res.json(result);
});


router.put('/recipes/:id', function (req: Request, res: Response, next) {
  let id = Number(req.params.id);
  let recIndex = recipes.findIndex((r) => r.id === id);
  recipes.splice(recIndex, 1, req.body);
  res.json(recipes);
});

router.post('/recipes', function (req: Request, res: Response, next) {
  let newRecipe = req.body;
  recipes.push(newRecipe);
  res.json(recipes);
});

module.exports = router;
