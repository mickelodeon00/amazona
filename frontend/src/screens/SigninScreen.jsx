import React from 'react';
import { Helmet } from 'react-helmet-async';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';

const SigninScreen = () => {
  const { search } = useLocation();
  const redirectUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectUrl ? redirectUrl : '/';

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <div>
        <h1 className="my-3">Sign In</h1>
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label> Email</Form.Label>
          <Form.Control type="email" required></Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label> Password</Form.Label>
          <Form.Control type="password" required></Form.Control>
        </Form.Group>
      </Form>
      <div className="mb-3">
        <Button type="submit"> Sign in </Button>
      </div>
      <div className="mb-3">
        New customer?
        <Link to={`/signup?redirect${redirect}`}>Create your account </Link>
      </div>
    </Container>
  );
};

export default SigninScreen;
