# Mobile Store App

A mobile-first web application that allows sellers to create online stores and customers to shop from them.

## Features

### For Sellers
- Create and manage multiple online stores
- Add products with descriptions, prices, and stock levels
- Share store links with customers
- Track orders and sales through a dashboard
- Manage inventory and product information

### For Buyers
- Browse stores and products
- Add items to cart and adjust quantities
- Place orders with delivery information
- Track order history and status
- Shop without account creation (optional)

### Technical Features
- Mobile-responsive design (optimized for 428px width)
- Modern React with hooks
- Firebase authentication
- Context state management
- Tailwind CSS for styling
- Clean, intuitive UI/UX

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobile-store-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase configuration
   - Replace the placeholder values in `src/firebase.js`

4. Start the development server:
```bash
npm start
```

The app will open in your default browser at `http://localhost:3000`.

## Project Structure

```
src/
├── components/
│   └── Navigation.js          # Bottom navigation bar
├── contexts/
│   ├── AuthContext.js         # Authentication state management
│   └── StoreContext.js        # Store and product state management
├── pages/
│   ├── Home.js               # Landing page
│   ├── Login.js              # User login
│   ├── Register.js           # User registration
│   ├── SellerDashboard.js    # Seller main dashboard
│   ├── BuyerDashboard.js     # Buyer main dashboard
│   ├── CreateStore.js        # Store creation form
│   ├── StoreView.js          # Public store view
│   ├── ProductManagement.js  # Product CRUD operations
│   └── Checkout.js           # Order checkout process
├── App.js                    # Main app component with routing
├── index.css                 # Global styles and Tailwind
├── index.js                  # App entry point
└── firebase.js               # Firebase configuration
```

## Usage

### For Sellers
1. Register for an account (choose "Seller" type)
2. Create your first store with name and description
3. Add products with prices and descriptions
4. Share your store link: `https://yourdomain.com/store/[store-id]`
5. Monitor orders and sales from your dashboard

### For Buyers
1. Browse stores or use direct store links
2. Add products to cart
3. Proceed to checkout with delivery information
4. Track order status from your dashboard

## Firebase Configuration

Update `src/firebase.js` with your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Features in Detail

### Store Management
- Multiple stores per seller
- Store categorization
- Store sharing via unique URLs
- Store visibility controls

### Product Management
- Product creation with images (placeholder for future)
- Price and stock management
- Product categorization
- Bulk operations support

### Order Processing
- Real-time order tracking
- Order status updates
- Customer information collection
- Multi-store order support

### User Experience
- Mobile-first responsive design
- Intuitive navigation
- Fast loading times
- Offline capability (future enhancement)

## Technologies Used

- **React 18** - Frontend framework
- **React Router** - Client-side routing
- **Firebase** - Authentication and database
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- Product image uploads
- Payment integration (Stripe, PayPal)
- Push notifications
- Advanced analytics
- Customer reviews and ratings
- Inventory management alerts
- Multi-language support
- Delivery tracking integration
