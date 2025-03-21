import React from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item._id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item._id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center py-4 border-b border-slate-800">
      {/* Product Image */}
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="ml-4 flex-grow">
        <h3 className="text-white font-medium">{item.name}</h3>
        <p className="text-gray-400 text-sm">${item.price}</p>
      </div>
      
      {/* Quantity Controls */}
      <div className="flex items-center border border-slate-700 rounded-md">
        <button 
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
          className="p-1 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiMinus className="text-gray-400" />
        </button>
        
        <span className="px-2 py-1 text-white min-w-[30px] text-center">
          {item.quantity}
        </span>
        
        <button 
          onClick={handleIncrease}
          className="p-1 hover:bg-slate-800 transition-colors"
        >
          <FiPlus className="text-gray-400" />
        </button>
      </div>
      
      {/* Total Price */}
      <div className="ml-6 w-20 text-right">
        <p className="text-white font-medium">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      
      {/* Remove Button */}
      <button 
        onClick={() => onRemove(item._id)}
        className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default CartItem; 