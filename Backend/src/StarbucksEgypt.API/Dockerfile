# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/StarbucksEgypt.API/StarbucksEgypt.API.csproj", "src/StarbucksEgypt.API/"]
COPY ["src/StarbucksEgypt.Application/StarbucksEgypt.Application.csproj", "src/StarbucksEgypt.Application/"]
COPY ["src/StarbucksEgypt.Domain/StarbucksEgypt.Domain.csproj", "src/StarbucksEgypt.Domain/"]
COPY ["src/StarbucksEgypt.Infrastructure/StarbucksEgypt.Infrastructure.csproj", "src/StarbucksEgypt.Infrastructure/"]

RUN dotnet restore "src/StarbucksEgypt.API/StarbucksEgypt.API.csproj"

# Copy the rest of the application code
COPY . .

# Build the application
WORKDIR "/src/src/StarbucksEgypt.API"
RUN dotnet build "StarbucksEgypt.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "StarbucksEgypt.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

ENTRYPOINT ["dotnet", "StarbucksEgypt.API.dll"]