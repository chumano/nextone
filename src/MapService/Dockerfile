#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
#RUN apt-get update && apt-get install -y libgdiplus
ENV MONO_VERSION 6.12.0.122

RUN apt-get update \
  && apt-get install -y --no-install-recommends gnupg dirmngr ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && export GNUPGHOME="$(mktemp -d)" \
  && gpg --batch --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF \
  && gpg --batch --export --armor 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF > /etc/apt/trusted.gpg.d/mono.gpg.asc \
  && gpgconf --kill all \
  && rm -rf "$GNUPGHOME" \
  && apt-key list | grep Xamarin \
  && apt-get purge -y --auto-remove gnupg dirmngr

RUN echo "deb https://download.mono-project.com/repo/debian stable-buster/snapshots/$MONO_VERSION main" > /etc/apt/sources.list.d/mono-official-stable.list \
  && apt-get update \
  && apt-get install -y mono-runtime \
  && rm -rf /var/lib/apt/lists/* /tmp/*
  
RUN apt-get update \
    && apt-get -y install libgdiplus \
    && rm -rf /var/lib/apt/lists/* /tmp/*


WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["Libs/SharpMap/NuGet.Config", "Libs/SharpMap/"]
COPY ["MapService/MapService.csproj", "MapService/"]
COPY ["SharedDomain/SharedDomain.csproj", "SharedDomain/"]
COPY ["Libs/SharpMap/SharpMap.Layers.BruTile/SharpMap.Layers.BruTile.csproj", "Libs/SharpMap/SharpMap.Layers.BruTile/"]
COPY ["Libs/SharpMap/SharpMap/SharpMap.csproj", "Libs/SharpMap/SharpMap/"]
COPY ["Libs/NextOne.Shared/NextOne.Shared.csproj", "Libs/NextOne.Shared/"]
COPY ["Libs/NextOne.Infrastructure.Core/NextOne.Infrastructure.Core.csproj", "Libs/NextOne.Infrastructure.Core/"]
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