from . import serializers, models, services


class ColorSizeSerializerMixin:

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sizes_data'] = serializers.ProductSizeSerializer(
            instance.productsize_set.all(),
            many=True
        ).data
        representation['colors_data'] = serializers.ProductColorSerializer(
            instance.productcolor_set.all(),
            many=True
        ).data
        return representation


class ProductCreateMixin(ColorSizeSerializerMixin):

    def create(self, validated_data):
        sizes_data = validated_data.pop('productsize_set', None)
        images_data = validated_data.pop('images', None)
        colors_data = validated_data.pop('productcolor_set', None)
        categories_data = validated_data.pop('category')

        instance = models.Product.objects.create(**validated_data)

        if sizes_data:
            services.ProductsService.create_size_product_many_relations(
                instance=instance,
                sizes_data=sizes_data
            )
        if colors_data:
            services.ProductsService.create_color_product_many_relations(
                instance=instance,
                colors_data=colors_data
            )
        if images_data:
            services.ProductsService.create_image_product_relations(
                instance=instance,
                images_data=images_data
            )

        services.ProductsService.create_translation_product_relations(
            instance=instance,
            validated_data=validated_data
        )
        for category_data in categories_data:
            instance.category.add(category_data)

        return instance


class ProductUpdateMixin(ColorSizeSerializerMixin):

    def update(self, instance, validated_data):
        sizes_data = validated_data.pop('productsize_set', None)
        images_data = validated_data.pop('images', None)
        colors_data = validated_data.pop('productcolor_set', None)

        if sizes_data:
            services.ProductsService.create_size_product_many_relations(
                instance=instance,
                sizes_data=sizes_data
            )
        if colors_data:
            services.ProductsService.create_color_product_many_relations(
                instance=instance,
                colors_data=colors_data
            )
        if images_data:
            services.ProductsService.create_image_product_relations(
                instance=instance,
                images_data=images_data
            )

        services.ProductsService.create_translation_product_relations(
            instance=instance,
            validated_data=validated_data
        )

        return super().update(instance, validated_data)
