import React, { useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
} from 'reactflow';
import { 
  Box, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Chip, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';

import Sidebar from './components/Sidebar';
import NodeConfigPanel from './components/NodeConfigPanel';
import SimulationPanel from './components/SimulationPanel';
import { useWorkflow } from './hooks/useWorkflow';
import { NODE_TYPES } from './constants';

// --- Styled Components ---

const RootContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

const WorkArea = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minWidth: 0,
});

const CanvasContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  position: 'relative',
  minHeight: 0,
  backgroundColor: theme.palette.grey[100],
}));

const FlowWrapper = styled(Box)({
  flex: 1,
  height: '100%',
  position: 'relative',
});

// Create a default theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Blue-600
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        },
      },
    },
  },
});

const HRWorkflowBuilder = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    onNodeClick,
    onPaneClick,
    setReactFlowInstance,
    selectedNode,
    setSelectedNode,
    setNodes,
  } = useWorkflow();

  return (
    <RootContainer>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar variant="dense">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 32, 
                height: 32, 
                borderRadius: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              }}
            >
              HR
            </Box>
            <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              Workflow Designer
            </Typography>
          </Box>
          <Box>
            <Chip 
              label="Prototype Mode" 
              size="small" 
              color="primary" 
              variant="outlined" 
              sx={{ bgcolor: 'primary.50', borderColor: 'primary.100' }} 
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <MainContent>
        <Sidebar />
        
        <WorkArea>
            {/* Upper Section: Canvas + Config */}
            <CanvasContainer>
                <FlowWrapper ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        nodeTypes={NODE_TYPES}
                        fitView
                    >
                        <Controls />
                        <Background color="#cbd5e1" gap={20} />
                    </ReactFlow>
                </FlowWrapper>
                
                {/* Config Panel - Side by side */}
                {selectedNode && (
                    <NodeConfigPanel 
                        selectedNode={selectedNode} 
                        setNodes={setNodes} 
                        onClose={() => setSelectedNode(null)} 
                    />
                )}
            </CanvasContainer>
            
            {/* Simulation Panel (Bottom) */}
            <SimulationPanel nodes={nodes} edges={edges} />
        </WorkArea>
      </MainContent>
    </RootContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ReactFlowProvider>
        <HRWorkflowBuilder />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}