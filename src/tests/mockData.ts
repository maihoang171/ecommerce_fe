import type { IUser } from "@/features/auth/services/auth";
import type { IParentCategory } from "@/features/category/services/category";
import type { IProduct } from "@/features/product/services/product";
import type { ICartItem } from "@/features/cart/stores/useCartStore";

export const mockCategoryList: IParentCategory[] = [
  {
    id: "1",
    parentId: null,
    name: "WOMEN",
    slug: "women",
    imageUrl: "/assets/categories/women-main.jpg",
    type: undefined,
    children: [
      {
        id: "101",
        name: "Dresses",
        slug: "dresses",
        imageUrl: "/assets/categories/dresses.jpg",
        type: "TOP",
      },
      {
        id: "102",
        name: "Tops",
        slug: "tops",
        imageUrl: "/assets/categories/tops.jpg",
        type: "TOP",
      },
      {
        id: "103",
        name: "Bottoms",
        slug: "bottoms",
        imageUrl: "/assets/categories/bottoms.jpg",
        type: "BOTTOM",
      },
    ],
    campaigns: [
      {
        id: "camp-1",
        title: "Summer Lookbook",
        subTitle: "Breezy styles for the heat",
        linkUrl: "/campaigns/summer",
        imageUrl: "/assets/campaigns/summer-banner.jpg",
      },
      {
        id: "camp-2",
        title: "Clearance Sale",
        subTitle: "Up to 50% off",
        linkUrl: "/campaigns/clearance",
        imageUrl: "/assets/campaigns/clearance-banner.jpg",
      },
    ],
  },
  {
    id: "2",
    parentId: null,
    name: "MEN",
    slug: "men",
    imageUrl: "/assets/categories/men-main.jpg",
    type: "PARENT",
    children: [
      {
        id: "201",
        name: "Shirts",
        slug: "shirts",
        imageUrl: "/assets/categories/shirts.jpg",
        type: "TOP",
      },
      {
        id: "202",
        name: "Pants",
        slug: "pants",
        imageUrl: "/assets/categories/pants.jpg",
        type: "Bottom",
      },
      {
        id: "203",
        name: "Outerwear",
        slug: "outerwear",
        imageUrl: "/assets/categories/outerwear.jpg",
        type: "TOP",
      },
    ],
    campaigns: [
      {
        id: "camp-3",
        title: "New Arrivals",
        subTitle: "Fresh fits for the season",
        linkUrl: "/campaigns/new-arrivals",
        imageUrl: "/assets/campaigns/new-arrivals-banner.jpg",
      },
    ],
  },
];

export const mockProductList: IProduct[] = [
  {
    id: "1",
    name: "Summer Floral Midi Dress",
    price: 89.99,
    discountPrice: 65.0,
    discountStartAt: "2026-06-01T00:00:00Z",
    discountEndAt: "2026-06-30T23:59:59Z",
    description: "Light, breezy, and perfect for the summer heat.",
    categoryId: "101",
    images: [
      {
        id: "img-1-a",
        color: "Red",
        imageUrl: "/assets/products/floral-dress-red.jpg",
        isPrimary: true,
      },
      {
        id: "img-1-a-2",
        color: "Red",
        imageUrl: "/assets/products/floral-dress-red-back.jpg",
        isPrimary: false,
      },
      {
        id: "img-1-b",
        color: "Blue",
        imageUrl: "/assets/products/floral-dress-blue.jpg",
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: "var-1-sm-red",
        size: "S",
        color: "Red",
        stockQuantity: 0,
        sku: "DRS-FLR-RED-S",
      },
      {
        id: "var-1-md-red",
        size: "M",
        color: "Red",
        stockQuantity: 5,
        sku: "DRS-FLR-RED-M",
      },
      {
        id: "var-1-lg-red",
        size: "L",
        color: "Red",
        stockQuantity: 2,
        sku: "DRS-FLR-RED-L",
      },
      {
        id: "var-1-sm-blu",
        size: "S",
        color: "Blue",
        stockQuantity: 10,
        sku: "DRS-FLR-BLU-S",
      },
      {
        id: "var-1-md-blu",
        size: "M",
        color: "Blue",
        stockQuantity: 0,
        sku: "DRS-FLR-BLU-M",
      },
    ],
    relatedProducts: [
      {
        id: "prod-2",
        name: "Evening Slip Dress",
        price: 120.0,
        description: "Elegant silk slip dress for formal occasions.",
        categoryId: "101",
        images: [
          {
            id: "img-2-a",
            color: "Black",
            imageUrl: "/assets/products/slip-dress-black.jpg",
            isPrimary: true,
          },
        ],
        variants: [
          {
            id: "var-2-sm-blk",
            size: "S",
            color: "Black",
            stockQuantity: 8,
            sku: "DRS-SLP-BLK-S",
          },
        ],
        relatedProducts: [],
      },
      {
        id: "prod-3",
        name: "Casual Cotton Sun Dress",
        price: 45.0,
        description: "Comfortable cotton dress for everyday wear.",
        categoryId: "101",
        images: [
          {
            id: "img-3-a",
            color: "Yellow",
            imageUrl: "/assets/products/sun-dress-yellow.jpg",
            isPrimary: true,
          },
        ],
        variants: [
          {
            id: "var-3-sm-ylw",
            size: "S",
            color: "Yellow",
            stockQuantity: 15,
            sku: "DRS-SUN-YLW-S",
          },
        ],
        relatedProducts: [],
      },
    ],
  },
  {
    id: "prod-2",
    name: "Evening Slip Dress",
    price: 120.0,
    description: "Elegant silk slip dress for formal occasions.",
    categoryId: "101",
    images: [
      {
        id: "img-2-a",
        color: "Black",
        imageUrl: "/assets/products/slip-dress-black.jpg",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-2-sm-blk",
        size: "S",
        color: "Black",
        stockQuantity: 8,
        sku: "DRS-SLP-BLK-S",
      },
      {
        id: "var-2-md-blk",
        size: "M",
        color: "Black",
        stockQuantity: 12,
        sku: "DRS-SLP-BLK-M",
      },
    ],
    relatedProducts: [],
  },
];

export const mockUserData: IUser = {
  id: "1",
  username: "user1",
  isAdmin: false,
};

export const mockCartItem1: ICartItem = {
  productId: 101,
  color: "Black",
  size: "M",
  quantity: 2,
  stockQuantity: 10,
};

export const mockCartItem2: ICartItem = {
  productId: 102,
  color: "White",
  size: "L",
  quantity: 1,
  stockQuantity: 5,
};

export const mockCartItem3: ICartItem = {
  productId: 103,
  color: "Navy Blue",
  size: "S",
  quantity: 3,
  stockQuantity: 3, 
};

export const mockCartItems: ICartItem[] = [
  mockCartItem1,
  mockCartItem2,
  mockCartItem3,
];