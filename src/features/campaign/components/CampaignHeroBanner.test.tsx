// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, it, vi, expect } from "vitest";
import { CampaignHeroBanner } from "./CampaignHeroBanner";
import { MemoryRouter } from "react-router-dom";
import { mockCategoryList } from "@/tests/mockData";

describe("CampaignHeroBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display when having campaigns", () => {
    const mockCampaignPayload = mockCategoryList[0].campaigns[0];

    render(
      <MemoryRouter>
        <CampaignHeroBanner campaign={mockCampaignPayload} />
      </MemoryRouter>,
    );

    const campaignLink = screen.getByRole("link");

    expect(campaignLink).toBeInTheDocument();
    expect(campaignLink).toHaveAttribute("href", mockCampaignPayload.linkUrl);

    expect(
      screen.getByText(mockCategoryList[0].campaigns[0].subTitle),
    ).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", mockCampaignPayload.title);
    expect(img).toHaveAttribute("src", mockCampaignPayload.imageUrl);
  });
});
