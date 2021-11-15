import React, { FormEvent, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../redux/redux-hooks';
import { setLoggedUserToken } from '../redux/slices/userSlice';

interface LoginProps {}

export default function Login({}: LoginProps) {
  const usernameInput = useRef<HTMLInputElement>();
  const passwordInput = useRef<HTMLInputElement>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function doLogin(e: FormEvent) {
    e.preventDefault();
    try {
      let response = await axios.post('/api/login', {
        username: usernameInput.current!.value,
        password: passwordInput.current!.value
      });

      // @ts-ignore
      const { token } = response.data;

      dispatch(setLoggedUserToken(token));
      const { returnUrl } = router.query;
      let url = returnUrl as string;
      if (!returnUrl) {
        url = '/';
      }
      router.push(url);
    } catch (e) {
      alert('chyba prihlasenia');
      console.log('login error', e);
    }
  }

  return (
    <>
      <form onSubmit={(e) => doLogin(e)}>
        <div className='field'>
          <label className='label'>Meno:</label>
          <div className='control'>
            <input className='input' type='text' ref={usernameInput} />
          </div>
        </div>

        <div className='field'>
          <label className='label'>Heslo:</label>
          <div className='control'>
            <input className='input' type='password' ref={passwordInput} />
          </div>
        </div>

        <div className='field is-grouped'>
          <div className='control'>
            <button type='submit' className='button is-link'>
              Prihlásiť
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
