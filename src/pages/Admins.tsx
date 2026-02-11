import { useEffect, useState } from "react";
import { Plus, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusPill } from "@/components/dashboard/StatusPill";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdmins, type Admin } from "@/lib/firestore";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

const columns = [
  {
    key: "name",
    header: "Admin",
    render: (value: string, row: any) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
            {value?.split(" ").map((n: string) => n[0]).join("") || "?"}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">{value || "Unknown"}</span>
      </div>
    ),
  },
  { key: "email", header: "Email" },
  { key: "company", header: "Company" },
  {
    key: "role",
    header: "Role",
    render: (value: string) => <StatusPill status={value === "active" || value === "admin" || value === "super_admin" ? "active" : value as any} />,
  },
  { key: "phone", header: "Phone" },
  { key: "created", header: "Created" },
];

export default function Admins() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdmins() {
      try {
        const data = await getAdmins();
        setAdmins(
          data.map((admin) => ({
            ...admin,
            created: formatDate(admin.createdAt),
          }))
        );
      } catch (error) {
        console.error("Error fetching admins:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAdmins();
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Admin Management"
        subtitle="Manage admin users and their permissions"
        actions={
          <>
            <Button variant="outline">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Admin
            </Button>
          </>
        }
      />

      <Card className="p-5 shadow-sm">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={admins} />
        )}
      </Card>
    </AppShell>
  );
}
