from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now  # Use timezone-aware datetime

from .models import Session, Interaction

import json


@csrf_exempt
def session_start(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            session, created = Session.objects.get_or_create(**data)

            return JsonResponse({"session_id": session.pk}, status=201)

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def track_interactions(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            session_id = data.get("session_id")
            session = Session.objects.get(pk=session_id)

            interactions = data.get("interactions")

            # Create interaction records
            for interaction in interactions:
                Interaction.objects.create(session=session, **interaction)

            return JsonResponse({"status": "success"}, status=201)

        except Exception as e:
            print("Exception:", e)
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
