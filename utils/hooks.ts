import { useEffect, useRef } from 'react';
import axios from 'axios';
import { getApiUrl } from './config';
import { useAppDispatch } from '../src/redux/redux-hooks';

export function useAfterReduxMutate(callback: Function, properties: any[]) {
  const propertyChanged = useRef(false);
  const dispatch = useAppDispatch();

  //save changes in recipe to server
  useEffect(() => {
    if (propertyChanged.current) {
      propertyChanged.current = false;
      callback();
    }
  }, properties);

  return function (reduxAction: any) {
    propertyChanged.current = true;
    dispatch(reduxAction);
  };
}
