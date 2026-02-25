import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useAuth } from './AuthContext';

const StoreContext = createContext();

export function useStore() {
  return useContext(StoreContext);
}

export function StoreProvider({ children }) {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 1. Sync Users from Firestore (for admin dashboard)
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    });
    return unsub;
  }, []);

  // 2. Sync Stores from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'stores'), (snapshot) => {
      const storeList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStores(storeList);
      
      // Add sample store if no stores exist
      if (storeList.length === 0) {
        console.log('No stores found, adding sample store...');
        addSampleStore();
      }
    });
    return unsub;
  }, []);

  // Add sample store for testing
  const addSampleStore = async () => {
    const sampleStore = {
      name: 'Tech Store',
      description: 'Your trusted electronics and accessories store',
      ownerId: 'sample-owner',
      primaryColor: '#9333ea',
      secondaryColor: '#a855f7',
      logo: 'https://picsum.photos/200/200?random=store',
      banner: 'https://picsum.photos/800/300?random=banner',
      status: 'active'
    };

    await addDoc(collection(db, 'stores'), sampleStore);
  };

  // 3. Sync Products from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      
      // Add sample products if no products exist
      if (productList.length === 0) {
        console.log('No products found, adding sample products...');
        addSampleProducts();
      }
    });
    return unsub;
  }, []);

  // Add sample products for testing
  const addSampleProducts = async () => {
    // Get all stores to match product storeId
    const storesSnapshot = await getDocs(collection(db, 'stores'));
    const allStores = storesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Use the first available store ID or create a default one
    const targetStoreId = allStores.length > 0 ? allStores[0].id : 'default-store';
    
    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        price: 2999,
        originalPrice: 3999,
        description: 'Premium wireless headphones with noise cancellation',
        storeId: targetStoreId, // Use actual store ID
        stock: 15,
        images: ['https://picsum.photos/400/400?random=1'],
        category: 'Electronics'
      },
      {
        name: 'Smart Watch Pro',
        price: 19999,
        originalPrice: 24999,
        description: 'Advanced fitness and health tracking smartwatch',
        storeId: targetStoreId, // Use actual store ID
        stock: 8,
        images: ['https://picsum.photos/400/400?random=2'],
        category: 'Electronics'
      },
      {
        name: 'Designer Sunglasses',
        price: 8999,
        originalPrice: 12999,
        description: 'UV protection designer sunglasses',
        storeId: targetStoreId, // Use actual store ID
        stock: 25,
        images: ['https://picsum.photos/400/400?random=3'],
        category: 'Fashion'
      },
      {
        name: 'Portable Power Bank',
        price: 1499,
        description: '20000mAh fast charging power bank',
        storeId: targetStoreId, // Use actual store ID
        stock: 50,
        images: ['https://picsum.photos/400/400?random=4'],
        category: 'Electronics'
      }
    ];

    for (const product of sampleProducts) {
      await addDoc(collection(db, 'products'), product);
    }
  };

  // 4. Sync Orders (for buyers and sellers)
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    // For simplicity in this version, we'll sync all orders and filter in components
    // This ensures both buyers see their purchases and sellers see their sales
    const unsub = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(orderList);
    });

    return unsub;
  }, [currentUser]);

  // 5. Cart still lives in state (ephemeral)

  // Helper: Upload Base64 to Firebase Storage and get URL
  const uploadToStorage = async (base64Path, folder) => {
    if (!base64Path || !base64Path.startsWith('data:')) return base64Path;
    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const storageRef = ref(storage, `${folder}/${filename}`);
    await uploadString(storageRef, base64Path, 'data_url');
    return await getDownloadURL(storageRef);
  };

  const addStore = async (store) => {
    if (!currentUser) return;

    // Upload logo if it's base64
    const logoUrl = await uploadToStorage(store.logo, 'logos');

    const storeData = {
      ...store,
      ownerId: currentUser.uid,
      logo: logoUrl || null,
      primaryColor: store.primaryColor || '#3b82f6',
      secondaryColor: store.secondaryColor || '#10b981',
      layout: store.layout || 'grid',
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'stores'), storeData);
  };

  const updateStore = async (storeId, updates) => {
    if (updates.logo && updates.logo.startsWith('data:')) {
      updates.logo = await uploadToStorage(updates.logo, 'logos');
    }
    await updateDoc(doc(db, 'stores', storeId), updates);
  };

  const addProduct = async (product) => {
    // Upload images if they are base64
    const imageUrls = await Promise.all(
      (product.images || []).map(img => uploadToStorage(img, 'products'))
    );

    // Upload video if it's base64
    const videoUrl = await uploadToStorage(product.video, 'videos');

    const productData = {
      ...product,
      images: imageUrls,
      video: videoUrl || null,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, 'products'), productData);
  };

  const updateProduct = async (productId, updates) => {
    if (updates.images) {
      updates.images = await Promise.all(
        updates.images.map(img => uploadToStorage(img, 'products'))
      );
    }
    if (updates.video && updates.video.startsWith('data:')) {
      updates.video = await uploadToStorage(updates.video, 'videos');
    }
    await updateDoc(doc(db, 'products', productId), updates);
  };

  const deleteProduct = async (productId) => {
    await deleteDoc(doc(db, 'products', productId));
  };

  const deleteStore = async (storeId) => {
    // Delete all products associated with this store first
    const storeProducts = products.filter(p => p.storeId === storeId);
    await Promise.all(storeProducts.map(p => deleteDoc(doc(db, 'products', p.id))));
    // Then delete the store
    await deleteDoc(doc(db, 'stores', storeId));
  };

  const deleteOrder = async (orderId) => {
    await deleteDoc(doc(db, 'orders', orderId));
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const placeOrder = async (order) => {
    const orderData = {
      ...order,
      status: 'pending',
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    setCart([]);
    return { id: docRef.id, ...orderData };
  };

  const updateOrder = async (orderId, updates) => {
    await updateDoc(doc(db, 'orders', orderId), updates);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const value = {
    stores,
    products,
    orders,
    users,
    cart,
    loading,
    addStore,
    updateStore,
    deleteStore,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    placeOrder,
    updateOrder,
    deleteOrder,
    formatPrice
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
