// KenshiMP Query Tool
//
// Headless CLI that asks the master server for its live server list and
// prints the result as JSON on stdout. Exists so external tools (the
// Electron launcher, in particular) can show a server browser without
// having to reimplement the ENet wire protocol in another language — this
// reuses the exact same ServerQueryClient the game client uses.
//
// Usage:
//   KenshiMP.QueryTool.exe --master <address> --port <port> [--json] [--timeout-ms 3000]
//
// Exit code 0 with a JSON array on stdout on success (possibly empty).
// Exit code 1 with an error message on stderr on failure (bad args, master
// unreachable within the timeout, etc).

#include "net/server_query.h"
#include <enet/enet.h>
#include <chrono>
#include <cstdio>
#include <cstring>
#include <string>
#include <thread>

using namespace kmp;

namespace {

std::string JsonEscape(const std::string& s) {
    std::string out;
    out.reserve(s.size());
    for (char c : s) {
        switch (c) {
            case '"': out += "\\\""; break;
            case '\\': out += "\\\\"; break;
            case '\n': out += "\\n"; break;
            default: out += c;
        }
    }
    return out;
}

void PrintResultsAsJson(const std::vector<ServerQueryResult>& results) {
    printf("[");
    for (size_t i = 0; i < results.size(); ++i) {
        const auto& r = results[i];
        if (i > 0) printf(",");
        printf(
            "{\"address\":\"%s\",\"port\":%u,\"name\":\"%s\","
            "\"players\":%u,\"maxPlayers\":%u,\"ping\":%u,\"online\":%s}",
            JsonEscape(r.address).c_str(), r.port, JsonEscape(r.serverName).c_str(),
            r.currentPlayers, r.maxPlayers, r.ping, r.online ? "true" : "false");
    }
    printf("]\n");
}

} // namespace

int main(int argc, char** argv) {
    std::string masterAddress;
    uint16_t masterPort = 27801;
    int timeoutMs = 3000;

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "--master" && i + 1 < argc) {
            masterAddress = argv[++i];
        } else if (arg == "--port" && i + 1 < argc) {
            masterPort = static_cast<uint16_t>(std::atoi(argv[++i]));
        } else if (arg == "--timeout-ms" && i + 1 < argc) {
            timeoutMs = std::atoi(argv[++i]);
        } else if (arg == "--json") {
            // Default and only output mode for now; accepted for forward
            // compatibility with a future human-readable table mode.
        }
    }

    if (masterAddress.empty()) {
        fprintf(stderr, "usage: KenshiMP.QueryTool --master <address> --port <port> [--json] [--timeout-ms 3000]\n");
        return 1;
    }

    if (enet_initialize() != 0) {
        fprintf(stderr, "error: failed to initialize ENet\n");
        return 1;
    }

    {
        ServerQueryClient client;
        if (!client.Initialize()) {
            fprintf(stderr, "error: failed to initialize query client\n");
            enet_deinitialize();
            return 1;
        }

        client.QueryMasterServer(masterAddress, masterPort);

        auto start = std::chrono::steady_clock::now();
        while (client.IsQueryActive()) {
            client.Update();
            auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
                std::chrono::steady_clock::now() - start).count();
            if (elapsed >= timeoutMs) break;
            std::this_thread::sleep_for(std::chrono::milliseconds(16));
        }

        PrintResultsAsJson(client.GetResults());
        client.Shutdown();
    }

    enet_deinitialize();
    return 0;
}
