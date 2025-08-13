from django.shortcuts import HttpResponse

# Create your views here.
def tasksViews(request):
    return HttpResponse("Hey Api")