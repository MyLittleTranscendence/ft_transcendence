from enum import Enum


class Error(Enum):
    """
    USER
    """
    EFA_DISABLED = "bad access, efa disabled"
    CODE_TIMEOUT = "Code Timeout"
    CODE_INVALID = "Code Invalid"
    EFA_ALREADY_DISABLED = "bad access, 2fa already disabled"
    EFA_ALREADY_ENABLED = "bad access, 2fa already enabled"

