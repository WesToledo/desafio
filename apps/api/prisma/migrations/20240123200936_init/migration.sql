-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "billAmount" INTEGER NOT NULL,
    "billInterval" INTEGER NOT NULL,
    "dateInit" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "statusUpdateDate" TIMESTAMP(3) NOT NULL,
    "cancelDate" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "nextCicle" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
