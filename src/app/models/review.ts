import { MediaContentReviewDTO } from "./mediaContent";

export interface ReviewProfileDTO {
  id: number,
  mediaContent: MediaContentReviewDTO,
  content: string;
  createdAt: string;
  rating: number;
}
