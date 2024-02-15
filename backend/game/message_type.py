class GameMessageType:
    LOGIN_GROUP = "login_group"

    SINGLE_GAME_CREATE = "single_game_create"
    JOIN_MULTI_GAME_QUEUE = "join_multi_game_queue"
    JOIN_TOURNAMENT_GAME_QUEUE = "join_tournament_game_queue"
    DELETE_MULTI_GAME_QUEUE = "delete_multi_game_queue"
    DELETE_TOURNAMENT_GAME_QUEUE = "delete_tournament_game_queue"
    REQUEST_ACCEPT_QUEUE = "request_accept_queue"
    RESPONSE_ACCEPT_QUEUE = "response_accept_queue"

    MATCH_SUCCESS = "match_success"
    MATCH_FAIL = "match_fail"
    PENALTY_WAIT = "penalty_wait"

    MOVE_BAR = "move_bar"

    UPDATE_GAME = "update_game"
    INFO_GAME = "info_game"
    WAIT_GAME = "wait_game"
    NEXT_GAME = "next_game"
