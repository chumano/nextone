# nextone
## Install
### Backend

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
#### Seed identity data
```
# run at ./src
dotnet run --project .\IdentityService /seed
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