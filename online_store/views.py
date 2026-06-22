from django.shortcuts import render, redirect
from django.http import HttpResponse
# Create your views here.


def Index(request):

    return render(request, "online_store/index.html")
