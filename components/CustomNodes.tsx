import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { PlayCircle, CheckSquare, ShieldCheck, Zap, StopCircle } from 'lucide-react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components ---

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ theme, selected }) => ({
  width: 250,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: selected 
    ? `0 0 0 2px ${theme.palette.primary.light}, 0 4px 6px -1px rgb(0 0 0 / 0.1)` 
    : theme.shadows[3],
  border: selected 
    ? `1px solid ${theme.palette.primary.main}` 
    : `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
}));

const HeaderBox = styled(Box)<{ bgcolor: string }>(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: theme.palette.common.white,
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderTopLeftRadius: (theme.shape.borderRadius as number) * 2,
  borderTopRightRadius: (theme.shape.borderRadius as number) * 2,
}));

// --- Helper Wrapper ---

const NodeWrapper = ({ 
  children, 
  selected, 
  title, 
  icon: Icon,
  color,
}: { 
  children?: React.ReactNode; 
  selected: boolean; 
  title: string;
  icon: React.ElementType;
  color: string;
}) => {
  return (
    <StyledCard selected={selected}>
      <HeaderBox bgcolor={color}>
        <Icon size={16} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {title}
        </Typography>
      </HeaderBox>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {children}
      </CardContent>
    </StyledCard>
  );
};

// --- Nodes ---

export const StartNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <NodeWrapper selected={selected} title={data.label} icon={PlayCircle} color="#2563eb">
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Entry Point</Typography>
            {data.metadata?.length > 0 && (
                <Typography variant="caption" sx={{ bgcolor: 'grey.100', p: 0.5, borderRadius: 1, display: 'inline-block' }}>
                    Has Metadata
                </Typography>
            )}
         </Box>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} style={{ width: 10, height: 10, background: '#2563eb' }} />
    </>
  );
});

export const TaskNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ width: 10, height: 10, background: '#10b981' }} />
      <NodeWrapper selected={selected} title={data.label} icon={CheckSquare} color="#10b981">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {data.description || 'No description provided.'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {data.assignee || 'Unassigned'}
                 </Typography>
                 {data.dueDate && (
                    <Typography variant="caption" sx={{ color: 'error.main', bgcolor: 'error.50', px: 0.5, borderRadius: 0.5 }}>
                        Due: {data.dueDate}
                    </Typography>
                 )}
            </Box>
        </Box>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} style={{ width: 10, height: 10, background: '#10b981' }} />
    </>
  );
});

export const ApprovalNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ width: 10, height: 10, background: '#9333ea' }} />
      <NodeWrapper selected={selected} title={data.label} icon={ShieldCheck} color="#9333ea">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
             <Typography variant="caption" color="text.secondary">Approver Role</Typography>
             <Typography variant="body2" fontWeight={500}>{data.approverRole || 'Select Role'}</Typography>
             
             {data.autoApproveThreshold > 0 && (
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    Auto-approve &lt; ${data.autoApproveThreshold}
                </Typography>
             )}
        </Box>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} style={{ width: 10, height: 10, background: '#9333ea' }} />
    </>
  );
});

export const AutomationNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ width: 10, height: 10, background: '#f97316' }} />
      <NodeWrapper selected={selected} title={data.label} icon={Zap} color="#f97316">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
             <Typography variant="caption" color="text.secondary">Action</Typography>
             <Typography variant="body2" fontWeight={500}>{data.actionId || 'Select Action'}</Typography>
             {Object.keys(data.params || {}).length > 0 && (
                 <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    {Object.keys(data.params).length} parameters configured
                 </Typography>
             )}
        </Box>
      </NodeWrapper>
      <Handle type="source" position={Position.Bottom} style={{ width: 10, height: 10, background: '#f97316' }} />
    </>
  );
});

export const EndNode = memo(({ data, selected }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ width: 10, height: 10, background: '#ef4444' }} />
      <NodeWrapper selected={selected} title={data.label} icon={StopCircle} color="#ef4444">
        <Typography variant="body2" sx={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'text.secondary' }}>
            {data.endMessage || 'Workflow completes here.'}
        </Typography>
      </NodeWrapper>
    </>
  );
});