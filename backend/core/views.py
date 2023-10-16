from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse

from core.models.decoerica import DecoErica
from core.models.quote import Quote


def crear_venta_desde_cotizacion(request, cotizacion_id):
    if request.method == 'POST':
        cotizacion = Quote.objects.get(id=cotizacion_id)

        sale = DecoErica().convert_to_sale(cotizacion)
        venta_admin_url = reverse('admin:core_sale_change', args=[sale.id])


        return redirect(venta_admin_url)
    return HttpResponse("Método no permitido")
