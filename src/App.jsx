import { useState, useEffect, useMemo } from 'react'
import { Facebook, Twitter, Instagram, Search, ShoppingCart, Sun, Moon, Plus, Minus, X } from 'lucide-react'
import PropTypes from 'prop-types'

// Header Component
function Header({ darkMode, toggleDarkMode, cartLength, setShowCart, searchTerm, setSearchTerm }) {
  return (
    <header className="border-b dark:border-gray-700">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">Grocery Store</h1>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search for products"
              className="pl-10 pr-4 py-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="text-green-600 font-semibold dark:text-green-400">Login</button>
          <button 
            onClick={() => setShowCart(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center dark:bg-green-700"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            My Cart ({cartLength})
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  cartLength: PropTypes.number.isRequired,
  setShowCart: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
}

// ProductItem Component
function ProductItem({ item, getItemQuantity, updateQuantity, addToCart }) {
  const quantity = getItemQuantity(item.id)

  return (
    <div className="border rounded-lg p-4 dark:bg-gray-800 dark:border-gray-700">
      <div className="mb-2">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-cover rounded"
        />
      </div>
      <h3 className="font-semibold mb-1 dark:text-white">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-2 dark:text-gray-400">{item.unit}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold dark:text-white">₹{item.price}</span>
        {quantity > 0 ? (
          <div className="flex items-center">
            <button 
              onClick={() => updateQuantity(item.id, quantity - 1)}
              className="text-green-600 border border-green-600 px-2 py-1 rounded-l dark:text-green-400 dark:border-green-400"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 border-t border-b border-green-600 dark:border-green-400 dark:text-white">
              {quantity}
            </span>
            <button 
              onClick={() => addToCart(item)}
              className="text-green-600 border border-green-600 px-2 py-1 rounded-r dark:text-green-400 dark:border-green-400"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addToCart(item)}
            className="text-green-600 border border-green-600 px-4 py-1 rounded dark:text-green-400 dark:border-green-400"
          >
            ADD
          </button>
        )}
      </div>
    </div>
  )
}

ProductItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  getItemQuantity: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
}

// ProductGrid Component
function ProductGrid({ title, items, visibleItems, loadMore, showLess, renderProductItem }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.slice(0, visibleItems).map((item) => renderProductItem(item))}
      </div>
      <div className="text-center mt-4">
        {visibleItems < items.length ? (
          <button 
            onClick={loadMore}
            className="bg-green-600 text-white px-4 py-2 rounded-md mr-2 dark:bg-green-700"
          >
            Load More
          </button>
        ) : visibleItems > 6 && (
          <button 
            onClick={showLess}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md dark:bg-gray-700 dark:text-gray-300"
          >
            Show Less
          </button>
        )}
      </div>
    </section>
  )
}

ProductGrid.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  visibleItems: PropTypes.number.isRequired,
  loadMore: PropTypes.func.isRequired,
  showLess: PropTypes.func.isRequired,
  renderProductItem: PropTypes.func.isRequired,
}

// Cart Component
function Cart({ showCart, setShowCart, cart, removeFromCart, getTotalAmount, proceedToPayment }) {
  return (
    showCart && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-white">My Cart</h2>
            <button 
              onClick={() => setShowCart(false)} 
              className="text-gray-500 dark:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {cart.length === 0 ? (
            <p className="dark:text-white">Your cart is empty.</p>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span className="dark:text-white">{item.name} (x{item.quantity})</span>
                  <span className="dark:text-white">₹{item.price * item.quantity}</span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 ml-2 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <div className="flex justify-between items-center font-bold">
                  <span className="dark:text-white">Total:</span>
                  <span className="dark:text-white">₹{getTotalAmount(cart)}</span>
                </div>
                {cart.length > 0 && (
                  <button 
                    onClick={proceedToPayment}
                    className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md dark:bg-green-700"
                  >
                    Proceed to Payment
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  )
}

Cart.propTypes = {
  showCart: PropTypes.bool.isRequired,
  setShowCart: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  getTotalAmount: PropTypes.func.isRequired,
  proceedToPayment: PropTypes.func.isRequired,
}

// PaymentSuccess Component
function PaymentSuccess({ setShowPaymentSuccess }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Payment Successful!</h2>
        <p className="dark:text-white mb-4">Your order has been placed successfully.</p>
        <button 
          onClick={() => setShowPaymentSuccess(false)}
          className="bg-green-600 text-white px-4 py-2 rounded-md dark:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

PaymentSuccess.propTypes = {
  setShowPaymentSuccess: PropTypes.func.isRequired,
}

// Footer Component
function Footer() {
  return (
    <footer className="mt-auto bg-green-600 text-white dark:bg-green-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">We are committed to providing fresh, high-quality groceries to our customers.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm">
              <li className="mb-2"><a href="#" className="hover:underline">Home</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Products</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Contact Us</a></li>
              <li className="mb-2"><a href="#" className="hover:underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-200"><Facebook size={24} /></a>
              <a href="#" className="hover:text-gray-200"><Twitter size={24} /></a>
              <a href="#" className="hover:text-gray-200"><Instagram size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-500 dark:border-green-700 text-sm text-center">
          © 2023 Grocery Store. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

// Main App Component
function App() {
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [visibleProduceItems, setVisibleProduceItems] = useState(6)
  const [visibleDairyItems, setVisibleDairyItems] = useState(6)
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId)
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const getItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId)
    return item ? item.quantity : 0
  }

  const getTotalAmount = (cart) => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const proceedToPayment = () => {
    setShowCart(false)
    setShowPaymentSuccess(true)
  }

  const produceItems = useMemo(() => [
    { id: 1, name: 'Fresh Apples', price: 99, unit: '1 lb' },
    { id: 2, name: 'Bananas', price: 59, unit: '1 lb' },
    { id: 3, name: 'Carrots', price: 49, unit: '1 lb' },
    { id: 4, name: 'Tomatoes', price: 79, unit: '1 lb' },
    { id: 5, name: 'Lettuce', price: 69, unit: '1 head' },
    { id: 6, name: 'Broccoli', price: 89, unit: '1 lb' },
    { id: 13, name: 'Spinach', price: 79, unit: '1 bunch' },
    { id: 14, name: 'Bell Peppers', price: 99, unit: '1 lb' },
    { id: 15, name: 'Cucumbers', price: 69, unit: '1 lb' },
    { id: 16, name: 'Potatoes', price: 59, unit: '1 lb' },
    { id: 17, name: 'Onions', price: 49, unit: '1 lb' },
    { id: 18, name: 'Garlic', price: 89, unit: '1 head' },
  ], [])

  const dairyItems = useMemo(() => [
    { id: 7, name: 'Organic Eggs', price: 199, unit: 'Dozen' },
    { id: 8, name: 'Milk', price: 89, unit: '1 gallon' },
    { id: 9, name: 'Cheese', price: 299, unit: '1 lb' },
    { id: 10, name: 'Yogurt', price: 129, unit: '32 oz' },
    { id: 11, name: 'Butter', price: 149, unit: '1 lb' },
    { id: 12, name: 'Cream', price: 99, unit: '16 oz' },
    { id: 19, name: 'Sour Cream', price: 109, unit: '16 oz' },
    { id: 20, name: 'Cottage Cheese', price: 179, unit: '16 oz' },
    { id: 21, name: 'Greek Yogurt', price: 159, unit: '32 oz' },
    { id: 22, name: 'Almond Milk', price: 139, unit: '1 gallon' },
    { id: 23, name: 'Goat Cheese', price: 349, unit: '8 oz' },
    { id: 24, name: 'Heavy Cream', price: 119, unit: '16 oz' },
  ], [])

  const loadMoreProduce = () => {
    setVisibleProduceItems(prevVisible => prevVisible + 6)
  }

  const loadMoreDairy = () => {
    setVisibleDairyItems(prevVisible => prevVisible + 6)
  }

  const showLessProduce = () => {
    setVisibleProduceItems(6)
  }

  const showLessDairy = () => {
    setVisibleDairyItems(6)
  }

  const renderProductItem = (item) => {
    return (
      <ProductItem
        key={item.id}
        item={item}
        getItemQuantity={getItemQuantity}
        updateQuantity={updateQuantity}
        addToCart={addToCart}
      />
    )
  }

  const filteredProduceItems = useMemo(() => {
    return produceItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [produceItems, searchTerm])

  const filteredDairyItems = useMemo(() => {
    return dairyItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [dairyItems, searchTerm])

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        cartLength={cart.length}
        setShowCart={setShowCart}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="container mx-auto px-4 py-8">
        <ProductGrid
          title="Fresh Produce"
          items={filteredProduceItems}
          visibleItems={visibleProduceItems}
          loadMore={loadMoreProduce}
          showLess={showLessProduce}
          renderProductItem={renderProductItem}
        />
        <ProductGrid
          title="Dairy & Eggs"
          items={filteredDairyItems}
          visibleItems={visibleDairyItems}
          loadMore={loadMoreDairy}
          showLess={showLessDairy}
          renderProductItem={renderProductItem}
        />
      </main>
      <Footer />
      <Cart
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        removeFromCart={removeFromCart}
        getTotalAmount={getTotalAmount}
        proceedToPayment={proceedToPayment}
      />
      {showPaymentSuccess && <PaymentSuccess setShowPaymentSuccess={setShowPaymentSuccess} />}
    </div>
  )
}

export default App
