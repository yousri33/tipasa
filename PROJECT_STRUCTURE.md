# Helena Brand - Project Structure

## 📁 Directory Organization

```
helena-brand/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API endpoints
│   │   │   ├── 📁 airtable-images/
│   │   │   ├── 📁 orders/
│   │   │   └── 📁 products/
│   │   ├── 📁 products/          # Product pages
│   │   ├── 📄 globals.css        # Global styles & animations
│   │   ├── 📄 layout.tsx         # Root layout with RTL support
│   │   └── 📄 page.tsx           # Homepage
│   │
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📄 index.ts           # Centralized component exports
│   │   ├── 📁 layout/            # Layout components
│   │   │   ├── 📄 Header.tsx     # Navigation header
│   │   │   └── 📄 Footer.tsx     # Site footer
│   │   │
│   │   ├── 📁 sections/          # Page section components
│   │   │   ├── 📄 HeroSection.tsx        # Homepage hero
│   │   │   ├── 📄 FeaturedCategories.tsx # Category showcase
│   │   │   └── 📄 FeaturesSection.tsx    # Company features
│   │   │
│   │   ├── 📁 products/          # Product-related components
│   │   │   ├── 📄 ProductsClient.tsx     # Main products page
│   │   │   ├── 📄 ProductCard.tsx        # Individual product card
│   │   │   ├── 📄 ProductFilters.tsx     # Product filtering
│   │   │   └── 📄 ProductDetailClient.tsx # Product detail page
│   │   │
│   │   ├── 📁 orders/            # Order management
│   │   │   └── 📄 OrderModal.tsx         # Order form modal
│   │   │
│   │   └── 📁 ui/                # Base UI components (shadcn/ui)
│   │       ├── 📄 button.tsx
│   │       ├── 📄 card.tsx
│   │       ├── 📄 dialog.tsx
│   │       ├── 📄 input.tsx
│   │       ├── 📄 select.tsx
│   │       ├── 📄 badge.tsx
│   │       ├── 📄 sheet.tsx
│   │       ├── 📄 form.tsx
│   │       ├── 📄 toast.tsx
│   │       ├── 📄 avatar.tsx
│   │       ├── 📄 checkbox.tsx
│   │       ├── 📄 label.tsx
│   │       ├── 📄 radio-group.tsx
│   │       ├── 📄 separator.tsx
│   │       └── 📄 textarea.tsx
│   │
│   └── 📁 lib/                   # Utilities and services
│       ├── 📄 types.ts            # TypeScript type definitions
│       ├── 📄 utils.ts            # Utility functions
│       ├── 📄 airtable.ts         # Airtable integration
│       └── 📄 airtable-images.ts  # Image handling
│
├── 📁 public/                    # Static assets
│   ├── 📄 background.png
│   ├── 📄 BURKINI.png
│   ├── 📄 HIDJAB.png
│   ├── 📄 LOGO.png
│   ├── 📄 MODEST.JPG
│   └── 📄 ... (other images)
│
├── 📄 package.json               # Dependencies & scripts
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 components.json             # shadcn/ui configuration
├── 📄 eslint.config.mjs          # ESLint configuration
├── 📄 postcss.config.mjs         # PostCSS configuration
└── 📄 README.md                   # Project documentation
```

## 🔧 Component Architecture

### **Layout Components**
- **Header**: Navigation, search, cart, user menu
- **Footer**: Links, contact info, newsletter, social media

### **Section Components**
- **HeroSection**: Main homepage banner with animations
- **FeaturedCategories**: Product category showcase
- **FeaturesSection**: Company benefits and statistics

### **Product Components**
- **ProductsClient**: Main products page with filtering
- **ProductCard**: Individual product display card
- **ProductFilters**: Search, category, and sorting filters
- **ProductDetailClient**: Detailed product view

### **Order Components**
- **OrderModal**: Multi-step order form with validation

### **UI Components**
- **Base Components**: shadcn/ui primitives
- **Custom Components**: Enhanced versions with Helena Brand styling

## 📚 Type System

### **Core Types**
- `Product`: Product information and metadata
- `Customer`: Customer profile data
- `Order`: Order details and status
- `OrderData`: Order form data structure

### **Filter Types**
- `FilterState`: Current filter configuration
- `SortOption`: Available sorting options
- `CategoryOption`: Product category options

### **Airtable Types**
- `AirtableProductFields`: Database field mappings
- `AirtableAttachment`: Image attachment structure

## 🛠️ Utility Functions

### **Formatting**
- `formatPrice()`: Algerian Dinar formatting
- `formatDate()`: Arabic locale date formatting
- `formatPhoneNumber()`: Phone number standardization

### **Validation**
- `validateAlgerianPhone()`: Phone number validation
- `generateOrderId()`: Unique order ID generation

### **Storage**
- `storage`: Local storage utilities
- `sessionStorage`: Session storage utilities

### **Performance**
- `debounce()`: Function debouncing
- `throttle()`: Function throttling

## 🎨 Styling System

### **CSS Architecture**
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Animations**: Smooth transitions and effects
- **Responsive Design**: Mobile-first approach
- **RTL Support**: Right-to-left Arabic layout

### **Design Tokens**
- **Color Palette**: Rose, purple, cyan gradients
- **Typography**: Geist Sans font family
- **Spacing**: Consistent spacing scale
- **Shadows**: Layered shadow system

## 🚀 Development Workflow

### **Component Development**
1. Create component in appropriate directory
2. Export from `components/index.ts`
3. Import and use in pages
4. Add types to `lib/types.ts` if needed

### **Adding New Features**
1. Create component files
2. Update type definitions
3. Add utility functions if needed
4. Update component exports
5. Test functionality

### **File Naming Conventions**
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `formatPrice.ts`)
- **Types**: camelCase (e.g., `types.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `WILAYAS`)

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### **Mobile-First Approach**
- Start with mobile layout
- Add tablet and desktop enhancements
- Use responsive utilities for adaptation

## ♿ Accessibility Features

### **ARIA Labels**
- Proper form labeling
- Navigation landmarks
- Screen reader support

### **Keyboard Navigation**
- Focus management
- Tab order optimization
- Keyboard shortcuts

### **Reduced Motion**
- Respect user preferences
- Alternative animations
- Performance optimization

## 🔒 Security Considerations

### **Environment Variables**
- API keys in `.env.local`
- No sensitive data in client code
- Server-side validation

### **Input Validation**
- Form validation on client and server
- SQL injection prevention
- XSS protection

## 📊 Performance Optimization

### **Code Splitting**
- Route-based splitting
- Component lazy loading
- Dynamic imports

### **Image Optimization**
- Next.js Image component
- WebP format support
- Responsive image sizes

### **Caching Strategy**
- Static generation
- Incremental static regeneration
- CDN optimization

This structure provides a clean, maintainable, and scalable foundation for the Helena Brand website. 