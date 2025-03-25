import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import CartHeader from '../Components/CartHeader';
import { incrementQuantity, decrementQuantity } from '../redux/Slice/CartSlice';

function Cart() {
  const cartItems = useSelector(state => state.Cart.cartItems || []);
  const dispatch = useDispatch();

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  return (
    <>
      {cartItems.length > 0 && <CartHeader currentStep="Cart" />}
      

      <div className="min-h-screen p-5 bg-blue-100 flex flex-col items-center">

        {cartItems.length > 0 ? (
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between border-b border-gray-200 py-4"
              >
                <div className="flex items-center space-x-4 gap-20">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-20 rounded-md object-contain"
                  />
                  <div className="flex flex-col justify-center">
                    <h2 className="text-base font-bold">{item.description}</h2>
                    <p className="text-gray-700">₹{item.price}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                  <button
                    onClick={() => handleDecrement(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
              </span>
            </div>
            <button className="w-full bg-blue-500 text-white py-2 mt-6 rounded-lg font-medium hover:bg-blue-600">
              Proceed to Checkout
            </button>
          </div>
        ) : (
          <div className="text-center font-semibold  py-[20%]">
            <p className="text-xl">Your cart is empty</p>
            <Link to={"/home"}>
              <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Continue Shopping
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
