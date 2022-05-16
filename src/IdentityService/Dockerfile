#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
RUN dotnet tool install Excubo.WebCompiler -- global
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["IdentityService/IdentityService.csproj", "IdentityService/"]
COPY ["Libs/NextOne.Shared/NextOne.Shared.csproj", "Libs/NextOne.Shared/"]
COPY ["Libs/NextOne.Infrastructure.Core/NextOne.Infrastructure.Core.csproj", "Libs/NextOne.Infrastructure.Core/"]
RUN dotnet restore "IdentityService/IdentityService.csproj"
COPY . .
WORKDIR "/src/IdentityService"
RUN dotnet build "IdentityService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IdentityService.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.dll"]