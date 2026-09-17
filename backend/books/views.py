from django.shortcuts import render

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets,filters

from .models import Book
from .serializers import BookSerializer
from .pagination import BookPagination
# Create your views here.
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = BookPagination

    filter_backends = [DjangoFilterBackend,filters.SearchFilter,filters.OrderingFilter]

    filter_fields = ["category","is_available"]

    search_fields = ["title","author"]

    ordering_fields = ["published_date"]

    ordering = ["published_date"]