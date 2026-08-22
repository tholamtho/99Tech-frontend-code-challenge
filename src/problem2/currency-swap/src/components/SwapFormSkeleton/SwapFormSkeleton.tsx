import { Skeleton } from 'antd';

/** Mirrors the shape of the loaded swap form so the layout doesn't jump. */
const SwapFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1].map((row) => (
        <div
          key={row}
          className="rounded-2xl border border-(--border) p-4 flex items-center justify-between gap-4"
        >
          <Skeleton.Input active size="large" style={{ width: 110 }} />
          <Skeleton.Input active size="large" style={{ width: '100%' }} />
        </div>
      ))}
      <Skeleton.Button active block size="large" style={{ height: 44 }} />
    </div>
  );
};

export default SwapFormSkeleton;
