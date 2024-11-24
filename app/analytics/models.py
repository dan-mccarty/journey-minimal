from django.db import models


class Session(models.Model):
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_type = models.CharField(max_length=20)
    device_brand = models.CharField(max_length=20)
    device_browser = models.CharField(max_length=20)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=100)

    def __str__(self):
        return str(self.pk)


class Interaction(models.Model):
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, related_name="interactions"
    )
    timestamp = models.DateTimeField(null=True, blank=True)
    referal_url = models.URLField(null=True, blank=True)
    page_url = models.URLField(null=True, blank=True)
    page_type = models.CharField(max_length=50)
    page_value = models.CharField(max_length=150)
    event_type = models.CharField(max_length=20)
    event_value = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.event_type} at {self.timestamp}"
