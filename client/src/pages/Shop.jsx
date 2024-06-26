import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./shop.css";
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { FaFilter, FaRupeeSign, FaShoppingCart } from "react-icons/fa";

function FilterComponent({ applyFilters }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [categoryChecked, setCategoryChecked] = useState([]);
  const [subCategoryChecked, setSubCategoryChecked] = useState([]);
  const [priceRange, setPriceRange] = useState(10000000);
  const { port } = useAuth();
  // Fetch categories and subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${port}/category/categories`);
        setCategories(response.data);
      } catch (error) {
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(`${port}/subcategory/get`);
        setSubCategories(response.data);
      } catch (error) {
      }
    };

    fetchCategories();
    fetchSubCategories();
  }, [port]);

  // Function to handle filter changes and apply filters
  const handleFilterChange = () => {
    applyFilters({ categoryChecked, subCategoryChecked, priceRange });
    setDrawerOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="drawer" style={{ marginTop: "50px" }}>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={drawerOpen} />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer" className="btn btn-primary drawer-button" onClick={handleDrawerToggle}>
          <FaFilter /> Filter
        </label>
      </div>
      <div className="drawer-side" style={{ marginTop: "60px", zIndex: "1" }}>
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay" onClick={handleDrawerToggle}></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <label htmlFor="my-drawer" className="btn btn-ghost drawer-button" onClick={handleDrawerToggle}>
            <FaFilter /> Cancel
          </label>
          <button onClick={handleFilterChange} className="btn btn-primary text-white py-2 px-4 mt-4 rounded-md">
            Apply Filters
          </button>
          <li className="text-lg font-semibold">Category</li>
          {categories.map(category => (
            <li key={category._id} className="py-2">
              <input
                type="checkbox"
                id={category._id}
                value={category._id}
                checked={categoryChecked.includes(category._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setCategoryChecked(prev => [...prev, e.target.value]);
                  } else {
                    setCategoryChecked(prev => prev.filter(id => id !== e.target.value));
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={category._id}>{category.name}</label>
            </li>
          ))}
          <li className="text-lg font-semibold">Subcategory</li>
          {subCategories.map(subCategory => (
            <li key={subCategory._id} className="py-2">
              <input
                type="checkbox"
                id={subCategory._id}
                value={subCategory._id}
                checked={subCategoryChecked.includes(subCategory._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSubCategoryChecked(prev => [...prev, e.target.value]);
                  } else {
                    setSubCategoryChecked(prev => prev.filter(id => id !== e.target.value));
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={subCategory._id}>{subCategory.name}</label>
            </li>
          ))}
          <li className="text-lg font-semibold">Price Range</li>
          <li className="py-2">
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="range range-success"
            />
            <p className="text-sm text-gray-600">Price: ${priceRange}</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useAuth();

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
    <div className="product-card" >
      <figure className="product-image">
        <img src={product.imageUrl} alt={product.name} />
      </figure>
      <div className="card-body">
        <h2 className="card-title" style={{fontSize:"0.7rem"}}>{product.name}</h2>
        <p className="card-price">
          <p><FaRupeeSign /></p>
          <p style={{marginLeft:"0px"}}> {product.price} </p>
        </p>
        <div className="card-actions">
        <NavLink to={`/product/${product._id}`} className="info">More Info </NavLink>
        </div>
      </div>
    </div>
   
  );
};


// Helper function to parse URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}


function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { port } = useAuth();
  const query = useQuery();

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${port}/product/products`, {
        method: "GET"
      });
      const data = await response.json();
      const productsWithImages = await Promise.all(data.products.map(product => ({
        ...product,
        imageUrl: `${port}/product/photo/${product._id}`
      })));
      setProducts(productsWithImages);
      applyInitialFilters(productsWithImages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const applyInitialFilters = (products) => {
    const category = query.get('category');
    const subcategory = query.get('subcategory');
    const search = query.get('search');
  
    let filteredProducts = products;
  
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.name.toLowerCase() === category.toLowerCase()
      );
    }
  
    if (subcategory) {
      filteredProducts = filteredProducts.filter(product =>
        product.subcategory.name.toLowerCase() === subcategory.toLowerCase()
      );
    }
  
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.name.toLowerCase().includes(searchTerm) ||
        product.subcategory.name.toLowerCase().includes(searchTerm)
      );
    }
  
    setFilteredProducts(filteredProducts);
  };

  useEffect(() => {
    fetchAllProducts();
  }, [port]);

  useEffect(() => {
    if (products.length > 0) {
      applyInitialFilters(products);
    }
  }, [location.search, products]); 

  const applyFilters = ({ categoryChecked, subCategoryChecked, priceRange, searchTerm }) => {
    let filteredProductsCopy = [...products];

    if (categoryChecked.length > 0) {
      filteredProductsCopy = filteredProductsCopy.filter(product =>
        categoryChecked.includes(product.category._id)
      );
    }

    if (subCategoryChecked.length > 0) {
      filteredProductsCopy = filteredProductsCopy.filter(product =>
        subCategoryChecked.includes(product.subcategory._id)
      );
    }

    filteredProductsCopy = filteredProductsCopy.filter(product =>
      product.price <= priceRange
    );

    if (searchTerm) {
      filteredProductsCopy = filteredProductsCopy.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.subcategory.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filteredProductsCopy);
  };

  return (
    <div className="container mx-auto p-4 flex relative" style={{ marginTop: "60px", minHeight: "100vh" }}>
      <div className="filter-menu fixed top-0 left-0 h-full z-50">
        <div className="p-4">
          <FilterComponent applyFilters={applyFilters} />
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="product-card-container">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          )) : (
            products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ShopPage;
