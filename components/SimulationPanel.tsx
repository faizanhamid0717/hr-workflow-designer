import React, { useState } from 'react';
import { Play, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Node, Edge } from 'reactflow';
import { simulateWorkflow } from '../services/apiService';
import { SimulationResult } from '../types';
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    List, 
    ListItem, 
    CircularProgress,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface SimulationPanelProps {
  nodes: Node[];
  edges: Edge[];
}

const PanelContainer = styled(Paper)(({ theme }) => ({
    height: 280,
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0f172a', // slate-900 for terminal look
    color: theme.palette.common.white,
    borderRadius: 0,
    marginTop: 'auto', // push to bottom
}));

const Header = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    borderBottom: '1px solid #1e293b', // slate-800
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#020617', // slate-950
}));

const LogArea = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    padding: 16,
    fontFamily: 'monospace',
    fontSize: '0.875rem',
});

const SimulationPanel: React.FC<SimulationPanelProps> = ({ nodes, edges }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const simResult = await simulateWorkflow(nodes, edges);
      setResult(simResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelContainer elevation={0}>
      <Header>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>Workflow Sandbox</Typography>
            {result?.success === true && (
                <Chip icon={<CheckCircle size={14} color="#10b981" />} label="Valid" size="small" sx={{ bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid #059669' }} />
            )}
            {result?.success === false && (
                <Chip icon={<XCircle size={14} color="#ef4444" />} label="Invalid" size="small" sx={{ bgcolor: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #b91c1c' }} />
            )}
        </Box>
        <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={loading}
            onClick={runSimulation}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Play size={16} />}
            sx={{ textTransform: 'none' }}
        >
          {loading ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </Header>
      
      <LogArea>
        {!result && !loading && (
            <Typography variant="body2" color="rgba(255,255,255,0.4)" align="center" sx={{ mt: 4 }}>
                Click "Run Simulation" to validate and test the workflow logic.
            </Typography>
        )}

        {result?.errors && (
             <Box sx={{ p: 2, mb: 2, bgcolor: 'rgba(127, 29, 29, 0.3)', border: '1px solid #7f1d1d', borderRadius: 1, color: '#fca5a5' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, fontWeight: 'bold' }}>
                    <AlertTriangle size={16}/> Errors Found
                </Box>
                <List dense disablePadding>
                    {result.errors.map((e, i) => (
                        <ListItem key={i} disablePadding sx={{ display: 'list-item', listStyleType: 'disc', ml: 2, fontSize: '0.85rem' }}>
                            {e}
                        </ListItem>
                    ))}
                </List>
             </Box>
        )}

        {result?.logs && (
            <List disablePadding>
                {result.logs.map((log) => (
                    <ListItem key={log.step} disablePadding sx={{ mb: 1.5, alignItems: 'flex-start' }}>
                         <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', width: 80, pt: 0.5, flexShrink: 0 }}>
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                         </Typography>
                         <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ 
                                    width: 8, 
                                    height: 8, 
                                    borderRadius: '50%', 
                                    bgcolor: log.status === 'success' ? '#10b981' : '#ef4444' 
                                }} />
                                <Typography variant="body2" fontWeight="bold" sx={{ color: '#e2e8f0' }}>
                                    {log.label}
                                </Typography>
                                <Chip 
                                    label={log.nodeType.replace('Node', '')} 
                                    size="small" 
                                    sx={{ 
                                        height: 20, 
                                        fontSize: '0.65rem', 
                                        bgcolor: '#1e293b', 
                                        color: '#94a3b8', 
                                        textTransform: 'uppercase',
                                        borderRadius: 0.5
                                    }} 
                                />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5, pl: 2.5, borderLeft: '1px solid #334155' }}>
                                {log.message}
                            </Typography>
                         </Box>
                    </ListItem>
                ))}
            </List>
        )}
      </LogArea>
    </PanelContainer>
  );
};

export default SimulationPanel;