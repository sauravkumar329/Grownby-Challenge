import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './components/navigation/AuthNavigator';
import './config/firebase';
import AuthContext from './components/auth/context';
import AppNavigator from './components/navigation/AppNavigator';
import authStorage from './components/auth/storage';


export default function App() {
  const [user,setuser]= useState <string>()
  const restoreUser = async ()=>{
    const user = await authStorage.getUser()
    if(!user) return;
    setuser(user)

}
useEffect(()=>{
  restoreUser()
},[])
    return (
    <AuthContext.Provider value={{user,setuser}}>
    <NavigationContainer>
      {user ? <AppNavigator/> : <AuthNavigator/> }
    </NavigationContainer>
    </AuthContext.Provider>
  );
}


