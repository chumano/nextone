# nextone
## Install
### Backend

dotnet core 3.1
```
dotnet tool install Excubo.WebCompiler --global

dotnet tool install --global dotnet-ef

#Install tye via the following command:
dotnet tool install -g Microsoft.Tye --version "0.10.0-alpha.21420.1"
```

Run projects using tye
```
tye run --tags=core --watch
```

Run use docker-compose
```
docker-compose -f docker-compose.infras.yml up -d db

docker-compose -f docker-compose.yml up -d
```
### Frontend
- node >= v14.17.6 , v16
- npm  >= 6.14.15, v8

## Account
manager/NextOne@123

## web
- Setup route
- Add empty pages
    - login page
    - home page
    - users page
    - chanels page
        - events page in chanel
        - members page in chanel
        - chat room page in page
- map page
- map config page

### Services
- Web :       http://localhost:5100
- Web-map :   http://localhost:5107

- Gateway :   http://localhost:5101

- Identity :  https://localhost:5102
-- Chú ý: Identity phải chạy ở https thì nới redirect oidc

- Master :    http://localhost:5103
- Com :       http://localhost:5104

- Map :       http://localhost:5105

- File :       http://localhost:5106

Infrastructures:
- Seq :       http://localhost:5109
- DB :        localhost, 1433

Gateway route:
- /master
- /com
- /file - not
- /map - not
#### Migrations and Seed identity data
Migrations
```
dotnet ef database update --project .\IdentityService -c ApplicationDbContext
dotnet ef database update --project .\IdentityService -c ConfigurationDbContext
dotnet ef database update --project .\IdentityService -c PersistedGrantDbContext

dotnet ef database update --project .\FileService
dotnet ef database update --project .\MasterService
dotnet ef database update --project .\ComService
dotnet ef database update --project .\MapService
```


Identity Seed
```
# run at ./src
dotnet run --project .\IdentityService /seed
```

Master Users Seed

```sql
INSERT INTO  [master].[User] (Id,Name,Email,Phone,IsActive,IsDeleted, CreatedDate, UpdatedDate)
SELECT  [Id],[UserName],[Email],PhoneNumber, 1,0, getdate(), getdate()
FROM [NextOne].[identity].[AspNetUsers]

```

### font-awesome 
https://fontawesome.com/v5.15/how-to-use/on-the-web/using-with/react


### check identity service
```
SELECT TOP (1000) * from dbo.AspNetRoles
SELECT TOP (1000) * from dbo.AspNetUsers

SELECT TOP (1000) * from dbo.Clients
SELECT TOP (1000) * from dbo.ClientGrantTypes
SELECT TOP (1000) * from dbo.ClientCorsOrigins
SELECT TOP (1000) * from dbo.ClientClaims
SELECT TOP (1000) * from dbo.ClientScopes
SELECT TOP (1000) * from dbo.ClientRedirectUris
SELECT TOP (1000) * from dbo.ClientPostLogoutRedirectUris

SELECT TOP (1000) * from dbo.ApiResources
SELECT TOP (1000) * from dbo.ApiResourceScopes
SELECT TOP (1000) * from dbo.ApiResourceSecrets

```
Identity Clients
- m2m.client : system client. 
	- grant_type: client_credentials
	- AccessTokenLifetime: 1 day
- web-spa : web app. 
	- grant_type: authorization_code
	- AccessTokenLifetime: 1 hour
- postman :  test. 
	- grant_type: authorization_code
	- AccessTokenLifetime: 30 days
- native-app : mobile app. 
	- grant_type: password. refresh token
	- AccessTokenLifetime: 14 days
```

# Server
CPU :  4 Cores, 8M Cache, 3.40 GHz 
RAM : 8GB
DISK : SSD 500GB