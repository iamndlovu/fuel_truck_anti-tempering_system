import React, { useState } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import {Routes,Route,Link,useNavigate} from 'react-router-dom';



export const useAuth = () => {
  const loggedIn = localStorage.getItem('token')
  console.log(loggedIn)
  return loggedIn;
};
export const login =(token)=>{
    console.log("tere")
    localStorage.setItem('token',token)
}
export const logout =()=>{
  console.log('logged out')
    localStorage.setItem('token', null)
 
}
const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/authentication/sign-in" />;
};

export default ProtectedRoutes;
