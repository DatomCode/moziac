import { getBezierPath } from '@xyflow/react';

export default function ConnectionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const color = data?.color || '#a09080';

  return (
    <>
      <path
        id={id}
        style={{ ...style, stroke: color, strokeWidth: 1.5, strokeDasharray: '6, 6' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <circle cx={sourceX} cy={sourceY} fill={color} r={3} />
      <circle cx={targetX} cy={targetY} fill={color} r={3} />
    </>
  );
}
