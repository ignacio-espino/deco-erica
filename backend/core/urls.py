from django.contrib import admin
from django.urls import path

import core.endpoints.calculator
from core.endpoints import endpoints
from . import views

urlpatterns = [
    path('login/', endpoints.LoginEndpoint.as_view(), name='login'),
    path('logout/', endpoints.LogoutEndpoint.as_view(), name='logout'),

    path('task/', endpoints.GetTaskEndpoint.as_view(), name='task'),
    path('tasks/', endpoints.GetTasksEndpoint.as_view(), name='tasks'),
    path('rooms/', endpoints.GetRoomsEndpoint.as_view(), name='rooms'),
    path('create-task/', endpoints.CreateTaskEndpoint.as_view(), name='create-task'),
    path('create-quotation/', endpoints.CreateQuotationEndpoint.as_view(), name='create-quotation'),
    path('calculate-money-values/', core.endpoints.calculator.CalculatorEndpoint.as_view(), name='calculate-money-values'),
    path('crear_venta/<int:cotizacion_id>/', views.crear_venta_desde_cotizacion, name='crear_venta_desde_cotizacion'),
]


admin.site.site_header = 'Backoffice de Deco Erica'
admin.site.index_title = 'Administración de Deco Erica'
admin.site.site_title = 'Backoffice Deco Erica'
