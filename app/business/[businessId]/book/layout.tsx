import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function BusinessLayout(props: {
  children: React.ReactNode;
  params: Promise<{ businessId: string }>;
}) {
  const session = await auth();
  const params = await props.params;
  if (!session) {
    redirect(`/business/${params.businessId}/`);
  }
  return <>{props.children}</>;
}
