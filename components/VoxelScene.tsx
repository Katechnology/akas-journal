import { sceneSvg } from "@/lib/scenes";

/** Server-rendered isometric voxel diorama. Decorative: hidden from assistive tech. */
export function VoxelScene({ name, className = "vox" }: { name: string; className?: string }) {
  const { viewBox, body } = sceneSvg(name);
  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
