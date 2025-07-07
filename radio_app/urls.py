from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'stations', views.RadioStationViewSet)
router.register(r'profile', views.UserProfileViewSet, basename='userprofile')
router.register(r'events', views.EventViewSet)
router.register(r'blog', views.BlogPostViewSet)
router.register(r'history', views.ListeningHistoryViewSet, basename='listeninghistory')
router.register(r'contact', views.ContactViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]