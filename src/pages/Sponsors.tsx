import { useEffect, useState } from "react";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SponsorCard } from "@/components/dashboard/SponsorCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getSponsors, type Sponsor } from "@/lib/firestore";

const ITEMS_PER_PAGE = 12;

export default function Sponsors() {
  const [loading, setLoading] = useState(true);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchSponsors() {
      try {
        const data = await getSponsors();
        setSponsors(data);
      } catch (error) {
        console.error("Error fetching sponsors:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsors();
  }, []);

  const totalPages = Math.ceil(sponsors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSponsors = sponsors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <AppShell>
      <PageHeader
        title="Sponsor Library"
        subtitle="Manage sponsors and brand assets"
        actions={
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </Button>
        }
      />

      <Card className="p-5 shadow-sm">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sponsors found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {paginatedSponsors.map((sponsor) => (
                <SponsorCard
                  key={sponsor.id}
                  title={sponsor.name}
                  logoUrl={sponsor.logoUrl}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </AppShell>
  );
}
