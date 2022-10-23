FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["crypto-notify-api/crypto-notify-api.csproj", "crypto-notify-api/"]
RUN dotnet restore "crypto-notify-api/crypto-notify-api.csproj"
COPY . .
WORKDIR "/src/crypto-notify-api"
RUN dotnet build "crypto-notify-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "crypto-notify-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "crypto-notify-api.dll"]
