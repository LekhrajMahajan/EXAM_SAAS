export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export const getPagination = ({
  page = 1,
  limit = 10,
}: PaginationQuery) => {
  const currentPage = Math.max(1, Number(page));
  const currentLimit = Math.max(1, Number(limit));

  return {
    page: currentPage,
    limit: currentLimit,
    skip: (currentPage - 1) * currentLimit,
  };
};