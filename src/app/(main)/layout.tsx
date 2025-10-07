import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

const getApiBaseUrl = (): string | null => {
  const candidate = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";
  const trimmed = candidate.trim();
  if (!trimmed) return null;
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
};

const FetchProfile = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return null;
  }
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    return null;
  }

  try {
    const res = await fetch(`${apiBaseUrl}auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data?.success) {
      return data?.data;
    }
    return null;
  } catch {
    return null;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await FetchProfile();
  return (
    <div lang="en">
      <Navbar profile={profile} />
      {children}
    </div>
  );
}
