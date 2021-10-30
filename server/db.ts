import mongoose, { Schema, Types } from 'mongoose';
import { Recipe, RecipeRating } from '../objects/recipe';
import { User } from '../objects/User';
import { Ingredient } from '../objects/ingredient';

const UsersSchema = new Schema({
  login: { type: String, required: true },
  password: { type: String, required: true }
});

const RecipesSchema = new Schema({
  author: { type: String, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number },
  description: { type: String },
  ingredients: [
    //Ingredient[]
    { name: String, amount: Number, unit: String, selected: Boolean }
  ],
  createDate: { type: Date, required: true }
});

export interface DbUser extends Document {
  login: string;
  password: string;
  id: string;
}

export interface DbRecipe extends Document, Recipe {
  author: string;
}

const UsersModel = mongoose.model('Users', UsersSchema);
const RecipeModel = mongoose.model('Recipes', RecipesSchema);

const bcrypt = require('bcrypt');

export async function findUserByUsernameAndPass(
  login: string,
  password: string
): Promise<DbUser | null> {
  let user = await UsersModel.findOne()
    .where('login')
    .regex(new RegExp(login, 'i'));

  return new Promise<DbUser>((resolve, reject) => {
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

function generateSortString(sortDef: SortInfo[] | null): string | null {
  if (!sortDef) {
    return '';
  }
  return sortDef
    .filter(
      (s) =>
        !!s.direction &&
        !!s.property &&
        s.direction !== 'null' &&
        s.property !== 'null'
    )
    .map((s) => {
      return `${s.direction === 'DESC' ? '-' : ''}${s.property}`;
    })
    .join(' ');
}

export async function findRecipesForUser(
  username: string,
  sortDef: SortInfo[] | null
): Promise<DbRecipe[]> {
  let sortString = `${generateSortString(sortDef)} id`.trim();

  let recipes = await RecipeModel.find()
    .where('author')
    .equals(username)
    .sort(sortString);
  return recipes;
}

export async function findAllUsers(): Promise<Array<DbUser>> {
  let users = await UsersModel.find({});
  return users;
}

export async function createRecipe(recipe: Recipe) {
  //TODO
}
