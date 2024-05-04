from django.db.models import QuerySet
from django.http.request import QueryDict


class ProductsService:
    @staticmethod
    def apply_categories_filter(request_data: QueryDict,
                                queryset: QuerySet) -> QuerySet:
        categories = request_data.getlist('cats', None)
        if categories:
            return queryset.filter(
                subTypes__type__category__name__in=categories,
            )
        return queryset

    @staticmethod
    def apply_color_filter(request_data: QueryDict,
                           queryset: QuerySet) -> QuerySet:
        color = request_data.get('color', None)
        if color:
            return queryset.filter(color__name=color)
        return queryset

    @staticmethod
    def apply_size_filter(request_data: QueryDict,
                          queryset: QuerySet) -> QuerySet:
        size = request_data.get('size', None)
        if size:
            return queryset.filter(size__name=size)
        return queryset

    @staticmethod
    def apply_price_filter(request_data: QueryDict,
                           queryset: QuerySet) -> QuerySet:
        low_border_price = request_data.get('lbprice', None)
        high_border_price = request_data.get('hbprice', None)
        if low_border_price and high_border_price:
            return queryset.filter(
                price__range=(
                    low_border_price,
                    high_border_price,
                )
            )
        return queryset

    @staticmethod
    def apply_brands_filter(request_data: QueryDict,
                            queryset: QuerySet) -> QuerySet:
        brands = request_data.getlist('brands', None)
        if brands:
            return queryset.filter(brand__name__in=brands)
        return queryset

    @staticmethod
    def get_category_relations(queryset: QuerySet) -> dict:
        types_data = {}
        for product_subtype in queryset:
            type_name = product_subtype.type.name
            subtype_name = product_subtype.name
            if type_name in types_data:
                types_data[type_name]['subtypes'].append(subtype_name)
            else:
                types_data[type_name] = {
                    'subtypes': [subtype_name],
                }
        return types_data
