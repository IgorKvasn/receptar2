import mongoose, { Schema, Types } from 'mongoose';
import { Recipe } from '../objects/recipe';
import { User } from '../objects/User';

const UsersSchema = new Schema({
  login: { type: String },
  password: { type: String }
});

interface DbUsers extends Document {
  login: string;
  password: string;
  id: string;
}

const UsersModel = mongoose.model('Users', UsersSchema);

/*
export function findRecipesForUser(user: string): PrismaPromise<DbRecipe[]> {
  return prisma.dbRecipe.findMany({
    where: {
      user: {
        equals: user,
        mode: 'insensitive'
      }
    }
  });
}
*/
export async function loginUser(
  login: string,
  password: string
): Promise<DbUsers> {
  let user = await UsersModel.findOne()
    .where('password')
    .equals(password)
    .where('login')
    .regex(new RegExp(login, 'i'));
  return user;
}

export async function findAllUsers(): Promise<Array<DbUsers>> {
  let users = await UsersModel.find({});
  return users;
}

export async function createRecipe(recipe: Recipe) {
  //TODO
}
