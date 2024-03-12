## How to convert js project to ts

```
npx tsc --init
npm i -D @types/express @types/node ts-no
de tsc-alias tsconfig-paths
```

create nodemon.json

```
{
  "watch": ["src"],
  "ext": ".ts,.js,.json",
  "exec": "ts-node -r tsconfig-paths/register src/index.js"
}
```

change package.json

```
  "scripts": {
    "dev": "nodemon",
    "start": "node dist/src",
    "prebuild": "rm -rf ./dist",
    "build": "npx tsc && tsc-alias"
  },
```
