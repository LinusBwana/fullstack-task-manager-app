from tasks.models import Task
from .serializers import TaskSerializer
from rest_framework import viewsets

# Create your views here.
class TasksViewset(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('created_at')
    serializer_class = TaskSerializer