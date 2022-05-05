# Getting Started with Create React App
run dev:
```
npm run start
```
buid:
```
npm run build
```
serve build
```
serse -s build
```

# libraries
- antd: ui library
- utils
- - axios: http 
- - rxjs : observeble
- - classNames:  

# Enviroment variables
Files on the left have more priority than files on the right:
```
npm start: .env.development.local, .env.local, .env.development, .env
npm run build: .env.production.local, .env.local, .env.production, .env
npm test: .env.test.local, .env.test, .env (note .env.local is missing)
```
Dùng file nào thì file khác bị bỏ qua