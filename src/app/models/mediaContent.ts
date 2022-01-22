export interface MediaContent {
  id: number;
  title: string;
  score?:string;
  creationDate?: string;
  mediaType?: string;
  poster?: string;
}

export interface MediaContentReviewDTO {
  title: string;
  creationDate?: string;
  mediaType?: string;
  poster?: string;
}
