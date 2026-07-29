# Headless master-server query CLI. Reuses ServerQueryClient from
# KenshiMP.Core/net (that file only depends on KenshiMP.Common + enet, not
# on any Ogre/game-hook code, so it's safe to compile standalone here).
add_executable(KenshiMP.QueryTool
    main.cpp
    ${CMAKE_SOURCE_DIR}/KenshiMP.Core/net/server_query.cpp
)

target_include_directories(KenshiMP.QueryTool PRIVATE
    ${CMAKE_SOURCE_DIR}/KenshiMP.Core
)

target_link_libraries(KenshiMP.QueryTool PRIVATE
    KenshiMP.Common
    enet
    spdlog::spdlog
    ws2_32
    winmm
)
