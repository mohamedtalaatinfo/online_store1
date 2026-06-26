from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views import View
from .models import *
# Create your views here.


class IndexView(View):
    def get(self, request):
        categories = CategoryModel.objects.all()
        featured = ItemsModel.objects.filter(is_featured=True)
        context = {
            "categories" : categories,
            "featured": featured
        }
        return render(request, "online_store/index.html", context)


class CategoryView(View):
    def get(self, request, slug):
        items = ItemsModel.objects.all().filter(category__slug=slug, is_available=True)
        items_count = items.count()
        catname = CategoryModel.objects.get(slug=slug).name
        context = {
            "items": items,
            "items_count": items_count,
            "catname": catname,
        }
        return render(request, "online_store/category.html", context)
