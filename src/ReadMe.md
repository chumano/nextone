# DB Migrations

## Identity Service
```
cd IdentityService
dotnet ef migrations add Identity_Init_ApplicationDB -c ApplicationDbContext
dotnet ef migrations add Identity_Init_ConfigurationDB -c ConfigurationDbContext
dotnet ef migrations add Identity_Init_PersistedGrantDB -c PersistedGrantDbContext

dotnet run /seed

//list
dotnet ef migrations list --context ApplicationDbContext
dotnet ef migrations list --context ConfigurationDbContext
dotnet ef migrations list --context PersistedGrantDbContext


//remove all
dotnet ef database update 0 --context ApplicationDbContext
dotnet ef database update 0 --context ConfigurationDbContext
dotnet ef database update 0 --context PersistedGrantDbContext

dotnet ef migrations remove --context ApplicationDbContext
dotnet ef migrations remove --context ConfigurationDbContext
dotnet ef migrations remove --context PersistedGrantDbContext
//run seed
dotnet run /seed
```


## Master Service
```
cd MasterService
dotnet ef migrations add Master_Init_DB
dotnet ef database  update

//remove all migrations
dotnet ef migrations remove

//downgrade
dotnet ef database update <previous-migration-name>
dotnet ef database update 0

//list
dotnet ef migrations list
```
