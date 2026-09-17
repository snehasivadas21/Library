from rest_framework import serializers
from .models import Book
from datetime import date

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id","title","author","published_date","isbn","category","is_available"]
        read_only_fields = ["id"]

    def validate_title(self,value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Title cannot be empty.")

        if len(value) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        return value
    
    def validate_author(self,value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Author cannot be empty.")

        if len(value) < 2:
            raise serializers.ValidationError("Author must be at least 2 characters long.")
        return value

    def validate_published_date(self,value):
        if value>date.today():
            raise serializers.ValidationError("Published date cannot be in the future.")
        return value

    def validate_isbn(self, value):
        value = value.strip().replace("-", "").replace(" ", "")

        if not value.isdigit():
            raise serializers.ValidationError("ISBN must contain only numbers, spaces, or hyphens.")

        if len(value) not in [10, 13]:
            raise serializers.ValidationError("ISBN must contain either 10 or 13 digits.")
        return value
    
    def validate_category(self,value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Category cannot be empty.")

        if len(value) < 2:
            raise serializers.ValidationError("Category must be at least 2 characters long.")
        return value

    def validate(self,attrs):
        title = attrs.get("title")
        author = attrs.get("author")

        if title and author and title.lower() ==  author.lower():
            raise serializers.ValidationError("Title and author cannot be the same")
        return attrs
        