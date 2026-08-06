import type { IProduct } from "@/features/product/services/product";

export const mockProducts: IProduct[] = [
  {
    id: 1,
    name: "Summer Floral Midi Dress",
    price: 89.99,
    discountPrice: 65.0,
    discountStartAt: "2026-06-01T00:00:00Z",
    discountEndAt: "2026-06-30T23:59:59Z",
    description: "Light, breezy, and perfect for the summer heat.",
    categoryId: "101",
    images: [
      {
        id: 1,
        color: "Red",
        imageUrl: "/assets/products/floral-dress-red.jpg",
        isPrimary: true,
      },
      {
        id: 2,
        color: "Red",
        imageUrl: "/assets/products/floral-dress-red-back.jpg",
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: 1,
        size: "S",
        color: "Red",
        stockQuantity: 0,
        sku: "DRS-FLR-RED-S",
      },
      {
        id: 2,
        size: "M",
        color: "Red",
        stockQuantity: 5,
        sku: "DRS-FLR-RED-M",
      },
      {
        id: 3,
        size: "L",
        color: "Red",
        stockQuantity: 2,
        sku: "DRS-FLR-RED-L",
      },
      {
        id: 4,
        size: "S",
        color: "Blue",
        stockQuantity: 10,
        sku: "DRS-FLR-BLU-S",
      },
      {
        id: 5,
        size: "M",
        color: "Blue",
        stockQuantity: 0,
        sku: "DRS-FLR-BLU-M",
      },
    ],
    relatedProducts: [
      {
        id: 2,
        name: "Evening Slip Dress",
        price: 120.0,
        description: "Elegant silk slip dress for formal occasions.",
        categoryId: "101",
        images: [
          {
            id: 1,
            color: "Black",
            imageUrl: "/assets/products/slip-dress-black.jpg",
            isPrimary: true,
          },
        ],
        variants: [
          {
            id: 1,
            size: "S",
            color: "Black",
            stockQuantity: 8,
            sku: "DRS-SLP-BLK-S",
          },
        ],
        relatedProducts: [],
      },
      {
        id: 3,
        name: "Casual Cotton Sun Dress",
        price: 45.0,
        description: "Comfortable cotton dress for everyday wear.",
        categoryId: "101",
        images: [
          {
            id: 1,
            color: "Yellow",
            imageUrl: "/assets/products/sun-dress-yellow.jpg",
            isPrimary: true,
          },
        ],
        variants: [
          {
            id: 2,
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
    id: 2,
    name: "Evening Slip Dress",
    price: 120.0,
    description: "Elegant silk slip dress for formal occasions.",
    categoryId: "101",
    images: [
      {
        id: 1,
        color: "Black",
        imageUrl: "/assets/products/slip-dress-black.jpg",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 1,
        size: "S",
        color: "Black",
        stockQuantity: 8,
        sku: "DRS-SLP-BLK-S",
      },
      {
        id: 2,
        size: "M",
        color: "Black",
        stockQuantity: 12,
        sku: "DRS-SLP-BLK-M",
      },
    ],
    relatedProducts: [],
  },
];
