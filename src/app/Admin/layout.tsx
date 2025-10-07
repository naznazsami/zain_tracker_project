import { SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";

const FetchProfile = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return null;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (data?.success) {
    return data?.data;
  } else {
    return null;
  }
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await FetchProfile();
  if (!profile || profile.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
      </div>
    );
  }

  return (
		<div className="flex h-screen w-full overflow-hidden">
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
						<SidebarTrigger />
						<h1 className="text-lg font-semibold">Admin</h1>
					</header>
					<div className="p-4 w-full h-[calc(100svh-3.5rem)] overflow-auto">{children}</div>
				</SidebarInset>
				<SidebarRail />
			</SidebarProvider>
		</div>
  );
}