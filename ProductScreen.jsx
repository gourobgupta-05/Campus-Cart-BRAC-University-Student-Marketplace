import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button
} from 'react-bootstrap';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';
import { useCreateReportMutation } from '../slices/reportsApiSlice';
import { toast } from 'react-toastify';
import { Modal, Form } from 'react-bootstrap';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  // For now we default to qty 1 since we aren't doing complex stock.
  const qty = 1;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const [createReport, { isLoading: isReporting }] = useCreateReportMutation();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const submitReportHandler = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error('Please enter a reason for reporting');
      return;
    }
    try {
      await createReport({ reportedProductId: productId, reason: reportReason }).unwrap();
      toast.success('Product reported successfully');
      setShowReportModal(false);
      setReportReason('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.title} description={product.description} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.title} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.title}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Condition:</strong> {product.condition}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Category:</strong> {product.category}
                </ListGroup.Item>
                <ListGroup.Item>Price: Tk {product.price}</ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
                {product.seller && (
                  <ListGroup.Item>
                    <strong>Listed by:</strong> {product.seller.name}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>Tk {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.status === 'Available' ? 'Available' : 'Sold'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid gap-2">
                      <Button
                        className='btn-block'
                        type='button'
                        disabled={product.status === 'Sold'}
                        onClick={addToCartHandler}
                      >
                         Request to Buy
                      </Button>
                      {(!userInfo || (product.seller && userInfo._id !== product.seller._id)) && (
                        <Button
                          className='btn-block'
                          type='button'
                          variant='secondary'
                          onClick={() => {
                            if (userInfo) {
                              navigate(`/chat/${product.seller._id}`);
                            } else {
                              navigate(`/login?redirect=/chat/${product.seller._id}`);
                            }
                          }}
                        >
                          Contact Seller
                        </Button>
                      )}
                      
                      {userInfo && (!product.seller || userInfo._id !== product.seller._id) && (
                        <Button
                          className='btn-block mt-2'
                          type='button'
                          variant='outline-danger'
                          onClick={() => setShowReportModal(true)}
                        >
                          Report Product
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Report Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={submitReportHandler}>
                <Form.Group controlId='reportReason' className='my-2'>
                  <Form.Label>Reason for reporting</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    placeholder='Why are you reporting this product?'
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <div className='d-flex justify-content-end mt-3'>
                  <Button variant='secondary' onClick={() => setShowReportModal(false)} className='me-2'>
                    Cancel
                  </Button>
                  <Button type='submit' variant='danger' disabled={isReporting}>
                    {isReporting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProductScreen;
