from django.urls import path

from core.endpoints import endpoints

urlpatterns = [
    path('login/', endpoints.LoginEndpoint.as_view(), name='login'),
    path('logout/', endpoints.LogoutEndpoint.as_view(), name='logout'),

    path('task/', endpoints.GetTaskEndpoint.as_view(), name='task'),
    path('tasks/', endpoints.GetTasksEndpoint.as_view(), name='tasks'),
    path('create-task/', endpoints.CreateTaskEndpoint.as_view(), name='create-task'),
]
