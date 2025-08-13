from django.urls import include, path
from .import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('', views.TasksViewset, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
]
