import React from 'react'

const Pagination = ({totalPages,currentPage,onPageChange}) => {
    const generatePages = () => {
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, "...", totalPages);
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return pages;
    };
    return (
        <div className="flex justify-center mt-6 space-x-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50"
            >
                Prev
            </button>

            {generatePages().map((page, idx) =>
                page === "..." ? (
                    <span key={idx} className="px-3 py-1 text-sm text-gray-500">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 text-sm border rounded ${page === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-blue-100"
                            }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;
