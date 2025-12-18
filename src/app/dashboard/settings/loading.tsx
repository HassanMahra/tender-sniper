import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header Skeleton */}
      <header className="mb-8">
        <Skeleton className="h-8 w-64 bg-neutral-800" />
        <Skeleton className="h-4 w-96 mt-2 bg-neutral-800" />
      </header>

      {/* Settings Card Skeleton */}
      <div className="max-w-2xl rounded-xl border border-neutral-800 bg-card">
        {/* Card Header */}
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg bg-neutral-800" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40 bg-neutral-800" />
              <Skeleton className="h-3 w-64 bg-neutral-800" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-6">
          {/* Keywords Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-neutral-800" />
            <Skeleton className="h-10 w-full bg-neutral-800" />
            <Skeleton className="h-3 w-48 bg-neutral-800" />
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 bg-neutral-800" />
            <Skeleton className="h-10 w-full bg-neutral-800" />
            <Skeleton className="h-3 w-32 bg-neutral-800" />
          </div>

          {/* Radius Slider */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-neutral-800" />
              <Skeleton className="h-4 w-12 bg-neutral-800" />
            </div>
            <Skeleton className="h-2 w-full rounded-full bg-neutral-800" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16 bg-neutral-800" />
              <Skeleton className="h-3 w-12 bg-neutral-800" />
            </div>
          </div>

          {/* Info Box */}
          <Skeleton className="h-16 w-full rounded-lg bg-neutral-800" />
        </div>

        {/* Card Footer */}
        <div className="p-6 border-t border-neutral-800">
          <Skeleton className="h-10 w-44 bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

