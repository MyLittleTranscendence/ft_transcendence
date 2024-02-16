class Error:
    # USER
    EFA_DISABLED = "bad access, efa disabled"
    CODE_TIMEOUT = "Code Timeout"
    CODE_INVALID = "Code Invalid"
    EFA_ALREADY_DISABLED = "bad access, 2fa already disabled"
    EFA_ALREADY_ENABLED = "bad access, 2fa already enabled"

    # CUSTOM_AUTH
    PROFILE_42_GET_FAILED = "내부 서버 에러, 프로필 조회 실패"
    AUTH_FAILED = "내부 서버 에러, 인증 실패"
    MFA_REQUIRED = '2FA authentication required'

    # BLOCK
    CANNOT_BLOCK_SELF = "자기 자신을 차단할 수 없습니다!"
    ALREADY_BLOCK_USER = "이미 차단한 유저입니다!"
