#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
RUN apt-get update && apt-get install -y libgdiplus
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["Libs/SharpMap/NuGet.Config", "Libs/SharpMap/"]
COPY ["MapService/MapService.csproj", "MapService/"]
COPY ["Libs/SharpMap/SharpMap.Layers.BruTile/SharpMap.Layers.BruTile.csproj", "Libs/SharpMap/SharpMap.Layers.BruTile/"]
COPY ["Libs/SharpMap/SharpMap/SharpMap.csproj", "Libs/SharpMap/SharpMap/"]
COPY ["Libs/SharpMap/SharpMap.Converters.GeoJSON/SharpMap.Converters.GeoJSON.csproj", "Libs/SharpMap/SharpMap.Converters.GeoJSON/"]
RUN dotnet restore "MapService/MapService.csproj"
COPY . .
WORKDIR "/src/MapService"
RUN dotnet build "MapService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MapService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MapService.dll"]