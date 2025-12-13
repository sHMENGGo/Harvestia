-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rice" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "company" VARCHAR(100),
    "categoryID" INTEGER,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(2,1),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "imagePath" TEXT,
    "imagePublicID" TEXT,
    "weightKG" DOUBLE PRECISION,
    "kg25" BOOLEAN NOT NULL DEFAULT false,
    "kg50" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(100) NOT NULL,
    "password" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT,
    "imagePath" TEXT,
    "imagePublicID" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Rice_name_key" ON "Rice"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Rice" ADD CONSTRAINT "Rice_categoryID_fkey" FOREIGN KEY ("categoryID") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
