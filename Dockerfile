FROM mcr.microsoft.com/dotnet/core/aspnet:2.2

COPY backend/bin/Release/netcoreapp2.2/publish/ app/

ENTRYPOINT ["dotnet", "app/backend.dll"]