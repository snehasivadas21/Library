# Library Management API

A RESTful Library Management API built with Django and Django REST Framework.

## Tech Stack

* Python
* Django
* Django REST Framework
* django-filter
* SQLite (development)
* React (frontend)

## Project Structure

```text
library-management/
├── backend/
│   ├── manage.py
│   ├── config/
│   └── books/
├── .env.example
├── .gitignore
└── README.md
```

## Backend Setup

### 1. Create and activate virtual environment

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the values in `.env`.

### 4. Run migrations

```bash
cd backend
python manage.py migrate
```

### 5. Start the development server

```bash
python manage.py runserver
```

The API will be available at:

```text
http://127.0.0.1:8000/
```

## API

The main API endpoint will be:

```text
/api/books/
```

The API supports:

* Book CRUD operations
* Category filtering
* Availability filtering
* Title and author search
* Published-date ordering
* Pagination
