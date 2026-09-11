class AppError(Exception):
    """Base class for all deliberately-raised application errors. Handlers in
    app/core/error_handlers.py convert these to the standardized error JSON shape —
    route handlers should raise these, never return ad hoc error dicts."""

    status_code: int = 500
    default_message: str = "An unexpected error occurred"

    def __init__(self, message: str | None = None):
        super().__init__(message or self.default_message)
        self.message = message or self.default_message


class NotFoundError(AppError):
    status_code = 404
    default_message = "Resource not found"


class ForbiddenError(AppError):
    status_code = 403
    default_message = "You do not have permission to perform this action"


class UnauthorizedError(AppError):
    status_code = 401
    default_message = "Authentication required"


class ValidationAppError(AppError):
    status_code = 422
    default_message = "Validation failed"


class ConflictError(AppError):
    status_code = 409
    default_message = "Resource conflict"


class TenantMismatchError(ForbiddenError):
    default_message = "Resource does not belong to your organization"
