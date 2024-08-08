from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular import views
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenBlacklistView

from products import views as product_views
from users import views as user_views
from cart import views as cart_views
from customers import views as customer_views
from providers import views as provider_views
from product_components import views as product_component_views
from payment import views as payment_views
from delivery import views as delivery_views


router = DefaultRouter()

router.register(
    r'catalog',
    product_views.ProductsViewSet,
    'catalog'
)

router.register(
    r'categories',
    product_component_views.ProductCategoriesViewSet,
    'categories'
)

router.register(
    r'reviews',
    customer_views.ReviewsViewSet,
    'reviews'
)

router.register(
    r'cart',
    cart_views.CartViewSet,
    'cart'
)

router.register(
    r'order',
    cart_views.OrderViewSet,
    'order'
)

router.register(
    r'users',
    user_views.UserViewSet,
    'users'
)

router.register(
    r'country',
    product_component_views.ManufacturerCountryViewSet,
    'country'
)

router.register(
    r'color',
    product_component_views.ColorViewSet,
    'color'
)

router.register(
    r'provider',
    provider_views.ProviderViewSet,
    'provider'
)

router.register(
    r'customer',
    customer_views.CustomerViewSet,
    'customer'
)

router.register(
    r'order-products',
    cart_views.OrderProductsViewSet,
    'order-products'
)

router.register(
    r'news',
    user_views.NewsViewSet,
    'news'
)

router.register(
    r'card-payments',
    payment_views.CardPaymentViewSet,
    'card-payments'
)

router.register(
    r'delivery',
    delivery_views.DeliveryViewSet,
    'delivery'
)


urlpatterns = [
    path(
        'admin/',
        admin.site.urls
    ),
    path(
        'api/',
        include(router.urls)
    ),
    path(
        '__debug__/',
        include('debug_toolbar.urls')
    ),
    path(
        'api/schema/',
        views.SpectacularAPIView.as_view(),
        name='schema'
    ),
    path(
        'api/schema/swagger-ui/',
        views.SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui',
    ),
    path(
        'api/schema/redoc/',
        views.SpectacularRedocView.as_view(url_name='schema'),
        name='redoc',
    ),
    path(
        'api/token/',
        user_views.TokenObtainPairViewDoc.as_view(),
        name='token_obtain_pair',
    ),
    path(
        'api/token/refresh/',
        user_views.TokenRefreshViewDoc.as_view(),
        name='token_refresh',
    ),
    path(
        'api/token/verify/',
        user_views.TokenVerifyViewDoc.as_view(),
        name='token_verify',
    ),
    path(
        'api/token/logout/',
        TokenBlacklistView.as_view(),
        name='token_blacklist',
    ),
    path(
        'api/import_xlsx/',
        product_views.ImportExportProductDataView.as_view(),
        name='import_export_xlsx'
    )
]

if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
