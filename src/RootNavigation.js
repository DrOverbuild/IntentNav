import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function push(name, params) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}

export function reset() {
  navigationRef.current?.dispatch(CommonActions.reset());
}
