import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { currency } from '../App';
import ConfirmationDialog from '../components/ConfirmationDialog';

// Make sure backendUrl is imported or defined properly
import { backendUrl } from '../App';

const List = ({ token }) => {

List.propTypes = {
  token: PropTypes.string.isRequired
};
  const [list, setList] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  // Edit form states
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    bestseller: 'false',
    sizes: [],
    quantity: '',
    existingImages: [] // Store existing images URLs
  });
  const [editImages, setEditImages] = useState({
    image1: false,
    image2: false,
    image3: false,
    image4: false
  });

  const fetchList = useCallback(async () => {
    try {
      console.log('Fetching from URL:', backendUrl + '/api/product/list');
      console.log('Using token:', token);

      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: { token }
      });

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Network Error');
    }
  }, [token]);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirmDialog(true);
  };

  const removeProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id: productToDelete._id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Network Error');
    } finally {
      setShowConfirmDialog(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setProductToDelete(null);
  };

  const handleEditClick = async (product) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/single',
        { productId: product._id },
        { headers: { token } }
      );

      if (response.data.success) {
        const productData = response.data.product;
        setProductToEdit(productData);
        setEditForm({
          name: productData.name,
          description: productData.description,
          price: productData.price.toString(),
            quantity: productData.quantity ? productData.quantity.toString() : '0',
          category: productData.category,
          bestseller: productData.bestseller ? 'true' : 'false',
          sizes: sortSizes(productData.sizes || []),
          existingImages: productData.image || []
        });
        setEditImages({
          image1: false,
          image2: false,
          image3: false,
          image4: false
        });
        setShowEditModal(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Network Error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Check if at least one image will remain after the update
      const hasExistingImages = editForm.existingImages.some(img => img !== null);
      const hasNewImages = Object.values(editImages).some(img => img !== false);
      
      if (!hasExistingImages && !hasNewImages) {
        toast.error("Product must have at least one image");
        return;
      }

      const formData = new FormData();
      formData.append('id', productToEdit._id);
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('category', editForm.category);
      formData.append('bestseller', editForm.bestseller);
      formData.append('sizes', JSON.stringify(editForm.sizes));
  formData.append('quantity', editForm.quantity);

      // Handle both existing and new images
      const existingImagesArray = [...editForm.existingImages];
      
      // Mark positions where new images will be inserted as null
      Object.keys(editImages).forEach(key => {
        if (editImages[key]) {
          const index = parseInt(key.replace('image', '')) - 1;
          existingImagesArray[index] = null;
        }
      });

      formData.append('existingImages', JSON.stringify(existingImagesArray));

      // Append new images if they exist
      editImages.image1 && formData.append('image1', editImages.image1);
      editImages.image2 && formData.append('image2', editImages.image2);
      editImages.image3 && formData.append('image3', editImages.image3);
      editImages.image4 && formData.append('image4', editImages.image4);

      const response = await axios.post(
        backendUrl + '/api/product/update',
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
        setShowEditModal(false);
        setProductToEdit(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Network Error');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setProductToEdit(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      category: 'Men',
      bestseller: 'false',
      sizes: [],
      quantity: '',
      existingImages: []
    });
    setEditImages({
      image1: false,
      image2: false,
      image3: false,
      image4: false
    });
  };

  // Function to sort sizes in order: S, M, L, XL, XXL
  const sortSizes = (sizes) => {
    if (!sizes) return [];
    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
    return sizes.sort((a, b) => {
      const indexA = sizeOrder.indexOf(String(a));
      const indexB = sizeOrder.indexOf(String(b));
      // If size not found in order, put it at the end
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  // Filter products based on search and category
  const filteredProducts = list.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Run fetchList once on component mount
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">Product Inventory</h1>
          <p className="text-emerald-100">Manage your product catalog and inventory</p>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              >
                <option value="All">All Categories</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden">
              <img 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                src={item.image[0]} 
                alt={item.name} 
              />
              {item.bestseller && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Best Seller
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-emerald-600">{currency}{item.price}</div>
                      <div className="text-sm text-gray-600">Stock: {typeof item.quantity !== 'undefined' ? item.quantity : 'N/A'}</div>
                    </div>
                </div>

                {/* Sizes */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Available Sizes:</p>
                  <div className="flex flex-wrap gap-1">
                    {sortSizes(item.sizes)?.map((size, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditClick(item)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-500">
            {searchTerm || filterCategory !== 'All' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first product.'}
          </p>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelDelete}
        onConfirm={removeProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white">Edit Product</h2>
              <p className="text-blue-100">Update product information and images</p>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-8 space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Update Images (Optional)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num} className="relative">
                      <label htmlFor={`edit_image${num}`} className="group cursor-pointer">
                        <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-blue-400 transition-colors duration-200 group-hover:bg-blue-50">
                          {eval(`editImages.image${num}`) ? (
                            // Show newly selected image
                            <img 
                              className="w-full h-full object-cover" 
                              src={URL.createObjectURL(eval(`editImages.image${num}`))} 
                              alt={`Product image ${num}`} 
                            />
                          ) : editForm.existingImages[num - 1] ? (
                            // Show existing image
                            <img 
                              className="w-full h-full object-cover" 
                              src={editForm.existingImages[num - 1]} 
                              alt={`Product image ${num}`} 
                            />
                          ) : (
                            // Show upload placeholder
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span className="text-sm">Update Image {num}</span>
                            </div>
                          )}
                          <input 
                            onChange={(e) => setEditImages(prev => ({...prev, [`image${num}`]: e.target.files[0]}))} 
                            type="file" 
                            id={`edit_image${num}`} 
                            className="hidden"
                            accept="image/*"
                          />
                        </div>
                      </label>
                      {/* Remove button overlay */}
                      {(eval(`editImages.image${num}`) || editForm.existingImages[num - 1]) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (eval(`editImages.image${num}`)) {
                              // Clear new image
                              setEditImages(prev => ({...prev, [`image${num}`]: false}));
                            } else {
                              // Remove existing image
                              setEditForm(prev => ({
                                ...prev,
                                existingImages: prev.existingImages.map((img, idx) => 
                                  idx === num - 1 ? null : img
                                )
                              }));
                            }
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all duration-200 transform hover:scale-110"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Current images will be replaced if new ones are selected</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                  <input 
                    onChange={(e) => setEditForm(prev => ({...prev, name: e.target.value}))} 
                    value={editForm.name} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                    type="text" 
                    placeholder="Type Here" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input 
                      onChange={(e) => setEditForm(prev => ({...prev, price: e.target.value}))} 
                      value={editForm.price} 
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                      type="Number" 
                      placeholder="99" 
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Quantity (stock)</label>
                  <div className="relative">
                    <input
                      onChange={(e) => setEditForm(prev => ({...prev, quantity: e.target.value}))}
                      value={editForm.quantity}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      type="number"
                      placeholder="0"
                      min={0}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Product Description *</label>
                <textarea 
                  onChange={(e) => setEditForm(prev => ({...prev, description: e.target.value}))} 
                  value={editForm.description} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" 
                  rows="4"
                  placeholder="Add Description Here" 
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Product Category</label>
                  <select 
                    onChange={(e) => setEditForm(prev => ({...prev, category: e.target.value}))} 
                    value={editForm.category}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Product Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                    const isSelected = editForm.sizes.some(s => String(s) === String(size));
                    
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setEditForm(prev => ({
                          ...prev,
                          sizes: isSelected
                            ? prev.sizes.filter(s => String(s) !== String(size))
                            : sortSizes([...prev.sizes, size])
                        }))}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input 
                  onChange={() => setEditForm(prev => ({...prev, bestseller: prev.bestseller === 'true' ? 'false' : 'true'}))} 
                  checked={editForm.bestseller === 'true'} 
                  type="checkbox" 
                  id="edit_bestseller" 
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700 cursor-pointer" htmlFor="edit_bestseller">
                  Mark as Best Seller
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button type='submit' className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
