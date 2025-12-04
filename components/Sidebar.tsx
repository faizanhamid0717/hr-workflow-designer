import React from 'react';
import { NodeType } from '../types';
import { PlayCircle, CheckSquare, ShieldCheck, Zap, StopCircle } from 'lucide-react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Box,
  Divider 
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- Styled Components ---

const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: 260,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: '#f8fafc', // slate-50 equivalent
  flexShrink: 0,
  zIndex: 10,
  borderRadius: 0, // Reset Paper rounding
}));

const DraggableItem = styled(ListItem)<{ colorname: string }>(({ theme, colorname }) => ({
  marginBottom: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.common.white,
  cursor: 'grab',
  transition: 'all 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[2],
    borderColor: colorname, // Simple hover color hint
  },
  padding: theme.spacing(1.5),
}));

const IconWrapper = styled(Box)<{ bgcolor: string; color: string }>(({ theme, bgcolor, color }) => ({
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: bgcolor,
  color: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'auto',
  marginRight: theme.spacing(2),
}));

// --- Component ---

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const NodeItem = ({ type, label, icon: Icon, colorBg, colorText, hoverBorder }: { type: NodeType; label: string; icon: any; colorBg: string; colorText: string; hoverBorder: string }) => (
    <DraggableItem 
      colorname={hoverBorder}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
      disablePadding
    >
      <IconWrapper bgcolor={colorBg} color={colorText}>
        <Icon size={18} />
      </IconWrapper>
      <ListItemText 
        primary={label} 
        primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: 'text.primary' }} 
      />
    </DraggableItem>
  );

  return (
    <SidebarContainer elevation={0}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
          Workflow Nodes
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Drag nodes to the canvas
        </Typography>
      </Box>
      
      <Divider />

      <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        <List disablePadding>
          <NodeItem 
            type={NodeType.START} 
            label="Start" 
            icon={PlayCircle} 
            colorBg="#eff6ff" 
            colorText="#2563eb"
            hoverBorder="#60a5fa"
          />
          <NodeItem 
            type={NodeType.TASK} 
            label="Human Task" 
            icon={CheckSquare} 
            colorBg="#ecfdf5" 
            colorText="#10b981"
            hoverBorder="#34d399"
          />
          <NodeItem 
            type={NodeType.APPROVAL} 
            label="Approval" 
            icon={ShieldCheck} 
            colorBg="#faf5ff" 
            colorText="#9333ea"
            hoverBorder="#c084fc"
          />
          <NodeItem 
            type={NodeType.AUTOMATION} 
            label="Automation" 
            icon={Zap} 
            colorBg="#fff7ed" 
            colorText="#f97316"
            hoverBorder="#fb923c"
          />
          <NodeItem 
            type={NodeType.END} 
            label="End" 
            icon={StopCircle} 
            colorBg="#fef2f2" 
            colorText="#ef4444"
            hoverBorder="#f87171"
          />
        </List>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.disabled">
          HR Workflow Designer v1.0
        </Typography>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;