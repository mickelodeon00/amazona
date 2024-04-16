import React, { useContext } from 'react';
import { Navigate, Routes } from 'react-router-dom';
import { Store } from '../Store';

export const ProtectedRoutes = ({ children }) => {
  const { state } = useContext(Store);
  const { user } = state;
  return user ? <Routes>{children}</Routes> : <Navigate to="/signin" />;
};
