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
Debug in DockerDesktop :
```
apt-get install openssh-server unzip curl
https://docs.microsoft.com/en-us/visualstudio/debugger/attach-to-process-running-in-docker-container?view=vs-2022
```

### Frontend
- node >=  v16
- npm  >= v8

## Account
manager/Nextone@123

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
- Web :       http://localhost:5100 nextone.local
- Web-map :   http://localhost:5107 map.nextone.local

- Gateway :   http://localhost:5101 gateway.nextone.local


- Identity :  https://localhost:5102 id.nextone.local
-- Chú ý: Identity phải chạy ở https thì nới redirect oidc

- Master :    http://localhost:5103 api.master.nextone.local
- Com :       http://localhost:5104 api.com.nextone.local

- Map :       http://localhost:5105 api.map.nextone.local

- File :       http://localhost:5106 api.file.nextone.local

Infrastructures:
- Seq :       http://localhost:5109 seq.nextone.local
- DB :        localhost, 1433

Gateway route:
- /master
- /com
- /file - not
- /map - not


### hosts file : C:\Windows\System32\drivers\etc\hosts
127.0.0.1 nextone.local
127.0.0.1 map.nextone.local
127.0.0.1 id.nextone.local
127.0.0.1 apis.nextone.local
127.0.0.1 gateway.nextone.local

127.0.0.1 seq.nextone.local

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

# Other
usersecrets
```
%appdata%/microsoft/usersecrets
```

certificates
```
#wsl2
cd configs/certificates/

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout id.nextone.local.key -out id.nextone.local.crt -config id.nextone.local.conf

#verify : 2 results must be same
openssl x509 -noout -modulus -in id.nextone.local.crt| openssl md5
openssl rsa -noout -modulus -in id.nextone.local.key| openssl md5
```

install trust certificate
https://support.kaspersky.com/CyberTrace/1.0/en-US/174127.htm


drop tables in a schema

```sql
DECLARE @sql NVARCHAR(MAX) = N''

SELECT @sql += N'
ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id))
    + '.' + QUOTENAME(OBJECT_NAME(parent_object_id)) + 
    ' DROP CONSTRAINT ' + QUOTENAME(name) + ';'
FROM sys.foreign_keys
where OBJECT_SCHEMA_NAME(parent_object_id)='identity'

PRINT @sql
 EXEC sp_executesql @sql

```

```sql
DECLARE @SqlStatement NVARCHAR(MAX)
SELECT @SqlStatement = 
    COALESCE(@SqlStatement, N'') + N'DROP TABLE [identity].' + QUOTENAME(TABLE_NAME) + N';' + CHAR(13)
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'identity' and TABLE_TYPE = 'BASE TABLE'

PRINT @SqlStatement
EXEC sp_executesql @SqlStatement
```

```sql
delete from __EFMigrationsHistory
where MigrationId like '%_Identity_%'
```