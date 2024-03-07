# /bin/bash!

echo "Install Dependencies"
npm i

echo "Running Prisma Generate"
npx prisma generate

echo "Running Prisma Migrations"
npx prisma migrate deploy

echo "Build Application"
npm run build