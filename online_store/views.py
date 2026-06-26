from django.shortcuts import render, redirect, get_object_or_404, get_list_or_404
from django.http import HttpResponse
from django.views import View
from .models import *
# Create your views here.


class IndexView(View):
    def get(self, request):
        featured = ItemsModel.objects.filter(is_featured=True, is_available=True)
        #featured = get_object_or_404(ItemsModel, is_featured=True)
        context = {
            "featured": featured,
        }
        return render(request, "online_store/index.html", context)


class CategoryView(View):
    def get(self, request, slug):
        #items = ItemsModel.objects.all().filter(category__slug=slug, is_available=True)
        items = get_list_or_404(ItemsModel, category__slug=slug, is_available=True)
        items_count = len(items)
        catname = CategoryModel.objects.get(slug=slug).name
        context = {
            "items": items,
            "items_count": items_count,
            "catname": catname,
        }
        return render(request, "online_store/category.html", context)


class AllProductsView(View):
    
    def get(self, request):
        all_products = get_list_or_404(ItemsModel, is_available=True)
        items_count = len(all_products)

        context = {
            "items": all_products,
            "items_count": items_count,
            "catname": "All Products",
        }

        return render(request, "online_store/category.html", context)


