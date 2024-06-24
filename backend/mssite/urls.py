from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenBlacklistView

from products.views import ProductsViewSet
from users.views import (TokenObtainPairViewDoc, TokenRefreshViewDoc,
                         TokenVerifyViewDoc, UserViewSet,
                         NewsViewSet)
from cart.views import CartProductsViewSet
from customers.views import CustomerViewSet, ReviewsViewSet
from providers.views import ProviderViewSet
from product_components.views import (ProductTypesViewSet,
                                      ManufacturerCountryViewSet,
                                      ProductCategoriesViewSet,
                                      ProductSubTypesViewSet)

router = DefaultRouter()

router.register(
    r'catalog',
    ProductsViewSet,
    'catalog'
)

router.register(
    r'categories',
    ProductCategoriesViewSet,
    'categories'
)

router.register(
    r'types',
    ProductTypesViewSet,
    'types'
)

router.register(
    r'subtypes',
    ProductSubTypesViewSet,
    'subtypes'
)

router.register(
    r'reviews',
    ReviewsViewSet,
    'reviews'
)

router.register(
    r'cart',
    CartProductsViewSet,
    'cart'
)

router.register(
    r'users',
    UserViewSet,
    'users'
)

router.register(
    r'country',
    ManufacturerCountryViewSet,
    'country'
)

router.register(
    r'provider',
    ProviderViewSet,
    'provider'
)

router.register(
    r'customer',
    CustomerViewSet,
    'customer'
)

router.register(
    r'superusernews',
    NewsViewSet,
    'news'
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
        SpectacularAPIView.as_view(),
        name='schema'
    ),
    path(
        'api/schema/swagger-ui/',
        SpectacularSwaggerView.as_view(url_name='schema'),
        name='swagger-ui',
    ),
    path(
        'api/schema/redoc/',
        SpectacularRedocView.as_view(url_name='schema'),
        name='redoc',
    ),
    path(
        'api/token/',
        TokenObtainPairViewDoc.as_view(),
        name='token_obtain_pair',
    ),
    path(
        'api/token/refresh/',
        TokenRefreshViewDoc.as_view(),
        name='token_refresh',
    ),
    path(
        'api/token/verify/',
        TokenVerifyViewDoc.as_view(),
        name='token_verify',
    ),
    path(
        'api/token/logout/',
        TokenBlacklistView.as_view(),
        name='token_blacklist',
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT,
    )

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
