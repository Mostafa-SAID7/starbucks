# Use the official .NET runtime as a parent image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/Starbucks.API/Starbucks.API.csproj", "src/Starbucks.API/"]
COPY ["src/Starbucks.Application/Starbucks.Application.csproj", "src/Starbucks.Application/"]
COPY ["src/Starbucks.Domain/Starbucks.Domain.csproj", "src/Starbucks.Domain/"]
COPY ["src/Starbucks.Infrastructure/Starbucks.Infrastructure.csproj", "src/Starbucks.Infrastructure/"]

RUN dotnet restore "src/Starbucks.API/Starbucks.API.csproj"

# Copy the rest of the application code
COPY . .

# Build the application
WORKDIR "/src/src/Starbucks.API"
RUN dotnet build "Starbucks.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "Starbucks.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

ENTRYPOINT ["dotnet", "Starbucks.API.dll"]