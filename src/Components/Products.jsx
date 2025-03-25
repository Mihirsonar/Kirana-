import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/Slice/ProductSlice";
import { Add, incrementQuantity, decrementQuantity } from "../redux/Slice/CartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { filteredProducts } = useSelector((state) => state.product);
  const cartItems = useSelector((state) => state.Cart.cartItems || []);
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    fetch("https://local-swart.vercel.app/api/products")
      .then((res) => res.json())
      .then((data) => {
        setSkeleton(false);
        dispatch(setProducts(data));
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, [dispatch]);

  const AddToCart = (product) => {
    dispatch(Add(product));
    toast.success("Product Added to Cart 🎉🎉🎉", {
      position: "bottom-left",
      width:"40px"
    });
  };

  return (
    <div className="container mx-auto px-3 py-3">
      <ToastContainer />
      <h2 className="text-xl font-bold text-gray-900 mb-6">Trending Products</h2>
      {skeleton ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-full max-w-sm bg-white border rounded-lg shadow flex flex-col gap-2 justify-between animate-pulse">
              <div className="w-3/4 h-60 bg-gray-400 rounded m-8"></div>
              <div className="px-5 pb-5 flex flex-col h-full">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                  <div className="h-10 w-20 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product) => {
            const cartItem = cartItems.find((item) => item._id === product._id);
            return (
              <div key={product._id} className="max-w-sm bg-white border rounded-lg shadow flex flex-col justify-center">
                <img className="h-60 object-contain p-2 rounded-t-lg mx-auto" src={product.image} alt={product.name} />
                <div className="px-5 pb-5 flex flex-col">
                  <p className="text-sm font-bold tracking-tight text-gray-900 text-left mb-2 h-10">{product.description}</p>
                  <p className="text-xs text-gray-600 text-left mb-4">{product.quantity}</p>
                  <div className="mt-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      {cartItem ? (
                        <div className="flex items-center gap-4">
                          <button className="bg-red-500 text-white font-bold px-3 py-1 rounded-full" onClick={() => dispatch(decrementQuantity(product._id))}>-</button>
                          <span className="text-lg font-bold">{cartItem.quantity}</span>
                          <button className="bg-green-500 text-white font-bold px-3 py-1 rounded-full" onClick={() => dispatch(incrementQuantity(product._id))}>+</button>
                        </div>
                      ) : (
                        <button className="bg-blue-500 text-white font-semibold p-2 rounded-md ml-2" onClick={() => AddToCart(product)}>
                          Add To Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductPage;

//React.memo
// import React, { useEffect, useState, memo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setProducts } from "../redux/Slice/ProductSlice";
// import { Add, incrementQuantity, decrementQuantity } from "../redux/Slice/CartSlice";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ProductPage = memo(({ product, cartItem, AddToCart, dispatch }) => {
//   return (
//     <div key={product._id} className="max-w-sm bg-white border rounded-lg shadow flex flex-col justify-center">
//       <img className="h-60 object-contain p-2 rounded-t-lg mx-auto" src={product.image} alt={product.name} />
//       <div className="px-5 pb-5 flex flex-col">
//         <p className="text-sm font-bold tracking-tight text-gray-900 text-left mb-2 h-10">{product.description}</p>
//         <p className="text-xs text-gray-600 text-left mb-4">{product.quantity}</p>
//         <div className="mt-auto">
//           <div className="flex items-center justify-between">
//             <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
//             {cartItem ? (
//               <div className="flex items-center gap-4">
//                 <button className="bg-red-500 text-white font-bold px-3 py-1 rounded-full" onClick={() => dispatch(decrementQuantity(product._id))}>-</button>
//                 <span className="text-lg font-bold">{cartItem.quantity}</span>
//                 <button className="bg-green-500 text-white font-bold px-3 py-1 rounded-full" onClick={() => dispatch(incrementQuantity(product._id))}>+</button>
//               </div>
//             ) : (
//               <button className="bg-blue-500 text-white font-semibold p-2 rounded-md ml-2" onClick={() => AddToCart(product)}>
//                 Add To Cart
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// });

// export default ProductPage;


// const ProductPage = () => {
//   const dispatch = useDispatch();
//   const { filteredProducts } = useSelector((state) => state.product);
//   const cartItems = useSelector((state) => state.Cart.cartItems || []);
//   const [skeleton, setSkeleton] = useState(true);

//   useEffect(() => {
//     fetch("https://local-swart.vercel.app/api/products")
//       .then((res) => res.json())
//       .then((data) => {
//         setSkeleton(false);
//         dispatch(setProducts(data));
//       })
//       .catch((error) => console.error("Error fetching products:", error));
//   }, [dispatch]);

//   const AddToCart = (product) => {
//     dispatch(Add(product));
//     toast.success("Product Added to Cart 🎉🎉🎉", {
//       position: "bottom-left",
//       width: "40px",
//     });
//   };

//   return (
//     <div className="container mx-auto px-3 py-3">
//       <ToastContainer />
//       <h2 className="text-xl font-bold text-gray-900 mb-6">Trending Products</h2>
//       {skeleton ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//           {Array.from({ length: 10 }).map((_, index) => (
//             <div key={index} className="w-full max-w-sm bg-white border rounded-lg shadow flex flex-col gap-2 justify-between animate-pulse">
//               <div className="w-3/4 h-60 bg-gray-400 rounded m-8"></div>
//               <div className="px-5 pb-5 flex flex-col h-full">
//                 <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                 <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
//                 <div className="flex items-center justify-between mt-auto">
//                   <div className="h-8 w-16 bg-gray-300 rounded"></div>
//                   <div className="h-10 w-20 bg-gray-300 rounded"></div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
//           {filteredProducts.map((product) => {
//             const cartItem = cartItems.find((item) => item._id === product._id);
//             return (
//               <ProductItem
//                 key={product._id}
//                 product={product}
//                 cartItem={cartItem}
//                 AddToCart={AddToCart}
//                 dispatch={dispatch}
//               />
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPage;

