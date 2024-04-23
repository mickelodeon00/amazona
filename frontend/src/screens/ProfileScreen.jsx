import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
import { useReducer } from 'react';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'IMAGE_FECTH':
      return { ...state, loadingImage: true };
    case 'IMAGE_SUCCESS':
      return { ...state, loadingImage: false };
    case 'IMAGE_FAIL':
      return { ...state, loadingImage: false };
    default:
      return state;
  }
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { user } = state;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [file, setFile] = useState('');
  const [image, setImage] = useState(user.image);
  const [{ loadingImage, error }, dispatch] = useReducer(reducer, {
    loadingImage: false,
    error: '',
  });

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

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    // setImage(URL.createObjectURL(e.target.files[0]));
  };

  const uplaodImageHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) {
      dispatch({ type: 'IMAGE_FECTH' });
      try {
        formData.append('file', file);
        formData.append(
          'upload_preset',
          `${process.env.REACT_APP_UPLOAD_PRESET}`
        );
        const { data: cloudData } = await axios.post(
          `${process.env.REACT_APP_CLOUDINARY_URL}`,
          formData
        );
        const imgUrl = cloudData?.secure_url;

        const { data } = await axios.put(
          `${API_URL}/users/profile`,
          {
            image: imgUrl,
          },
          {
            headers: {
              authorization: `BEARER ${user.token}`,
            },
          }
        );
        setImage(data?.image);
        ctxDispatch({
          type: 'USER_SIGNIN',
          payload: data,
        });
        localStorage.setItem('user', JSON.stringify(data));
        dispatch({ type: 'IMAGE_SUCCESS' });
        toast.success('Image Uploaded Successfully');
      } catch (err) {
        dispatch({ type: 'IMAGE_FAIL' });
        toast.error(getError(err));
      }
    } else {
      toast.error('No image selected');
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3">User Profile</h1>
      <Row className="mb-3">
        <Col md={8} className="">
          <div className="">
            <img src={image} className=" image-profile " alt="profile" />
          </div>
        </Col>
        <Col md={4}>
          <Form onSubmit={uplaodImageHandler}>
            <Form.Label>Photo:</Form.Label>
            <Form.Control
              className="mb-2"
              type="file"
              onChange={handleFile}
            ></Form.Control>
            {loadingImage ? (
              <LoadingBox />
            ) : (
              <Button type="submit">Upload Image</Button>
            )}
          </Form>
        </Col>
      </Row>
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
