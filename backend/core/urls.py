from django.contrib import admin
from django.urls import path

from core.endpoints import endpoints

urlpatterns = [
    path('login/', endpoints.LoginEndpoint.as_view(), name='login'),
    path('logout/', endpoints.LogoutEndpoint.as_view(), name='logout'),

    path('task/', endpoints.GetTaskEndpoint.as_view(), name='task'),
    path('tasks/', endpoints.GetTasksEndpoint.as_view(), name='tasks'),
    path('rooms/', endpoints.GetRoomsEndpoint.as_view(), name='rooms'),
    path('create-task/', endpoints.CreateTaskEndpoint.as_view(), name='create-task'),
    path('create-quotation/', endpoints.CreateQuotationEndpoint.as_view(), name='create-quotation'),
    path('calculate-money-values/', endpoints.CalculatorEndpoint.as_view(), name='calculate-money-values'),
]


admin.site.site_header = 'Backoffice de Deco Erica'
admin.site.index_title = 'Administración de Deco Erica'
admin.site.site_title = 'Backoffice Deco Erica'
