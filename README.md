# Library Management System

A full-stack Library Management System built with **Django REST Framework** for the backend and **React + Vite + Tailwind CSS** for the frontend.

The application allows users to manage books through a REST API and a responsive web interface with CRUD operations, search, filtering, sorting, and pagination.

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* django-filter
* SQLite
* django-cors-headers

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* JavaScript

---

## Project Structure

```text
library-management/
│
├── .env
├── .env.example
├── .gitignore
├── README.md
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── db.sqlite3
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── books/
│       ├── migrations/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── pagination.py
│       ├── serializers.py
│       ├── tests.py
│       ├── urls.py
│       └── views.py
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/
        │   ├── BookFormModal.jsx
        │   ├── ConfirmModal.jsx
        │   └── Pagination.jsx
        ├── api.js
        ├── App.jsx
        ├── index.css
        └── main.jsx
```

---

# Backend Setup

## 1. Create and activate a virtual environment

From the project root:

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 2. Install backend dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the required packages:

```bash
pip install -r requirements.txt
```

---

## 3. Configure environment variables

Create a `.env` file in the project root:

```env
DEBUG=True
SECRET_KEY=django-insecure-change-this-later
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

The `.env` file should not be committed to Git.

A `.env.example` file is included as a template.

---

## 4. Run migrations

From the `backend` directory:

```bash
python manage.py migrate
```

---

## 5. Run the backend server

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000/
```

The API is available under:

```text
http://127.0.0.1:8000/api/
```

---

# Book Model

The application uses the following book fields:

| Field            | Type    | Description                             |
| ---------------- | ------- | --------------------------------------- |
| `id`             | Integer | Automatically generated ID              |
| `title`          | String  | Book title                              |
| `author`         | String  | Book author                             |
| `published_date` | Date    | Publication date                        |
| `isbn`           | String  | Unique ISBN                             |
| `category`       | String  | Book category                           |
| `is_available`   | Boolean | Whether the book is currently available |

`is_available` defaults to `true`.

---

# API Endpoints

## List Books

```http
GET /api/books/
```

Example:

```text
GET http://127.0.0.1:8000/api/books/
```

The API returns paginated results.

Example response:

```json
{
  "count": 12,
  "next": "http://127.0.0.1:8000/api/books/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "published_date": "1925-04-10",
      "isbn": "9780743273565",
      "category": "Fiction",
      "is_available": true
    }
  ]
}
```

---

## Create a Book

```http
POST /api/books/
```

Example request:

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "published_date": "1925-04-10",
  "isbn": "9780743273565",
  "category": "Fiction",
  "is_available": true
}
```

---

## Retrieve a Book

```http
GET /api/books/<id>/
```

Example:

```text
GET /api/books/1/
```

---

## Update a Book

```http
PUT /api/books/<id>/
```

Example:

```text
PUT /api/books/1/
```

The API also supports partial updates:

```http
PATCH /api/books/<id>/
```

---

## Delete a Book

```http
DELETE /api/books/<id>/
```

Example:

```text
DELETE /api/books/1/
```

---

# Search and Filtering

The API supports filtering and searching through query parameters.

## Search by title or author

```text
GET /api/books/?search=gatsby
```

Search applies to:

* title
* author

Example:

```text
/api/books/?search=tolkien
```

---

## Filter by category

```text
GET /api/books/?category=Fiction
```

Example:

```text
/api/books/?category=Sci-Fi
```

---

## Filter by availability

Available books:

```text
/api/books/?is_available=true
```

Unavailable books:

```text
/api/books/?is_available=false
```

---

## Combine filters

Multiple query parameters can be combined.

Example:

```text
/api/books/?category=Fiction&is_available=true
```

Search and filtering can also be combined:

```text
/api/books/?search=tolkien&category=Fiction&is_available=true
```

---

# Ordering

Books can be ordered by publication date.

## Oldest first

```text
/api/books/?ordering=published_date
```

## Newest first

```text
/api/books/?ordering=-published_date
```

---

# Pagination

The API uses Django REST Framework's `PageNumberPagination`.

### Default page size

The default is:

```text
5 books per page
```

Example:

```text
/api/books/?page=1
```

### Custom page size

The frontend can request a different page size:

```text
/api/books/?page=1&page_size=10
```

Supported values in the frontend are:

```text
5
10
15
20
```

The backend enforces a maximum page size of:

```text
20
```

Example:

```text
/api/books/?page=2&page_size=20
```

---

# Frontend Setup

Open a new terminal while the Django server is running.

From the project root:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Start the frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173/
```

---

# Frontend Features

The React application provides:

### Book Management

* View books
* Add books
* Edit books
* Delete books
* Delete confirmation dialog

### Search

Search books by:

* Title
* Author

### Filtering

Filter books by:

* Category
* Availability

### Sorting

Sort books by publication date:

* Oldest first
* Newest first

### Pagination

The table supports:

* Previous page
* Next page
* Current page indicator
* 5 books per page
* 10 books per page
* 15 books per page
* 20 books per page

Pagination is handled by the Django REST Framework API rather than loading all books into the browser.

---

# Frontend Components

The frontend intentionally keeps application logic in `App.jsx` while extracting reusable UI components.

## `App.jsx`

Responsible for:

* Book state
* API calls
* Search
* Filtering
* Sorting
* Pagination state
* CRUD operations
* Loading and error states

## `BookFormModal.jsx`

A shared form modal used for both:

* Adding books
* Editing books

The component changes its title and submit behavior based on the current mode.

## `ConfirmModal.jsx`

A reusable confirmation modal used before deleting a book.

## `Pagination.jsx`

Handles the pagination UI:

* Page-size selection
* Previous button
* Next button
* Page indicator

The actual pagination state and API logic remain in `App.jsx`.

---

# Running the Full Application

You need two terminals.

## Terminal 1 — Backend

```bash
cd backend
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000/
```

## Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173/
```

Open the frontend URL in your browser.

---

# CORS

The backend uses `django-cors-headers` to allow requests from the React development server.

The allowed frontend origin is configured through:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

If the frontend is running on another origin, update the environment variable accordingly.

---

# Development Notes

The backend and frontend are intentionally separated:

```text
React Frontend
      │
      │ HTTP / JSON
      ▼
Django REST API
      │
      ▼
SQLite Database
```

The React application communicates with the backend using Axios.

The backend is responsible for:

* Data persistence
* Validation
* Filtering
* Searching
* Ordering
* Pagination
* CRUD operations

The frontend is responsible for:

* User interface
* Form interaction
* Search/filter controls
* Table display
* Pagination controls
* Confirmation dialogs
* Displaying API errors

---

# API Base URL

The frontend currently uses:

```text
http://127.0.0.1:8000/api
```

This is configured in:

```text
frontend/src/api.js
```

