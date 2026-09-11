import { prisma } from "@/lib/prisma";
import { generatePortalToken, portalUrlFor } from "@/lib/tokens";
import { sendCustomerPortalLink } from "@/lib/email";
import { getCorridor } from "@/lib/queries";

const TOKEN_VALID_DAYS = 180;

export async function createApplication(params: {
  customerId: string;
  customerFullName: string;
  customerEmail: string;
  originCountryId: string;
  destinationCountryId: string;
  createdByAdminId: string;
}): Promise<{ error: string } | { application: { id: string } }> {
  const corridor = await getCorridor(params.originCountryId, params.destinationCountryId);
  if (!corridor) {
    return { error: "No corridor is configured for this country pair yet. Create one under Corridors first." };
  }

  const accessToken = generatePortalToken();
  const tokenExpiresAt = new Date(Date.now() + TOKEN_VALID_DAYS * 24 * 60 * 60 * 1000);

  const application = await prisma.application.create({
    data: {
      customerId: params.customerId,
      originCountryId: params.originCountryId,
      destinationCountryId: params.destinationCountryId,
      corridorId: corridor.id,
      accessToken,
      tokenExpiresAt,
      createdByAdminId: params.createdByAdminId,
      documents: {
        create: corridor.documents.map((d) => ({
          requiredDocumentId: d.requiredDocumentId,
          status: "PENDING",
        })),
      },
      progressEvents: {
        create: {
          title: "Onboarded",
          description: "Welcome to Travulyn — your document checklist is ready.",
          createdByAdminId: params.createdByAdminId,
        },
      },
    },
  });

  await sendCustomerPortalLink({
    to: params.customerEmail,
    fullName: params.customerFullName,
    portalUrl: portalUrlFor(application.accessToken),
  });

  return { application };
}
