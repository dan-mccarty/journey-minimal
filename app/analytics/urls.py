from django.urls import path
from .views import session_start, track_interactions

urlpatterns = [
    path("session/start/", session_start, name="session_start"),
    path("track/", track_interactions, name="track_interactions"),
]
