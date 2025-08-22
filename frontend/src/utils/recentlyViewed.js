// // const RECENTLY_VIEWED_KEY = 'recentlyViewed';
// // const MAX_ITEMS = 20; // Maximum number of items to store

// // // Function to get the list of recently viewed items
// // export const getRecentlyViewed = () => {
// //   const items = localStorage.getItem(RECENTLY_VIEWED_KEY);
// //   return items ? JSON.parse(items) : [];
// // };

// // // Function to add a new item to the list
// // export const addRecentlyViewed = (product) => {
// //   if (!product || !product.id) return;

// //   let items = getRecentlyViewed();
  
// //   // Remove the item if it already exists to move it to the front
// //   items = items.filter(item => item.id !== product.id);
  
// //   // Add the new item to the beginning of the array
// //   items.unshift(product);
  
// //   // Ensure the list doesn't exceed the max size
// //   const slicedItems = items.slice(0, MAX_ITEMS);
  
// //   localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(slicedItems));
// // };





// const RECENTLY_VIEWED_KEY = 'recentlyViewed';
// const MAX_ITEMS = 20; // Maximum number of items to store

// // helper to clean price into number
// const parsePrice = (val) => {
//   if (typeof val === "number") return val;
//   if (typeof val === "string") {
//     return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
//   }
//   return 0;
// };

// // Function to get the list of recently viewed items
// export const getRecentlyViewed = () => {
//   const items = localStorage.getItem(RECENTLY_VIEWED_KEY);
//   return items ? JSON.parse(items) : [];
// };

// // Function to add a new item to the list
// export const addRecentlyViewed = (product) => {
//   if (!product || !product.id) return;

//   let items = getRecentlyViewed();

//   // Clean the product before saving
//   const cleanedProduct = {
//     ...product,
//     price: parsePrice(product.price),
//     originalPrice: parsePrice(product.originalPrice ?? product.price),
//   };

//   // Remove existing instance if already present
//   items = items.filter(item => item.id !== cleanedProduct.id);

//   // Add cleaned product to the beginning
//   items.unshift(cleanedProduct);

//   // Slice to max length
//   const slicedItems = items.slice(0, MAX_ITEMS);

//   localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(slicedItems));
// };




// A helper function to get the current user's ID.
// In a real app, you would decode the JWT to get the user ID.
// For now, we'll simulate it.
const getUserId = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return 'guest'; // A key for any logged-out user
  }
  try {
    // In a real application, you'd decode the token:
    // const decoded = jwt_decode(token);
    // return decoded.user_id;
    
    // For this example, we'll just create a simple hash from the token
    // to simulate a unique ID without needing a JWT library.
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || 'guest';
  } catch (error) {
    return 'guest';
  }
};

const MAX_ITEMS = 20; // Set the maximum number of recently viewed items

/**
 * Retrieves the recently viewed items for the current user (or guest).
 * @returns {Array} An array of product objects.
 */
export const getRecentlyViewed = () => {
  const userId = getUserId();
  const key = `recentlyViewed_${userId}`;
  try {
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error("Could not parse recently viewed items:", error);
    return [];
  }
};

/**
 * Adds a product to the recently viewed list for the current user (or guest).
 * @param {Object} product The product object to add.
 */
export const addRecentlyViewed = (product) => {
  if (!product || !product.id) {
    return;
  }

  const userId = getUserId();
  const key = `recentlyViewed_${userId}`;
  
  const items = getRecentlyViewed();

  // Remove the item if it already exists to move it to the front
  const filteredItems = items.filter(item => item.id !== product.id);

  // Add the new product to the beginning of the array
  const newItems = [product, ...filteredItems];

  // Limit the number of items stored
  const limitedItems = newItems.slice(0, MAX_ITEMS);

  try {
    localStorage.setItem(key, JSON.stringify(limitedItems));
  } catch (error) {
    console.error("Could not save recently viewed items:", error);
  }
};