import { EContent } from "../enums/content.enum";

export interface IMovieResponse {
  total: number;
  entries: IMovie[];
}

export interface IMovie {
  title: string,
  description: string,
  programType: EContent,
  images: IImages
  releaseYear: number
}

export interface IImages {
  posterArt: IPosterArt
}

export interface IPosterArt {
  url: string,
  width: number,
  height: number
}
