import { useState, useMemo } from 'react'

interface UsePaginationOptions {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

export function usePagination({ totalItems, itemsPerPage = 10, initialPage = 1 }: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const pageNumbers = useMemo(() => {
    const pages: number[] = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }, [currentPage, totalPages])

  function goToPage(page: number) {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const offset = (currentPage - 1) * itemsPerPage

  return {
    currentPage,
    totalPages,
    pageNumbers,
    goToPage,
    goNext: () => goToPage(currentPage + 1),
    goPrev: () => goToPage(currentPage - 1),
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  }
}
