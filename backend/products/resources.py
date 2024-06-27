from import_export import resources, fields, widgets

from . import models
from product_components import models as product_component_models
from users import models as user_models


class ProductsResource(resources.ModelResource):

    amount = fields.Field(
        column_name='amount',
        attribute='amount',
        widget=widgets.IntegerWidget(coerce_to_string=False)
    )

    provider = fields.Field(
        column_name='provider',
        attribute='provider',
        widget=widgets.ForeignKeyWidget(
            user_models.User,
            field='username'
        )
    )

    manufacturerCountry = fields.Field(
        column_name='manufacturerCountry',
        attribute='manufacturerCountry',
        widget=widgets.ForeignKeyWidget(
            product_component_models.ManufacturerCountry,
            field='name'
        )
    )

    size = fields.Field(
        column_name='size',
        attribute='size',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Size,
            field='name'
        )
    )

    brand = fields.Field(
        column_name='brand',
        attribute='brand',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Brand,
            field='name'
        )
    )

    color = fields.Field(
        column_name='color',
        attribute='color',
        widget=widgets.ForeignKeyWidget(
            product_component_models.Color,
            field='name'
        )
    )
    subTypes = fields.Field(
        column_name='subTypes',
        attribute='subTypes',
        widget=widgets.ManyToManyWidget(
            product_component_models.ProductSubType,
            field='name'
        )
    )

    class Meta:
        model = models.Product
        exclude = (
            'image',
            'is_famous',
            'is_published',
            'status',
            'date_and_time'
        )
        import_id_fields = ['article_number', 'slug']
        skip_unchanged = True
        use_bulk = True
