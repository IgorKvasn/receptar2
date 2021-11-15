import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { LoggedUser } from '../../../utils/secrets';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

export const LOGGED_COOKIE_NAME = 'receptar-token';

// Define a type for the slice state
interface UserState {
  loggedUser?: LoggedUser;
  jwtToken?: string;
}

// Define the initial state using that type
const initialState: UserState = {
  loggedUser: null,
  jwtToken: null
};

export const userSlice = createSlice({
  name: 'loggedUser',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoggedUserToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      if (!token) {
        state.loggedUser = null;
        state.jwtToken = null;
        Cookies.remove(LOGGED_COOKIE_NAME);
      } else {
        state.loggedUser = jwt.decode(token) as LoggedUser;
        state.jwtToken = token;
        Cookies.set(LOGGED_COOKIE_NAME, token, { secure: true });
      }
    },
    logoutUser: (state, action: PayloadAction<LoggedUser>) => {
      state.loggedUser = null;
      state.jwtToken = null;
      Cookies.remove(LOGGED_COOKIE_NAME);
    }
  }
});

export const { setLoggedUserToken, logoutUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default userSlice.reducer;
