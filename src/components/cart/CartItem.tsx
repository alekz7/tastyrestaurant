import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes: string;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  image,
  quantity,
  notes
}) => {
  const { updateQuantity, removeItem, updateNotes } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleRemove = () => {
    removeItem(id);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedNotes(e.target.value);
  };

  const handleSaveNotes = () => {
    updateNotes(id, editedNotes);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-200 py-4">
      <div className="sm:w-24 sm:h-24 h-32 mb-4 sm:mb-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 sm:ml-4">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="font-medium text-primary-700">${price.toFixed(2)}</p>
        </div>
        
        {!isEditing ? (
          notes && (
            <div className="mt-1 mb-2">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Notes:</span> {notes}
              </p>
              <button 
                className="text-xs text-primary-600 hover:text-primary-800 mt-1"
                onClick={() => setIsEditing(true)}
              >
                Edit Notes
              </button>
            </div>
          )
        ) : (
          <div className="mt-2 mb-3">
            <textarea
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
              value={editedNotes}
              onChange={handleNotesChange}
              rows={2}
            />
            <div className="flex justify-end space-x-2 mt-1">
              <button 
                className="text-xs text-gray-600 hover:text-gray-800"
                onClick={() => {
                  setEditedNotes(notes);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <button 
                className="text-xs text-primary-600 hover:text-primary-800"
                onClick={handleSaveNotes}
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center">
            <button 
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={handleDecrement}
            >
              <Minus size={16} />
            </button>
            <span className="mx-2 min-w-8 text-center">{quantity}</span>
            <button 
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={handleIncrement}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="flex items-center">
            <p className="font-medium mr-4">${(price * quantity).toFixed(2)}</p>
            <button 
              className="text-gray-500 hover:text-red-600 transition-colors"
              onClick={handleRemove}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        {!isEditing && !notes && (
          <button 
            className="text-xs text-primary-600 hover:text-primary-800 mt-2"
            onClick={() => setIsEditing(true)}
          >
            Add Special Instructions
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItem;