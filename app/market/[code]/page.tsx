import { redirect } from "next/navigation";

export default async function MarketCodeRedirect({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/fundamentals/${code}`);
}
