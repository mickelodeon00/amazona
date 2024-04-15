import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SearchBox() {
  const location = useLocation();
  const inputRef = useRef();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/search' && inputRef.current) {
      setQuery('');
      inputRef.current.value = '';
    }
  }, [location]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search?query=${query}` : '/search');
  };

  return (
    <div>
      <Form onSubmit={submitHandler}>
        <InputGroup>
          <Form.Control
            type="text"
            name="q"
            id="q"
            ref={inputRef}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search products..."
            aria-label="search products"
            aria-describedby="button-search"
          ></Form.Control>
          <Button variant="outline-primary" type="submit" id="button-search">
            <i className="fas fa-search"></i>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}
