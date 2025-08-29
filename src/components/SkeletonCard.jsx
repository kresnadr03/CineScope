export default function SkeletonCard() {
  return (
    <div className="card h-100 border-0 bg-body text-body">
      <div className="ratio ratio-2x3 skeleton rounded-top" />
      <div className="card-body px-2 py-3">
        <div className="skeleton skeleton-line mb-2" style={{ width: "70%", height: 10 }} />
        <div className="skeleton skeleton-line" style={{ width: 40, height: 10 }} />
      </div>
    </div>
  );
}
