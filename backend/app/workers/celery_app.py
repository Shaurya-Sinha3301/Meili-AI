from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "merydian_agents",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=["app.workers.agent_tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1, # 1 task per worker at a time for long running agents
    task_soft_time_limit=120, # 2 minutes soft limit (matches runtime timeout)
    task_time_limit=150,      # 2.5 minutes hard limit (kills worker process)
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)
