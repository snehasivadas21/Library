from django.db import models

# Create your models here.
class Book(models.Model):
    class Category(models.TextChoices):
        FICTION = "Fiction", "Fiction"
        SCI_FI = "Sci-Fi", "Sci-Fi"
        HISTORY = "History", "History"

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    published_date = models.DateField()
    isbn = models.CharField(max_length=13,unique=True)
    category = models.CharField(max_length=100,choices=Category.choices)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title
