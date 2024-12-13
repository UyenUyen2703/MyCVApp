import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { checkSignInStatus } from '../utils/auth';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';

const AppRouter = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <NavigationContainer>
      {user && user.data ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default AppRouter

const styles = StyleSheet.create({})