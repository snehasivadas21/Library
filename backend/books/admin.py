from django.contrib import admin

# Register your models here.

from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "author",
        "published_date",
        "isbn",
        "category",
        "is_available",
    )
    list_filter = ("category", "is_available")
    search_fields = ("title", "author", "isbn")