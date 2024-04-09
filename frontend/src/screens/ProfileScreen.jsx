import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getError } from '../utils';
import { useContext } from 'react';
import { Store } from '../Store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../ApiUrl';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) navigate('/signin');
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password Do Not Match');
    } else {
      try {
        const { data } = await axios.put(
          `${API_URL}/users/profile`,
          {
            name,
            email,
            password,
          },
          {
            headers: {
              authorization: `BEARER ${user.token}`,
            },
          }
        );
        ctxDispatch({
          type: 'USER_SIGNIN',
          payload: data,
        });
        localStorage.setItem('user', JSON.stringify(data));
        toast.success('User updated successfully');
      } catch (err) {
        toast.error(getError(err));
      }
    }
  };
  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label> Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label> Email</Form.Label>
          <Form.Control
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label> Password</Form.Label>
          <Form.Control
            // value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          ></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label> Confirm Password</Form.Label>
          <Form.Control
            // value={confirmPassword}
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <div>
          <Button type="submit">Update</Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfileScreen;
