import { Ingredient, Prisma, Recipe, User } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const bcrypt = require('bcrypt');
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    },
    {
      emit: 'stdout',
      level: 'error'
    },
    {
      emit: 'stdout',
      level: 'info'
    },
    {
      emit: 'stdout',
      level: 'warn'
    }
  ]
});
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params:', e.params);
  // console.log('Duration: ' + e.duration + 'ms');
});

export async function findUserByUsernameAndPass(
  login: string,
  password: string
): Promise<User | null> {
  let user = await prisma.user.findFirst({
    where: {
      name: login.toLowerCase()
    }
  });

  return new Promise<User | null>((resolve, reject) => {
    if (user === null) {
      resolve(null);
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        reject(err);
      } else {
        if (result === true) {
          resolve(user);
        } else {
          resolve(null);
        }
      }
    });
  });
}

export type SortInfo = { property: string; direction: 'ASC' | 'DESC' | 'null' };

export async function findRecipesForUser(
  userName: string,
  sortDef: SortInfo[] | null,
  ingredients?: string[]
): Promise<Recipe[]> {
  let sortObj = {
    createDate: 'desc'
  } as Prisma.Enumerable<Prisma.RecipeOrderByWithRelationInput>;

  if (sortDef !== null) {
    sortDef.forEach((s) => {
      if (
        !!s.direction &&
        !!s.property &&
        s.direction !== 'null' &&
        s.property !== 'null'
      ) {
        sortObj[s.property] = s.direction.toLowerCase();
      }
    });
  }

  if (!ingredients || ingredients.length === 0) {
    return await prisma.recipe.findMany({
      where: {
        authorName: userName
      },
      orderBy: sortObj
    });
  } else {
    return await prisma.recipe.findMany({
      where: {
        authorName: userName,
        ingredients: {
          some: {
            name: {
              in: ingredients
            }
          }
        }
      },
      orderBy: sortObj,
      include: {
        ingredients: true
      }
    });
  }
}

export async function findRecipeById(
  userName: string,
  recipeId: number
): Promise<Recipe> {
  return await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      authorName: userName
    },
    include: {
      ingredients: true
    }
  });
}

export async function findIngredients(
  userName: string
): Promise<{ name: string }[]> {
  let ingredientNames =
    await prisma.$queryRaw`select i.name from "Ingredient" i join "Recipe" r ON r.id = i."recipeId" where r."authorName"=${userName}`;
  return ingredientNames as { name: string }[];
}

export async function findAllUsers(): Promise<Array<User>> {
  return await prisma.user.findMany();
}

export async function createRecipe(
  userName: string,
  recipe: Recipe
): Promise<Recipe> {
  recipe.authorName = userName;
  return await prisma.recipe.create({ data: recipe });
}

export type RecipeWithIngredients = Recipe & { ingredients: Ingredient[] };

export async function updateRecipe(
  userName: string,
  recipeId: number,
  recipe: RecipeWithIngredients
): Promise<any> {
  let ingredientsQuery = recipe.ingredients.map((ingr) => {
    if (ingr.id === null || typeof ingr.id === 'undefined') {
      return prisma.ingredient.create({
        data: ingr
      });
    } else {
      if (ingr.recipeId === null || typeof ingr.recipeId === 'undefined') {
        return prisma.ingredient.delete({
          where: {
            id: ingr.id
          }
        });
      }
      return prisma.ingredient.update({
        where: {
          id: ingr.id
        },
        data: ingr
      });
    }
  });

  delete recipe['ingredients'];

  return await prisma.$transaction([
    prisma.recipe.update({
      where: {
        id: recipeId
      },
      data: recipe as Recipe
    }),
    ...ingredientsQuery
  ]);
}
