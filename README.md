# nextone

## web
- Setup route
- Add empty pages
-- login page
-- home page
-- users page
-- chanels page
--- events page in chanel
--- members page in chanel
--- chat room page in page
-- map page
-- map config page

### Services
Web : https://localhost:5100
Gateway : https://localhost:5101
Identity : https://localhost:5102
Master : https://localhost:5103
Com : https://localhost:5104
Map : https://localhost:5105
Seq : http://localhost:5109

DB : localhost, 1433


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