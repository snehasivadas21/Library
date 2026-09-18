import { useEffect, useState } from "react";
import { getBooks, createBook, updateBook, deleteBook  } from "./api";
import BookFormModal from "./components/BookFormModal";
import ConfirmModal from "./components/ConfirmModal";
import Pagination from "./components/Pagination";

function App() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [ordering, setOrdering] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    published_date: "",
    isbn: "",
    category: "",
    is_available: true,
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    published_date: "",
    isbn: "",
    category: "",
    is_available: true,
  });
  const [editFormError, setEditFormError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBook, setDeletingBook] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        search: search || undefined,
        category: category || undefined,
        is_available: availability || undefined,
        ordering: ordering || undefined,
        page,
        page_size: pageSize
      };

      const response = await getBooks(params);

      setBooks(response.data.results);

      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous
      })
    } catch (err) {
      console.error(err);
      setError("Failed to load books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [search, category, availability, ordering, page, pageSize]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setAvailability("");
    setOrdering("");
    setPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      await createBook(formData);

      setFormData({
        title: "",
        author: "",
        published_date: "",
        isbn: "",
        category: "",
        is_available: true,
      });

      setShowForm(false);

      await loadBooks();
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      if (data) {
        const messages = Object.entries(data)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("\n");

        setFormError(messages);
      } else {
        setFormError("Failed to create book.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditClick = (book) => {
    setEditingBookId(book.id);

    setEditFormData({
      title: book.title,
      author: book.author,
      published_date: book.published_date,
      isbn: book.isbn,
      category: book.category,
      is_available: book.is_available,
    });

    setEditFormError("");
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      setEditSaving(true);
      setEditFormError("");

      await updateBook(editingBookId, editFormData);

      setShowEditForm(false);
      setEditingBookId(null);

      await loadBooks();
    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      if (data) {
        const messages = Object.entries(data)
          .map(([field, errors]) => `${field}: ${errors.join(", ")}`)
          .join("\n");

        setEditFormError(messages);
      } else {
        setEditFormError("Failed to update book.");
      }
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteClick = (book) => {
    setDeletingBook(book);
    setDeleteError("");
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteBook(deletingBook.id);

      setShowDeleteConfirm(false);
      setDeletingBook(null);

      await loadBooks();
    } catch (err) {
      console.error(err);

      setDeleteError("Failed to delete the book.");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-3xl font-bold">Library Management</h1>
          <p className="mt-1 text-slate-300">
            Manage your collection of books
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {showForm && (
          <BookFormModal
            mode="add"
            formData={formData}
            formError={formError}
            saving={saving}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        )}

        {showEditForm && (
          <BookFormModal
            mode="edit"
            formData={editFormData}
            formError={editFormError}
            saving={editSaving}
            onChange={handleEditInputChange}
            onSubmit={handleEditSubmit}
            onClose={() => {
              setShowEditForm(false);
              setEditingBookId(null);
            }}
          />
        )}

        {showDeleteConfirm && deletingBook && (
          <ConfirmModal
            title="Delete Book"
            message={
              deleteError
                ? deleteError
                : `Are you sure you want to delete "${deletingBook.title}"? This action cannot be undone.`
            }
            confirming={deleting}
            onConfirm={handleDeleteConfirm}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setDeletingBook(null);
              setDeleteError("");
            }}
          />
        )}
        {/* Filters */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Find Books
            </h2>

            <button
              onClick={clearFilters}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>

              <input
                type="text"
                placeholder="Title or author..."
                value={search}
                onChange={(e) => {setSearch(e.target.value); setPage(1)}}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => {setCategory(e.target.value); setPage(1)}}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="Fiction">Fiction</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="History">History</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Availability
              </label>

              <select
                value={availability}
                onChange={(e) => {setAvailability(e.target.value); setPage(1)}}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="">All Books</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </div>

            {/* Ordering */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sort by Published Date
              </label>

              <select
                value={ordering}
                onChange={(e) => {setOrdering(e.target.value); setPage(1)}}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              >
                <option value="">Default</option>
                <option value="published_date">
                  Oldest First
                </option>
                <option value="-published_date">
                  Newest First
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Book Collection
            </h2>
            <p className="text-gray-500">
              Browse and manage your library
            </p>
          </div>

          <button
            onClick={() => {
              setFormError("");
              setShowForm(true);
            }}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700"
          >
            + Add Book
          </button>
        </div>

        {/* Table */}
        <section className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Books
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading books...
            </div>
          ) : books.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No books found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-sm uppercase text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Published</th>
                    <th className="px-6 py-4">ISBN</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr
                      key={book.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {book.title}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {book.author}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {book.published_date}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {book.isbn}
                      </td>

                      <td className="px-6 py-4">
                        {book.is_available ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Available
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                            Unavailable
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(book)}
                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteClick(book)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={pagination.count}
                hasNext={Boolean(pagination.next)}
                hasPrevious={Boolean(pagination.previous)}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;