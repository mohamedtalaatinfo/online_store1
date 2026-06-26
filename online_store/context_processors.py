from .models import *


def global_site_data(request):
    cat = CategoryModel.objects.all()

    context = {
        "categories": cat,
    }

    return context
