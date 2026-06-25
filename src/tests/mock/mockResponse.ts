import { mockCategoryList, mockProductList } from "./mockData";

export const mockValidUserDataInput = {
  username: "user1",
  password: "User1234@",
};

export const mockAuthSuccessResponse = {
  success: true,
  accessToken: "mockAccessToken",
  data: {
    id: "usr-123",
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
  data: mockProductList,
};

export const mockProductDetailResponse = {
  success: true,
  data: mockProductList[0],
};
