import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64 bg-neutral-800" />
            <Skeleton className="h-4 w-96 bg-neutral-800" />
          </div>
          <Skeleton className="h-10 w-32 bg-neutral-800" />
        </div>
      </header>

      {/* Search Bar Skeleton */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 flex-1 bg-neutral-800" />
        <Skeleton className="h-10 w-24 bg-neutral-800" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-800 bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-neutral-800" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16 bg-neutral-800" />
                <Skeleton className="h-3 w-24 bg-neutral-800" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section Title Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-48 bg-neutral-800" />
        <Skeleton className="h-8 w-24 bg-neutral-800" />
      </div>

      {/* Tender Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-800 bg-card p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-neutral-800" />
                <Skeleton className="h-4 w-1/4 bg-neutral-800" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full bg-neutral-800" />
            </div>

            {/* Content */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Skeleton className="h-4 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-full bg-neutral-800" />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-2">
              <Skeleton className="h-8 w-8 rounded-lg bg-neutral-800" />
              <Skeleton className="h-8 w-28 rounded-lg bg-neutral-800" />
              <Skeleton className="h-8 w-28 rounded-lg bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

