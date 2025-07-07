from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta

from .models import (
    Category, RadioStation, UserProfile, Event, 
    BlogPost, ListeningHistory, Contact
)
from .serializers import (
    CategorySerializer, RadioStationSerializer, UserProfileSerializer,
    EventSerializer, BlogPostSerializer, ListeningHistorySerializer,
    ContactSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class RadioStationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = RadioStation.objects.filter(is_active=True)
    serializer_class = RadioStationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'country', 'language', 'quality']
    search_fields = ['name', 'description', 'country', 'language']
    ordering_fields = ['name', 'listeners_count', 'created_at']
    ordering = ['-listeners_count']

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular stations"""
        popular_stations = self.queryset.order_by('-listeners_count')[:10]
        serializer = self.get_serializer(popular_stations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured stations (top 5 by listeners)"""
        featured_stations = self.queryset.order_by('-listeners_count')[:5]
        serializer = self.get_serializer(featured_stations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_favorite(self, request, pk=None):
        """Toggle station as favorite for authenticated user"""
        station = self.get_object()
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        if station in user_profile.favorite_stations.all():
            user_profile.favorite_stations.remove(station)
            is_favorited = False
            message = "Station removed from favorites"
        else:
            user_profile.favorite_stations.add(station)
            is_favorited = True
            message = "Station added to favorites"
        
        return Response({
            'is_favorited': is_favorited,
            'message': message
        })

    @action(detail=True, methods=['post'])
    def increment_listeners(self, request, pk=None):
        """Increment listener count when someone starts listening"""
        station = self.get_object()
        station.listeners_count += 1
        station.save()
        return Response({'listeners_count': station.listeners_count})

    @action(detail=True, methods=['post'])
    def decrement_listeners(self, request, pk=None):
        """Decrement listener count when someone stops listening"""
        station = self.get_object()
        if station.listeners_count > 0:
            station.listeners_count -= 1
            station.save()
        return Response({'listeners_count': station.listeners_count})


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def favorites(self, request):
        """Get user's favorite stations"""
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        stations = profile.favorite_stations.filter(is_active=True)
        serializer = RadioStationSerializer(stations, many=True, context={'request': request})
        return Response(serializer.data)


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['station', 'event_type', 'is_featured']
    search_fields = ['title', 'description', 'host']
    ordering_fields = ['start_time', 'created_at']
    ordering = ['start_time']

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        now = timezone.now()
        upcoming_events = self.queryset.filter(start_time__gt=now)[:10]
        serializer = self.get_serializer(upcoming_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def live(self, request):
        """Get currently live events"""
        now = timezone.now()
        live_events = self.queryset.filter(
            start_time__lte=now,
            end_time__gte=now
        )
        serializer = self.get_serializer(live_events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured events"""
        featured_events = self.queryset.filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured_events, many=True)
        return Response(serializer.data)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(status='published')
    serializer_class = BlogPostSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'tags']
    ordering_fields = ['created_at', 'published_at']
    ordering = ['-published_at']
    lookup_field = 'slug'

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured blog posts"""
        featured_posts = self.queryset.filter(is_featured=True)[:5]
        serializer = self.get_serializer(featured_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent blog posts"""
        recent_posts = self.queryset.order_by('-published_at')[:10]
        serializer = self.get_serializer(recent_posts, many=True)
        return Response(serializer.data)


class ListeningHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = ListeningHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ListeningHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get listening statistics for the user"""
        history = self.get_queryset()
        total_sessions = history.count()
        total_minutes = sum(h.duration_minutes for h in history)
        
        # Most listened stations
        most_listened = history.values('station__name').annotate(
            count=Count('station'),
            total_minutes=models.Sum('duration_minutes')
        ).order_by('-total_minutes')[:5]
        
        return Response({
            'total_sessions': total_sessions,
            'total_minutes': total_minutes,
            'total_hours': round(total_minutes / 60, 1),
            'most_listened_stations': most_listened
        })


class ContactViewSet(viewsets.CreateOnlyModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response({
            'message': 'Thank you for your message. We will get back to you soon!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)