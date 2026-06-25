from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.views import View
from .models import *
# Create your views here.


class IndexView(View):
    def get(self, request):
        categories = CategoryModel.objects.all()
        context = {
            "categories" : categories,
        }
        return render(request, "online_store/index.html", context)
