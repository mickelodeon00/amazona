import React, { useContext } from 'react';
import { Navigate, Routes } from 'react-router-dom';
import { Store } from '../Store';

export const AdminRoutes = ({ children }) => {
  const { state } = useContext(Store);
  const { user } = state;
  return user ? (
    user.isAdmin ? (
      <Routes>{children}</Routes>
    ) : (
      <Navigate to="/signin" />
    )
  ) : (
    <Navigate to="/signin" />
  );
};
