FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
RUN curl --silent --location https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install --yes nodejs
COPY . Tasktower.UIService
WORKDIR  /Tasktower.UIService/Tasktower.UIService/ClientApp
RUN rm -rf node_modules build
RUN npm install
WORKDIR  /Tasktower.UIService/Tasktower.UIService
RUN dotnet restore "Tasktower.UIService.csproj"
RUN dotnet publish "Tasktower.UIService.csproj" -c release -o /App --no-restore
FROM mcr.microsoft.com/dotnet/aspnet:5.0
EXPOSE 5001
EXPOSE 5000
EXPOSE 443
EXPOSE 80
WORKDIR /App
COPY --from=build /App ./
ENTRYPOINT ["dotnet", "Tasktower.UIService.dll"]