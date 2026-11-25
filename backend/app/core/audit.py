"""Lightweight security audit logging.

Never pass passwords or tokens here - only event names, IPs and non-secret
identifiers such as an email address.
"""
import logging
from typing import Optional

from fastapi import Request

audit_logger = logging.getLogger("agrisense.security")


def client_ip(request: Optional[Request]) -> str:
    if request is None:
        return "unknown"
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # Render terminates TLS at the edge; the first hop is the real client.
        return forwarded.split(",")[0].strip()[:64]
    return request.client.host[:64] if request.client else "unknown"


def log_security(event: str, request: Optional[Request] = None, ip: str = "", **details) -> None:
    safe_details = " ".join(
        f"{key}={value}" for key, value in details.items() if value is not None
    )
    audit_logger.info(
        "event=%s ip=%s %s",
        event,
        ip or client_ip(request),
        safe_details,
    )
