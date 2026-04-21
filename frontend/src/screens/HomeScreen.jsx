import { useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const [category, setCategory] = useState('');

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
  });

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Latest Products</h1>
        <Form.Select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '250px' }}
        >
          <option value=''>All Categories</option>
          <option value='Electronics'>Electronics</option>
          <option value='Books'>Books</option>
          <option value='Furniture'>Furniture</option>
          <option value='Clothing'>Clothing</option>
          <option value='Other'>Other</option>
        </Form.Select>
      </div>

      {keyword && (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta />
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
