from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Session, Interaction


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "ip_address",
        "device_type",
        "device_brand",
        "device_browser",
        "city",
        "state",
        "country",
    )
    search_fields = ("pk", "ip_address", "state")
    ordering = ("-pk",)


@admin.register(Interaction)
class InteractionAdmin(admin.ModelAdmin):
    list_display = (
        "session",
        "timestamp",
        "referal_url",
        "page_url",
        "page_type",
        "event_type",
        "event_value",
    )
    search_fields = ("event_type", "referal_url", "page_url", "page_type")
    list_filter = ("event_type", "timestamp", "session")
    ordering = ("-timestamp",)
