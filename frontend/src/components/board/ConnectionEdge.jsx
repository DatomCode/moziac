import { getBezierPath, getStraightPath, getSmoothStepPath, EdgeLabelRenderer } from '@xyflow/react';

// Custom "loose curve" generator
const getLoosePath = ({ sourceX, sourceY, targetX, targetY }) => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const length = Math.sqrt(dx*dx + dy*dy);
  
  if (length === 0) return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
  
  // Perpendicular offset
  const px = -dy / length;
  const py = dx / length;
  const offset = 150;
  
  const cp1X = sourceX + px * offset;
  const cp1Y = sourceY + py * offset;
  const cp2X = targetX + px * offset;
  const cp2Y = targetY + py * offset;
  
  return `M ${sourceX},${sourceY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${targetX},${targetY}`;
};

export default function ConnectionEdge({
  id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data
}) {
  const lineType = data?.lineType || 'bezier';
  const lineStyle = data?.lineStyle || 'solid';
  const thickness = data?.thickness || 2;
  const arrowStyle = data?.arrowStyle || 'none';
  const color = data?.color || '#a09080';
  const label = data?.label || '';

  let edgePath = '';
  let labelX, labelY;

  const params = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition };

  if (lineType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath(params);
  } else if (lineType === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({ ...params, borderRadius: 20 });
  } else if (lineType === 'step') {
    [edgePath, labelX, labelY] = getSmoothStepPath({ ...params, borderRadius: 0 });
  } else if (lineType === 'loose') {
    edgePath = getLoosePath(params);
    labelX = (sourceX + targetX) / 2;
    labelY = (sourceY + targetY) / 2;
  } else {
    [edgePath, labelX, labelY] = getBezierPath(params);
  }

  const dashArray = lineStyle === 'dashed' ? '6 6' : lineStyle === 'dotted' ? '2 4' : 'none';

  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <marker id={`arrow-end-${id}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
          <marker id={`arrow-start-${id}`} viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 10 0 L 0 5 L 10 10 z" fill={color} />
          </marker>
        </defs>
      </svg>
      <path
        id={id}
        style={{ ...style, stroke: color, strokeWidth: thickness, strokeDasharray: dashArray }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={(arrowStyle === 'end' || arrowStyle === 'both') ? `url(#arrow-end-${id})` : undefined}
        markerStart={(arrowStyle === 'start' || arrowStyle === 'both') ? `url(#arrow-start-${id})` : undefined}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: 'white',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: 10,
              fontWeight: 500,
              color: '#333',
              border: '1px solid #e2e8f0',
              pointerEvents: 'all',
              zIndex: 10,
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
      <circle cx={sourceX} cy={sourceY} fill={color} r={thickness + 1} />
      <circle cx={targetX} cy={targetY} fill={color} r={thickness + 1} />
    </>
  );
}
