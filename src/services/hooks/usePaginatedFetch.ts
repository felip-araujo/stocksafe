import { useEffect, useState } from "react";
import api from "@/services/api/api";

interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

export function usePaginatedFetch<T>(endpoint: string, limit = 5) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<PaginationResponse<T>>(
        `${endpoint}?page=${pageNumber}&limit=${limit}`
      );
      setData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
      setPage(res.data.pagination.page);
    } catch (err) {
      console.error("Erro ao buscar dados paginados:", err);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [endpoint, page]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const refresh = () => fetchData(page);

  return {
    data,
    page,
    totalPages,
    loading,
    error,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  };
}
