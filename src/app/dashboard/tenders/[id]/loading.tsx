import { Skeleton } from "@/components/ui/skeleton";

export default function TenderDetailLoading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <Skeleton className="h-8 w-20 mb-4 bg-neutral-800" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4 bg-neutral-800" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-24 bg-neutral-800" />
              <Skeleton className="h-4 w-24 bg-neutral-800" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-6 w-24 rounded-full bg-neutral-800" />
            <Skeleton className="h-8 w-28 rounded-lg bg-neutral-800" />
          </div>
        </div>
      </header>

      {/* Main Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary Card */}
          <div className="rounded-xl border border-neutral-800 bg-card p-6">
            <Skeleton className="h-6 w-32 mb-4 bg-neutral-800" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-3/4 bg-neutral-800" />
              <Skeleton className="h-4 w-full bg-neutral-800" />
              <Skeleton className="h-4 w-5/6 bg-neutral-800" />
            </div>
          </div>

          {/* Requirements Card */}
          <div className="rounded-xl border border-neutral-800 bg-card p-6">
            <Skeleton className="h-6 w-32 mb-4 bg-neutral-800" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full bg-neutral-800" />
                  <Skeleton className="h-4 flex-1 bg-neutral-800" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Key Facts Card */}
          <div className="rounded-xl border border-neutral-800 bg-card p-6">
            <Skeleton className="h-6 w-24 mb-4 bg-neutral-800" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-neutral-800" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16 bg-neutral-800" />
                    <Skeleton className="h-5 w-24 bg-neutral-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Card */}
          <div className="rounded-xl border border-neutral-800 bg-card p-6">
            <Skeleton className="h-6 w-20 mb-4 bg-neutral-800" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-neutral-800" />
              <Skeleton className="h-10 w-full bg-neutral-800" />
              <Skeleton className="h-8 w-full bg-neutral-800" />
            </div>
          </div>

          {/* Info Box */}
          <Skeleton className="h-16 w-full rounded-lg bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

