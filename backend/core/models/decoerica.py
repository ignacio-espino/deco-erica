from core.models.sale import Sale


class DecoErica:

    def convert_to_sale(self, quotation):
        sale_number = Sale.objects.count() + 1
        sale = Sale(_quote=quotation, _number=sale_number)
        sale.save()
        return sale
