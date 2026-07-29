# Patch: KenshiMP.QueryTool

Aplicar no seu fork `vinicius3232/Kenshi-Online` (mod C++):

1. Copie a pasta `KenshiMP.QueryTool/` para a raiz do fork.
2. No `CMakeLists.txt` raiz do fork, logo após a linha
   `add_subdirectory(KenshiMP.TestClient)`, adicione:
   ```cmake
   add_subdirectory(KenshiMP.QueryTool)
   ```
3. Rebuilde (`cmake .. && MSBuild KenshiMP.sln /p:Configuration=Release /p:Platform=x64`).
4. Copie o `.exe` gerado para `resources/tools/kenshimp-query.exe` no
   projeto do launcher.

Não foi compilado neste ambiente (sem MSVC/CMake disponível) — revise antes
de confiar cegamente, especialmente os nomes de link target (`spdlog::spdlog`
etc., confirmados batendo com o padrão usado em `KenshiMP.MasterServer/CMakeLists.txt`
e `KenshiMP.Common/CMakeLists.txt` do próprio fork).
