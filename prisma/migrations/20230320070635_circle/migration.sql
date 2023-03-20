-- CreateTable
CREATE TABLE "Circle" (
    "id" TEXT NOT NULL,
    "circleCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CircleMembers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "circleId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Circle_id_key" ON "Circle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CircleMembers_id_key" ON "CircleMembers"("id");

-- AddForeignKey
ALTER TABLE "Circle" ADD CONSTRAINT "Circle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMembers" ADD CONSTRAINT "CircleMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMembers" ADD CONSTRAINT "CircleMembers_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
