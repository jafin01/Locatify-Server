-- CreateTable
CREATE TABLE "Devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "device_type" TEXT NOT NULL,
    "device_version" TEXT NOT NULL,
    "app_version" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Devices_id_key" ON "Devices"("id");

-- AddForeignKey
ALTER TABLE "Devices" ADD CONSTRAINT "Devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
