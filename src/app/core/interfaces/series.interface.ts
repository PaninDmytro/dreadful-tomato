import { EContent } from "../enums/content.enum";

export interface IImage {
  url: string;
  width: number;
  height: number;
}

export interface IPosterArt {
  posterArt: IImage;
}

export interface ISeries {
  title: string;
  description: string;
  programType: EContent;
  images: IPosterArt;
  releaseYear: number;
}

export interface ISeriesResponse {
  total: number;
  entries: ISeries[];
}
