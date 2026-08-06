import { mockCategoryList } from "./mockCategoryListData";
import { mockProducts } from "./mockProductData";

export const mockValidUserDataInput = {
  username: "user1",
  password: "User1234@",
};

export const mockAuthSuccessResponse = {
  success: true,
  accessToken: "mockAccessToken",
  data: {
    id: 1,
    username: "Username123",
    isAdmin: false,
  },
};

export const mockCampaignListResponse = {
  success: true,
  data: mockCategoryList[0].campaigns,
};

export const mockCategoryListResponse = {
  success: true,
  data: mockCategoryList,
};

export const mockProductListResponse = {
  success: true,
  data: mockProducts,
};

export const mockProductCardResponse = {
  success: true,
  data: mockProducts[0],
};

export const mockProductResponse = {
  success: true,
  data: mockProducts[0],
};
