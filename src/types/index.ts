export type CategorySlug =
  | "all"
  | "jordan-1"
  | "jordan-4"
  | "jordan-retro"
  | "jordan-11"
  | "travis-scott"
  | "dunk-lifestyle";

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  featured?: boolean;
  itemCount: number;
  badge?: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface ProductVariant {
  id: string;
  color?: string;
  size?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  colorName?: string;
}

export interface ProductSpecification {
  group: string;
  items: {
    label: string;
    value: string;
  }[];
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  images?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  details: string[];
  features: string[];
  price: number; // in Tomans
  compareAtPrice?: number;
  category: CategorySlug;
  categoryName: string;
  brand: string;
  series: string; // e.g. "Air Jordan 1", "Air Jordan 4"
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  colors?: ProductColor[];
  sizes?: string[]; // EU sizes: "39", "40", "41", "42", "42.5", "43", "44", "44.5", "45"
  images: ProductImage[];
  specifications: ProductSpecification[];
  materialsAndCare?: string[];
  shippingInfo?: string;
  warranty?: string;
  tags: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor?: ProductColor;
  selectedSize?: string;
  quantity: number;
  price: number;
  addedAt: number;
}

export interface PromoCode {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSubtotal?: number;
  description: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
  freeAbove?: number;
}

export interface CartSummary {
  subtotal: number;
  discountAmount: number;
  appliedPromo?: PromoCode;
  shippingAmount: number;
  taxAmount: number;
  total: number;
  itemCount: number;
  freeShippingProgress: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

export type SortOption =
  | "featured"
  | "price-low-to-high"
  | "price-high-to-low"
  | "highest-rated"
  | "newest";

export type ViewMode = "grid-4" | "grid-3" | "grid-2" | "list";

export interface FilterState {
  searchQuery: string;
  categories: CategorySlug[];
  brands: string[];
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: SortOption;
  page: number;
  itemsPerPage: number;
}

export type CurrencyCode = "TMN" | "USD" | "AED";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // relative to TMN base
  decimals: number;
  symbolPosition: "prefix" | "suffix";
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  saveAddress?: boolean;
}

export interface PaymentDetails {
  method: "online_gateway" | "card_to_card" | "crypto";
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  sameAsShipping: boolean;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  shippingOptionId: string;
  paymentDetails: PaymentDetails;
  orderNotes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string;
  colorName?: string;
  size?: string;
  price: number;
  quantity: number;
  total: number;
}

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingOption: ShippingOption;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: CurrencyCode;
  estimatedDelivery: string;
  trackingNumber: string;
  carrier: string;
}

export type ToastType = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
