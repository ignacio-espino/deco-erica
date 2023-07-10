from django.contrib import admin

from core.models.curtain_quote_entry import CurtainQuoteEntry
from core.models.curtain_system import CurtainSystem
from core.models.customer import Customer
from core.models.fabric import Fabric
from core.models.foam import Foam
from core.models.quote import Quote
from core.models.sewing_method import SewingMethod
from core.models.upholster_quote_entry import UpholsterQuoteEntry


class FabricAdmin(admin.ModelAdmin):
    list_display = ('code', '__str__', 'price')


class CurtainSystemAdmin(admin.ModelAdmin):
    pass


class CustomerAdmin(admin.ModelAdmin):
    pass


class FoamAdmin(admin.ModelAdmin):
    pass


class QuoteAdmin(admin.ModelAdmin):
    pass


class SewingAdmin(admin.ModelAdmin):
    pass


class CurtainQuoteEntryAdmin(admin.ModelAdmin):
    pass


class UpholsterQuoteEntryAdmin(admin.ModelAdmin):
    pass


admin.site.register(Fabric, FabricAdmin)
admin.site.register(CurtainSystem, CurtainSystemAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Foam, FoamAdmin)
admin.site.register(Quote, QuoteAdmin)
admin.site.register(SewingMethod, SewingAdmin)
admin.site.register(CurtainQuoteEntry, CurtainQuoteEntryAdmin)
admin.site.register(UpholsterQuoteEntry, UpholsterQuoteEntryAdmin)
