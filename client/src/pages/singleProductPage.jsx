import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import "./singleProduct.css";
import Divider from '../components/divider';

const SingleProductPage = () => {
  const { productId } = useParams();
  const { port, cart, addToCart } = useAuth();
  const [product, setProduct] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${port}/product/product/${productId}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [port, productId]);

  useEffect(() => {
    if (product) {
      const fetchPhoto = async () => {
        try {
          const response = await axios.get(`${port}/product/photo/${product._id}`, { responseType: 'blob' });
          const imageUrl = URL.createObjectURL(response.data);
          setPhoto(imageUrl);
        } catch (error) {
          console.log(error);
        }
      };

      fetchPhoto();
    }
  }, [port, product]);

  useEffect(() => {
    if (product) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await axios.get(`${port}/product/related-products/${productId}/${product.category._id}/${product.subcategory._id}`);
          const productsWithImages = await Promise.all(response.data.products.map(async (relatedProduct) => ({
            ...relatedProduct,
            imageUrl: `${port}/product/photo/${relatedProduct._id}`
          })));
          setRelatedProducts(productsWithImages);
        } catch (error) {
          console.error('Error fetching related products:', error);
        }
      };

      fetchRelatedProducts();
    }
  }, [port, product, productId]);


  const handleBuy = (p)=>{
    addToCart(p);
  }


  if (!product || !photo) {
    return <div className="container mx-auto p-4 h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="singleProduct-container">
      <div className="product-box" style={{ marginBottom: "3rem" }}>
        <figure className='fig'>
          <img src={photo} alt={product.name} className="img" />
        </figure>
        <div className="detail-box">
          <h1>{product.name}</h1>
          <h2>{product.description}</h2>
          <div className="price-box">
            <h1>Price:</h1>
            <FaRupeeSign />
            <h2>{product.price}</h2>
          </div>
          <button className="btn btn-primary" onClick={() => handleBuy(product)}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
      
      <Divider />
      
      <div className="similar-products">
        <h2>Similar Products</h2>
        <div className="similar-products-list">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct._id} product={relatedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, port } = useAuth();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(`${port}/product/photo/${product._id}`, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        setPhoto(imageUrl);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPhoto();
  }, [port, product]);

  if (!product) {
    return null;
  }

  const handleInfo = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="product-card" style={{ maxHeight: "auto" }}>
      <figure className="product-image">
        <img src={photo} alt={product.name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title" style={{ fontSize: "0.7rem" }}>{product.name}</h2>
        <div className="card-price">
          <FaRupeeSign />
          <span>{product.price}</span>
        </div>
        <div className="card-actions">
          <NavLink to={`/product/${product._id}`} className="info">More Info</NavLink>
          <button className="btn btn-primary" onClick={handleBuyNowClick}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
