import React, { useState, useEffect } from 'react';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ sortBy: 'priceAsc', gender: '', category: '' });
  const [page, setPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const productsPerPage = 12;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply filters and sorting
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Filter by gender
    if (filter.gender) {
     filtered = filtered.filter((product) => product.prodmeta_section.toLowerCase() === filter.gender.toLowerCase());
    }

    // Filter by category
if (filter.category) {
    console.log(`Filtering by category: ${filter.category}`);
    filtered = filtered.filter((product) => product.attr_14k_metal_available.toLowerCase() === filter.category.toLowerCase());
  }

    // Sort products
switch (filter.sortBy) {
    case 'priceAsc':
      filtered.sort((a, b) => a.attr_14k_regular - b.attr_14k_regular);
      break;
    case 'priceDesc':
      filtered.sort((a, b) => b.attr_14k_regular - a.attr_14k_regular);
      break;
    case 'mostPopular':
      filtered.sort((a, b) => b.popularity - a.popularity);
      break;
    default:
      break;
  }

  return filtered;
};

  const filteredProducts = getFilteredProducts();
  const displayedProducts = filteredProducts.slice(0, page * productsPerPage);

  const handleCardClick = (id) => {
    setSelectedProductId(id);
  };

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  };

  return (
    <div>
      {products.length ? (
        <div>
          <div className="filters">
            <select 
              className="filter-select" 
              onChange={(e) => setFilter((prev) => ({ ...prev, sortBy: e.target.value }))}
            >
              <option value="">Price</option>
              <option value="priceAsc">Low to High</option>
              <option value="priceDesc">High to Low</option>
              <option value="mostPopular">Most Popular</option>
            </select>
            <select 
              className="filter-select" 
              onChange={(e) => setFilter((prev) => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">All</option>
              <option value="Mens">Mens</option>
              <option value="Womens">Womens</option>
            </select>
            <select 
              className="filter-select" 
              onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Metal</option>
              <option value="White Gold">White Gold</option>
              <option value="Rose Gold">Rose Gold</option>
              <option value="Yellow Gold">Yellow Gold</option>
    
            </select>
          </div>
          <div className="product-grid">
            {displayedProducts.length ? (
              displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className={`product-card ${selectedProductId === product.id ? 'selected' : ''}`}
                  onClick={() => handleCardClick(product.id)}
                >
               
                  <img
                    // src={`https://www.bluenile.com/${product.prod_image}`}
                    src={`https://ion.bluenile.com/sets/Jewelry-bn/195128/NOP/Images/gallery.jpg`}
                    alt={product.prod_name}
                    className="product-image"
                  />
                  <div className="heart-icon"></div>
                  <h2 className="product-heading">{product.prod_name}</h2>
                  {/* <p>Category: {product.prod_subcategory}</p> */}
                  {/* <p>Gender: {product.prodmeta_section}</p> */}
                  <p>{product.prodmeta_section}</p>
                  {/* <p>Price: ${product.attr_14k_regular}</p> */}
                  <p>${product.attr_14k_regular}</p>
                  {/* <p>Metal : {product.attr_14k_metal_available}</p> */}
                  <p>{product.attr_14k_metal_available}</p>
                  <span className="rating">★★★★☆ 1331 Reviews</span>
                 
                  {/* <p>Shipping Days: {product.prodmeta_ship_days}</p> */}
                </div>
              ))
            ) : (
              <h1 style={centerStyle}>No products match your filters</h1>
            )}
          </div>
        </div>
      ) : (
        <h1 style={centerStyle}>Currently, there are no products available</h1>
      )}
    </div>
  );
};

export default ProductList;



