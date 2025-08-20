// const RECENTLY_VIEWED_KEY = 'recentlyViewed';
// const MAX_ITEMS = 20; // Maximum number of items to store

// // Function to get the list of recently viewed items
// export const getRecentlyViewed = () => {
//   const items = localStorage.getItem(RECENTLY_VIEWED_KEY);
//   return items ? JSON.parse(items) : [];
// };

// // Function to add a new item to the list
// export const addRecentlyViewed = (product) => {
//   if (!product || !product.id) return;

//   let items = getRecentlyViewed();
  
//   // Remove the item if it already exists to move it to the front
//   items = items.filter(item => item.id !== product.id);
  
//   // Add the new item to the beginning of the array
//   items.unshift(product);
  
//   // Ensure the list doesn't exceed the max size
//   const slicedItems = items.slice(0, MAX_ITEMS);
  
//   localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(slicedItems));
// };





const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_ITEMS = 20; // Maximum number of items to store

// helper to clean price into number
const parsePrice = (val) => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
  }
  return 0;
};

// Function to get the list of recently viewed items
export const getRecentlyViewed = () => {
  const items = localStorage.getItem(RECENTLY_VIEWED_KEY);
  return items ? JSON.parse(items) : [];
};

// Function to add a new item to the list
export const addRecentlyViewed = (product) => {
  if (!product || !product.id) return;

  let items = getRecentlyViewed();

  // Clean the product before saving
  const cleanedProduct = {
    ...product,
    price: parsePrice(product.price),
    originalPrice: parsePrice(product.originalPrice ?? product.price),
  };

  // Remove existing instance if already present
  items = items.filter(item => item.id !== cleanedProduct.id);

  // Add cleaned product to the beginning
  items.unshift(cleanedProduct);

  // Slice to max length
  const slicedItems = items.slice(0, MAX_ITEMS);

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(slicedItems));
};
