import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const SellerProductEditScreen = () => {
  const { id: productId } = useParams();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        title,
        price,
        image,
        category,
        condition,
        status,
        description,
      }).unwrap(); 
      toast.success('Listing updated');
      refetch();
      navigate('/seller/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category);
      setCondition(product.condition);
      setStatus(product.status);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/seller/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Listing</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                label='Choose File'
                onChange={uploadFileHandler}
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group className='my-2' controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value=''>Select Category</option>
                <option value='Electronics'>Electronics</option>
                <option value='Books'>Books</option>
                <option value='Furniture'>Furniture</option>
                <option value='Clothing'>Clothing</option>
                <option value='Other'>Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='my-2' controlId='condition'>
              <Form.Label>Condition</Form.Label>
              <Form.Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value=''>Select Condition</option>
                <option value='Brand New'>Brand New</option>
                <option value='Like New'>Like New</option>
                <option value='Used (Good)'>Used (Good)</option>
                <option value='Used (Fair)'>Used (Fair)</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className='my-2' controlId='status'>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value='Available'>Available</option>
                <option value='Sold'>Sold</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='my-2' controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default SellerProductEditScreen;
