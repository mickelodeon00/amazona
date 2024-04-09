import React, { useContext, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { dateFormat, getError, roundTo } from '../utils';
import axios from 'axios';
import { Store } from '../Store';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const OrderHistoryScreen = () => {
  const navigate = useNavigate();
  // const [orders, setOrders] = useState([]);
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });
  const { state } = useContext(Store);
  const { user } = state;

  const detailsHandler = (order) => {
    navigate(`/order/${order._id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get('/api/orders', {
          headers: {
            authorization: `BEARER ${user.token}`,
          },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        console.log(getError(err));
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [user, dispatch]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{dateFormat(order.createdAt)}</td>
                  <td>{roundTo(order.totalPrice, 2)}</td>
                  <td>{order.isPaid ? dateFormat(order.paidAt) : 'No'}</td>
                  <td>
                    {order.isDelivered ? dateFormat(order.deliveredAt) : 'No'}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      onClick={() => detailsHandler(order)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryScreen;
