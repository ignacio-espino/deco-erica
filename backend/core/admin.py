import csv

from django.contrib import admin
from django.forms import forms
from django.shortcuts import render, redirect
from django.urls import path

from core.managment.commands.import_csv import import_csv_data
from core.models.curtain_quote_entry import CurtainQuoteEntry
from core.models.curtain_system import CurtainSystem
from core.models.customer import Customer
from core.models.fabric import Fabric
from core.models.foam import Foam
from core.models.quote import Quote
from core.models.sale import Sale
from core.models.sewing_method import SewingMethod
from core.models.upholster_quote_entry import UpholsterQuoteEntry
from core.models.decoerica_settings import DecoEricaSettings


class CsvImportForm(forms.Form):
    archivo_csv = forms.FileField(label='Seleccionar archivo')


class FabricAdmin(admin.ModelAdmin):
    list_display = ('code', '__str__', 'price')
    change_list_template = "admin/fabric_changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.import_csv),
        ]
        return my_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            archivo_csv = request.FILES["archivo_csv"]
            reader = csv.reader(archivo_csv)
            import_csv_data(archivo_csv)
            self.message_user(request, "Your csv file has been imported")
            return redirect("..")
        form = CsvImportForm()
        payload = {"form": form}
        return render(
            request, "admin/csv_form.html", payload
        )


class CurtainSystemAdmin(admin.ModelAdmin):
    pass


class CustomerAdmin(admin.ModelAdmin):
    pass


class FoamAdmin(admin.ModelAdmin):
    pass


class SaleAdmin(admin.ModelAdmin):
    list_display = ('__str__', '_tracking_state', '_fabric_requested', '_systems_requested', '_order_shipped', '_delivery_date')


class CurtainQuoteEntryInline(admin.TabularInline):
    model = CurtainQuoteEntry
    extra = 1


class UpholsterQuoteEntryInline(admin.TabularInline):
    model = UpholsterQuoteEntry
    extra = 1


class QuoteAdmin(admin.ModelAdmin):
    inlines = [CurtainQuoteEntryInline, UpholsterQuoteEntryInline]
    readonly_fields = ('fecha',)

    def fecha(self, obj):
        return obj.date().strftime('%d-%m-%Y')

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['_customer', '_date']
        return super().get_readonly_fields(request, obj)


class SewingAdmin(admin.ModelAdmin):
    pass


class CurtainQuoteEntryAdmin(admin.ModelAdmin):
    pass


class UpholsterQuoteEntryAdmin(admin.ModelAdmin):
    pass


class DecoEricaSettingsAdmin(admin.ModelAdmin):
    list_display = ('__str__', '_fabric_surcharge_percentage', '_installation_price', '_sewing_price')


admin.site.register(Fabric, FabricAdmin)
admin.site.register(CurtainSystem, CurtainSystemAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Foam, FoamAdmin)
admin.site.register(Quote, QuoteAdmin)
admin.site.register(SewingMethod, SewingAdmin)
admin.site.register(CurtainQuoteEntry, CurtainQuoteEntryAdmin)
admin.site.register(UpholsterQuoteEntry, UpholsterQuoteEntryAdmin)
admin.site.register(Sale, SaleAdmin)
admin.site.register(DecoEricaSettings, DecoEricaSettingsAdmin)
