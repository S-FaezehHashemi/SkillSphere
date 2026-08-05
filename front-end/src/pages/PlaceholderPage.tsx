interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-surface-card p-8">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-gray-400">
        This page will be implemented in a later step.
      </p>
    </div>
  );
}
