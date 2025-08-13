from tasks.models import Task
from .serializers import TaskSerializer
from rest_framework import viewsets

# Create your views here.
class TasksViewset(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer