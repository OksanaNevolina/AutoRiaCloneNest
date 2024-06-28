export interface IQuery {
  page: number;
  limit: number;
  sortedBy: string;

  [key: string]: string | number;
}
export interface IPaginationResponseDto<T> {
  page: number;
  limit: number;
  itemsFound: number;
  data: T[];
}
