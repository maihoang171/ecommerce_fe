// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, it, vi, expect } from "vitest";
import { CampaignHeroBanner } from "./CampaignHeroBanner";
import type { ICampaign } from "@/services/category";
import { MemoryRouter } from "react-router-dom";

describe("CampaignHeroBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display when having campaigns", () => {
    const mockCampaignPayload = {
      id: 1,
      title: "title",
      subTitle: "sub title",
      linkUrl: "/linkUrl",
      imageUrl: "/imageUrl",
    } as unknown as ICampaign;

    render(
      <MemoryRouter>
        <CampaignHeroBanner campaign={mockCampaignPayload} />
      </MemoryRouter>,
    );

    const campaignLink = screen.getByRole("link");

    expect(campaignLink).toBeInTheDocument();
    expect(campaignLink).toHaveAttribute("href", mockCampaignPayload.linkUrl);

    expect(screen.getByText("sub title")).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", mockCampaignPayload.title);
    expect(img).toHaveAttribute("src", mockCampaignPayload.imageUrl);
  });
});
