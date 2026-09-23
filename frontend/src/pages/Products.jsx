import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './Pages.css'

// Curated catalog: every product has its own real, category-matched photo.
// No two products share an image, and each shot is chosen to actually show
// the product (or the product in clear use) rather than a generic stock photo.
const CATALOG = [
  // Food & Nutrition
  {
    id: 1,
    name: 'Grain-Free Adult Dog Kibble',
    brand: 'Royal Canin',
    category: 'Food & Nutrition',
    petType: 'Dog',
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 342,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902861a?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 2,
    name: 'Tender Tuna Cat Food Pouches',
    brand: 'Whiskas',
    category: 'Food & Nutrition',
    petType: 'Cat',
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviews: 210,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1596854273338-cbf078ec7071?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 3,
    name: 'Baked Bone Training Treats',
    brand: 'Drools',
    category: 'Food & Nutrition',
    petType: 'Dog',
    price: 349,
    originalPrice: 449,
    rating: 4.7,
    reviews: 178,
    availability: 'In Stock',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=85'
  },
  // Toys
  {
    id: 4,
    name: 'Durable Rubber Chew Toy',
    brand: 'KongPlay',
    category: 'Toys',
    petType: 'Dog',
    price: 649,
    originalPrice: 849,
    rating: 4.8,
    reviews: 256,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 5,
    name: 'Bounce Fetch Ball',
    brand: 'KongPlay',
    category: 'Toys',
    petType: 'Dog',
    price: 349,
    originalPrice: 449,
    rating: 4.4,
    reviews: 132,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 6,
    name: 'Plush Squeaky Bear',
    brand: 'Chewy Bites',
    category: 'Toys',
    petType: 'Both',
    price: 449,
    originalPrice: 599,
    rating: 4.3,
    reviews: 164,
    availability: 'Limited Stock',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1587559070757-f72a388edbba?auto=format&fit=crop&w=900&q=85'
  },
  // Beds
  {
    id: 7,
    name: 'Orthopedic Memory Foam Bed',
    brand: 'ComfyPaws',
    category: 'Beds',
    petType: 'Dog',
    price: 2149,
    originalPrice: 2699,
    rating: 4.9,
    reviews: 88,
    availability: 'Low Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 8,
    name: 'Woven Wicker Pet Basket',
    brand: 'ComfyPaws',
    category: 'Beds',
    petType: 'Both',
    price: 1399,
    originalPrice: 1799,
    rating: 4.5,
    reviews: 97,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 9,
    name: 'Polka Dot Cuddler Bed',
    brand: 'ComfyPaws',
    category: 'Beds',
    petType: 'Dog',
    price: 1099,
    originalPrice: 1399,
    rating: 4.4,
    reviews: 73,
    availability: 'In Stock',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1646195164326-124b72fb9d34?auto=format&fit=crop&w=900&q=85'
  },
  // Grooming
  {
    id: 10,
    name: 'Professional Slicker Brush',
    brand: 'GroomPro',
    category: 'Grooming',
    petType: 'Both',
    price: 499,
    originalPrice: 699,
    rating: 4.6,
    reviews: 212,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1528846104175-4fd300ee59da?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 11,
    name: 'Gentle Oatmeal Pet Shampoo',
    brand: 'GroomPro',
    category: 'Grooming',
    petType: 'Both',
    price: 379,
    originalPrice: 499,
    rating: 4.5,
    reviews: 156,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1701992678972-d5a053ad0fb0?auto=format&fit=crop&w=900&q=85'
  },
  // Accessories
  {
    id: 12,
    name: 'Foldable Pet Travel Carrier',
    brand: 'WoofWear',
    category: 'Accessories',
    petType: 'Both',
    price: 1799,
    originalPrice: 2299,
    rating: 4.6,
    reviews: 92,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1527150602-a98f7a6f2746?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 13,
    name: 'Rainproof Pet Poncho',
    brand: 'WoofWear',
    category: 'Accessories',
    petType: 'Dog',
    price: 899,
    originalPrice: 1199,
    rating: 4.4,
    reviews: 71,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1517964665-75137e2d9a6b?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 14,
    name: 'Adjustable Nylon Pet Harness',
    brand: 'WoofWear',
    category: 'Accessories',
    petType: 'Dog',
    price: 749,
    originalPrice: 949,
    rating: 4.5,
    reviews: 118,
    availability: 'In Stock',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85'
  },
  // Clothing
  {
    id: 15,
    name: 'All-Weather Dog Raincoat',
    brand: 'WoofWear',
    category: 'Clothing',
    petType: 'Dog',
    price: 949,
    originalPrice: 1249,
    rating: 4.5,
    reviews: 104,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1533756972958-d6f38a9761e3?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 16,
    name: 'Quilted Winter Vest',
    brand: 'WoofWear',
    category: 'Clothing',
    petType: 'Dog',
    price: 849,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 89,
    availability: 'Limited Stock',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1740235571784-6f9a79cb545f?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 17,
    name: 'Cozy Knit Sweater',
    brand: 'PawFresh',
    category: 'Clothing',
    petType: 'Dog',
    price: 749,
    originalPrice: 999,
    rating: 4.5,
    reviews: 146,
    availability: 'Limited Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85'
  },
  // Health
  {
    id: 18,
    name: 'Daily Multivitamin Chews',
    brand: 'PetVital',
    category: 'Health',
    petType: 'Both',
    price: 599,
    originalPrice: 799,
    rating: 4.7,
    reviews: 203,
    availability: 'In Stock',
    isNew: true,
    image: 'https://images.unsplash.com/photo-1763668177859-0ed5669a795e?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 19,
    name: 'Joint & Mobility Support Formula',
    brand: 'PetVital',
    category: 'Health',
    petType: 'Dog',
    price: 899,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 167,
    availability: 'In Stock',
    isNew: false,
    image: 'https://images.unsplash.com/photo-1763757933154-d55844eae856?auto=format&fit=crop&w=900&q=85'
  }
]

const CATEGORY_BANNERS = {
  All: 'https://images.unsplash.com/photo-1517849845537-4d257902861a?auto=format&fit=crop&w=800&q=85',
  'Food & Nutrition': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=85',
  Toys: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=85',
  Beds: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=85',
  Grooming: 'https://images.unsplash.com/photo-1517849845537-4d257902861a?auto=format&fit=crop&w=800&q=85',
  Accessories: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=85',
  Clothing: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=85',
  Health: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=85'
}

const CATEGORY_ORDER = ['All', 'Food & Nutrition', 'Toys', 'Beds', 'Grooming', 'Accessories', 'Clothing', 'Health']

const PRICE_RANGES = [
  { label: 'Any price', min: 0, max: Infinity },
  { label: 'Under \u20b9500', min: 0, max: 500 },
  { label: '\u20b9500 \u2013 \u20b91000', min: 500, max: 1000 },
  { label: '\u20b91000 \u2013 \u20b92000', min: 1000, max: 2000 },
  { label: 'Above \u20b92000', min: 2000, max: Infinity }
]

const RATING_OPTIONS = [
  { label: 'Any rating', min: 0 },
  { label: '4.5 & up', min: 4.5 },
  { label: '4.0 & up', min: 4.0 },
  { label: '3.5 & up', min: 3.5 }
]

const SORT_OPTIONS = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated']

const PAGE_SIZE = 8

const normalizeCategory = (value) => {
  const raw = String(value ?? '').trim().toLowerCase()
  if (raw.includes('toy')) return 'Toys'
  if (raw.includes('bed') || raw.includes('home') || raw.includes('bowl')) return 'Beds'
  if (raw.includes('groom')) return 'Grooming'
  if (raw.includes('cloth') || raw.includes('wear') || raw.includes('sweater') || raw.includes('coat')) return 'Clothing'
  if (raw.includes('health') || raw.includes('vitamin') || raw.includes('supplement')) return 'Health'
  if (raw.includes('access') || raw.includes('carrier') || raw.includes('leash') || raw.includes('collar')) return 'Accessories'
  return 'Food & Nutrition'
}

const mergeProducts = (apiProducts = []) => {
  const merged = [...CATALOG]
  const seenNames = new Set(merged.map((p) => p.name.toLowerCase()))

  apiProducts.forEach((product) => {
    const name = String(product.name ?? 'Unnamed product').trim()
    if (!name || seenNames.has(name.toLowerCase())) return
    seenNames.add(name.toLowerCase())

    const category = normalizeCategory(product.category)
    merged.push({
      id: product.id ?? `${name}-${merged.length}`,
      name,
      brand: product.brand ?? 'Petly',
      category,
      petType: product.petType ?? 'Both',
      price: Number(product.price) || 0,
      originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
      rating: Number(product.rating) || 0,
      reviews: Number(product.reviews) || 0,
      availability: product.availability ?? 'In Stock',
      isNew: Boolean(product.isNew),
      image: product.image || CATEGORY_BANNERS[category]
    })
  })

  return merged
}

const stockClass = (availability) => {
  if (availability === 'Limited Stock') return 'stock-limited'
  if (availability === 'Low Stock') return 'stock-low'
  return ''
}

function Products() {
  const [products, setProducts] = useState(CATALOG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [category, setCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('Popular')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [petType, setPetType] = useState('All Pets')
  const [priceRangeIdx, setPriceRangeIdx] = useState(0)
  const [ratingIdx, setRatingIdx] = useState(0)
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedAvailability, setSelectedAvailability] = useState([])

  const [wishlist, setWishlist] = useState(new Set())
  const [justAdded, setJustAdded] = useState(new Set())
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products')
        const apiProducts = Array.isArray(response.data) ? response.data : []
        setProducts(mergeProducts(apiProducts))
      } catch (err) {
        setError('Failed to load products. Showing curated pet essentials instead.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const brandOptions = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products]
  )

  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category))
    return CATEGORY_ORDER.filter((c) => c === 'All' || present.has(c)).map((label) => ({
      label,
      count: label === 'All' ? products.length : products.filter((p) => p.category === label).length,
      image: CATEGORY_BANNERS[label] || CATEGORY_BANNERS['Food & Nutrition']
    }))
  }, [products])

  const activeFilterCount =
    (petType !== 'All Pets' ? 1 : 0) +
    (priceRangeIdx !== 0 ? 1 : 0) +
    (ratingIdx !== 0 ? 1 : 0) +
    selectedBrands.length +
    selectedAvailability.length

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const range = PRICE_RANGES[priceRangeIdx]
    const minRating = RATING_OPTIONS[ratingIdx].min

    const result = products.filter((product) => {
      if (category !== 'All' && product.category !== category) return false
      if (petType !== 'All Pets' && product.petType !== petType && product.petType !== 'Both') return false
      if (product.price < range.min || product.price > range.max) return false
      if (product.rating < minRating) return false
      if (selectedBrands.length && !selectedBrands.includes(product.brand)) return false
      if (selectedAvailability.length && !selectedAvailability.includes(product.availability)) return false
      if (normalizedSearch) {
        const haystack = `${product.name} ${product.brand} ${product.category}`.toLowerCase()
        if (!haystack.includes(normalizedSearch)) return false
      }
      return true
    })

    const sorted = [...result]
    if (sortBy === 'Price: Low to High') sorted.sort((a, b) => a.price - b.price)
    else if (sortBy === 'Price: High to Low') sorted.sort((a, b) => b.price - a.price)
    else if (sortBy === 'Top Rated') sorted.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'Newest') sorted.sort((a, b) => (b.isNew === a.isNew ? b.id - a.id : b.isNew ? 1 : -1))
    else sorted.sort((a, b) => b.reviews - a.reviews) // Popular

    return sorted
  }, [products, category, petType, priceRangeIdx, ratingIdx, selectedBrands, selectedAvailability, searchTerm, sortBy])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [category, petType, priceRangeIdx, ratingIdx, selectedBrands, selectedAvailability, searchTerm, sortBy])

  const visibleProducts = filteredProducts.slice(0, visibleCount)

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleAddToCart = (id) => {
    setJustAdded((prev) => new Set(prev).add(id))
    setTimeout(() => {
      setJustAdded((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 1200)
  }

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const toggleAvailability = (status) => {
    setSelectedAvailability((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const clearFilters = () => {
    setPetType('All Pets')
    setPriceRangeIdx(0)
    setRatingIdx(0)
    setSelectedBrands([])
    setSelectedAvailability([])
  }

  return (
    <div className="store-page">
      <header className="store-hero">
        <div className="store-hero-inner">
          <span className="store-badge">Shop for your pets</span>
          <h1>Pet Products Store</h1>
          <p>Food, toys, accessories and cozy homes — everything your pet loves</p>
        </div>
      </header>

      <div className="store-shell">
        <div className="store-toolbar">
          <label className="search-box" aria-label="Search products">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products, brands, categories..."
            />
          </label>

          <div className="store-toolbar-row">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products">
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  Sort: {opt}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={filtersOpen || activeFilterCount ? 'filter-toggle-btn active' : 'filter-toggle-btn'}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              ⚙ Filters
              {activeFilterCount > 0 && <span className="filter-count-pill">{activeFilterCount}</span>}
            </button>
          </div>

          {filtersOpen && (
            <div className="filters-panel">
              <div className="filter-group">
                <h4>Pet Type</h4>
                <select className="filter-select" value={petType} onChange={(e) => setPetType(e.target.value)}>
                  <option>All Pets</option>
                  <option>Dog</option>
                  <option>Cat</option>
                </select>
              </div>

              <div className="filter-group">
                <h4>Price</h4>
                <select className="filter-select" value={priceRangeIdx} onChange={(e) => setPriceRangeIdx(Number(e.target.value))}>
                  {PRICE_RANGES.map((range, idx) => (
                    <option key={range.label} value={idx}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h4>Rating</h4>
                <select className="filter-select" value={ratingIdx} onChange={(e) => setRatingIdx(Number(e.target.value))}>
                  {RATING_OPTIONS.map((opt, idx) => (
                    <option key={opt.label} value={idx}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h4>Brand</h4>
                <div className="checkbox-list">
                  {brandOptions.map((brand) => (
                    <label key={brand} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h4>Availability</h4>
                <div className="checkbox-list">
                  {['In Stock', 'Limited Stock', 'Low Stock'].map((status) => (
                    <label key={status} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes(status)}
                        onChange={() => toggleAvailability(status)}
                      />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filters-panel-footer">
                <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="category-cards" role="tablist" aria-label="Product categories">
          {categories.map(({ label, count, image }) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={category === label}
              className={category === label ? 'category-card active' : 'category-card'}
              onClick={() => setCategory(label)}
            >
              <div className="category-card-image-wrap">
                <img src={image} alt="" loading="lazy" />
                <span className="category-card-count">{count}</span>
              </div>
              <div className="category-card-text">
                <strong>{label}</strong>
              </div>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-panel">Loading products...</div>
        ) : error ? (
          <div className="notice-banner">{error}</div>
        ) : null}

        {!loading && (
          <div className="results-bar">
            <span>
              Showing {visibleProducts.length} of {filteredProducts.length} products
            </span>
          </div>
        )}

        <div className="product-grid">
          {visibleProducts.map((product) => {
            const discount = product.originalPrice > product.price
              ? Math.round((1 - product.price / product.originalPrice) * 100)
              : 0
            const isWishlisted = wishlist.has(product.id)
            const isAdded = justAdded.has(product.id)

            return (
              <article key={product.id} className="product-card">
                <div className="product-card-top-row">
                  <div className="badge-stack">
                    {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
                    {product.isNew && <span className="new-badge">NEW</span>}
                    {product.availability !== 'In Stock' && (
                      <span className={`stock-badge ${stockClass(product.availability)}`}>{product.availability}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={isWishlisted ? 'wishlist-button active' : 'wishlist-button'}
                    aria-label={`Add ${product.name} to wishlist`}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {isWishlisted ? '♥' : '♡'}
                  </button>
                </div>

                <div className="product-visual">
                  <img
                    className="product-visual-image"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = CATEGORY_BANNERS[product.category] || CATEGORY_BANNERS['Food & Nutrition']
                    }}
                  />
                </div>

                <span className="brand-tag">{product.brand}</span>
                <h3>{product.name}</h3>

                <div className="rating-row" aria-label={`Rated ${product.rating} out of 5`}>
                  <div className="stars">
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={`${product.id}-star-${index}`} className={index < Math.round(product.rating) ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="review-count">({product.reviews})</span>
                </div>

                <div className="price-row">
                  <div className="price-block">
                    <span className="currency">₹</span>
                    <span className="current-price">{product.price.toLocaleString('en-IN')}</span>
                    {discount > 0 && <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
                  </div>

                  <button
                    type="button"
                    className={isAdded ? 'cart-button added' : 'cart-button'}
                    aria-label={`Add ${product.name} to cart`}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <span>{isAdded ? '✓' : '🛒'}</span>
                  </button>
                </div>

                <div className="product-card-footer-row">
                  <button type="button" className="quick-view-btn" onClick={() => setQuickViewProduct(product)}>
                    Quick View
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="empty-state">
            No products match your search. Try a different keyword or filter.
          </div>
        )}

        {!loading && visibleCount < filteredProducts.length && (
          <div className="load-more-wrap">
            <div className="load-more-progress">
              <div
                className="load-more-progress-fill"
                style={{ width: `${(visibleProducts.length / filteredProducts.length) * 100}%` }}
              />
            </div>
            <button type="button" className="load-more-btn" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
              Load More
            </button>
          </div>
        )}
      </div>

      {quickViewProduct && (
        <div className="modal active" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-content quickview-content" onClick={(e) => e.stopPropagation()}>
            <button className="quickview-close" onClick={() => setQuickViewProduct(null)} aria-label="Close quick view">
              ×
            </button>
            <div className="quickview-grid">
              <div className="quickview-image-wrap">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} />
              </div>
              <div className="quickview-info">
                <span className="brand-tag">{quickViewProduct.brand}</span>
                <h2>{quickViewProduct.name}</h2>

                <div className="quickview-meta-row">
                  <div className="rating-row" style={{ marginBottom: 0 }}>
                    <div className="stars">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span
                          key={`qv-star-${index}`}
                          className={index < Math.round(quickViewProduct.rating) ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="review-count">({quickViewProduct.reviews} reviews)</span>
                  </div>
                  {quickViewProduct.availability !== 'In Stock' && (
                    <span className={`stock-badge ${stockClass(quickViewProduct.availability)}`}>
                      {quickViewProduct.availability}
                    </span>
                  )}
                </div>

                <div className="quickview-price-row">
                  <span className="currency">₹</span>
                  <span className="current-price">{quickViewProduct.price.toLocaleString('en-IN')}</span>
                  {quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="original-price">₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>

                <p style={{ color: '#777', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {quickViewProduct.category} · Suitable for {quickViewProduct.petType === 'Both' ? 'dogs & cats' : `${quickViewProduct.petType.toLowerCase()}s`}
                </p>

                <div className="quickview-actions">
                  <button
                    type="button"
                    className="btn-add-cart"
                    onClick={() => {
                      handleAddToCart(quickViewProduct.id)
                      setQuickViewProduct(null)
                    }}
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    className={wishlist.has(quickViewProduct.id) ? 'wishlist-button active' : 'wishlist-button'}
                    style={{ position: 'static' }}
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                  >
                    {wishlist.has(quickViewProduct.id) ? '♥' : '♡'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products