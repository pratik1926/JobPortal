export default function ApplicationPagination({
  page,
  totalPages,
  setPage,
}) {

  return (
    <div className="flex justify-between items-center mt-8">

      <button
        onClick={() =>
          setPage((p) => Math.max(p - 1, 1))
        }
        disabled={page === 1}
        className="px-4 py-2 bg-slate-200 rounded-xl"
      >
        Prev
      </button>

      <span className="font-medium">
        Page {page} / {totalPages || 1}
      </span>

      <button
        onClick={() =>
          setPage((p) =>
            Math.min(p + 1, totalPages)
          )
        }
        disabled={
          page === totalPages ||
          totalPages === 0
        }
        className="px-4 py-2 bg-slate-200 rounded-xl"
      >
        Next
      </button>

    </div>
  );
}