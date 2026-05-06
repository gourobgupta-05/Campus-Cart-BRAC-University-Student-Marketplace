import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded h-100 d-flex flex-column'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.title}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <div className="my-2">
            <strong>Condition:</strong> {product.condition}
          </div>
        </Card.Text>

        <Card.Text as='h3' className='mt-auto'>Tk {product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
