-- Rename enum (values unchanged)
ALTER TYPE "CustomerStatus" RENAME TO "ApplicationStatus";

-- Create applications table
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "originCountryId" TEXT NOT NULL,
    "destinationCountryId" TEXT NOT NULL,
    "corridorId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'ONBOARDED',
    "accessToken" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdByAdminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- Backfill: every existing customer becomes their own first application
INSERT INTO "applications" (
    "id", "customerId", "originCountryId", "destinationCountryId", "corridorId",
    "status", "accessToken", "tokenExpiresAt", "createdByAdminId", "createdAt", "updatedAt"
)
SELECT
    "id", "id", "originCountryId", "destinationCountryId", "corridorId",
    "status", "accessToken", "tokenExpiresAt", "createdByAdminId", "createdAt", "updatedAt"
FROM "customers";

CREATE UNIQUE INDEX "applications_accessToken_key" ON "applications"("accessToken");
CREATE INDEX "applications_accessToken_idx" ON "applications"("accessToken");

ALTER TABLE "applications" ADD CONSTRAINT "applications_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_originCountryId_fkey" FOREIGN KEY ("originCountryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_destinationCountryId_fkey" FOREIGN KEY ("destinationCountryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_corridorId_fkey" FOREIGN KEY ("corridorId") REFERENCES "corridors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_createdByAdminId_fkey" FOREIGN KEY ("createdByAdminId") REFERENCES "admin_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Repoint customer_documents -> application_documents (applicationId == old customerId, since each
-- pre-existing customer became its own first application with the same id)
ALTER TABLE "customer_documents" DROP CONSTRAINT "customer_documents_customerId_fkey";
ALTER TABLE "customer_documents" RENAME TO "application_documents";
ALTER TABLE "application_documents" RENAME COLUMN "customerId" TO "applicationId";
ALTER TABLE "application_documents" RENAME CONSTRAINT "customer_documents_pkey" TO "application_documents_pkey";
ALTER INDEX "customer_documents_customerId_requiredDocumentId_key" RENAME TO "application_documents_applicationId_requiredDocumentId_key";
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Repoint progress_events -> applications
ALTER TABLE "progress_events" DROP CONSTRAINT "progress_events_customerId_fkey";
ALTER TABLE "progress_events" RENAME COLUMN "customerId" TO "applicationId";
ALTER TABLE "progress_events" ADD CONSTRAINT "progress_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Strip trip-specific fields off customers (now a person-level record) and drop their FKs/indexes
ALTER TABLE "customers" DROP CONSTRAINT "customers_originCountryId_fkey";
ALTER TABLE "customers" DROP CONSTRAINT "customers_destinationCountryId_fkey";
ALTER TABLE "customers" DROP CONSTRAINT "customers_corridorId_fkey";
DROP INDEX "customers_accessToken_key";
DROP INDEX "customers_accessToken_idx";

ALTER TABLE "customers"
    DROP COLUMN "originCountryId",
    DROP COLUMN "destinationCountryId",
    DROP COLUMN "corridorId",
    DROP COLUMN "status",
    DROP COLUMN "accessToken",
    DROP COLUMN "tokenExpiresAt";

CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");
