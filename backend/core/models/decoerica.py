import datetime

from core.models.sale import Sale


class DecoErica:

    def convert_to_sale(self, quotation):
        sale_number = Sale.objects.count() + 1
        delivery_date = datetime.datetime.today() - datetime.timedelta(days=15)
        sale = Sale(_quote=quotation, _number=sale_number, _delivery_date=delivery_date)
        sale.save()
        return sale
