import React, { useEffect, useState } from 'react';
import { Node } from 'reactflow';
import { NodeType, AutomationAction } from '../types';
import { fetchAutomations } from '../services/apiService';
import { X } from 'lucide-react';
import { 
    Box, 
    Typography, 
    IconButton, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Paper,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface NodeConfigPanelProps {
  selectedNode: Node | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onClose: () => void;
}

const PanelContainer = styled(Paper)(({ theme }) => ({
    width: 340,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `1px solid ${theme.palette.divider}`,
    zIndex: 10,
    borderRadius: 0,
    backgroundColor: theme.palette.background.paper,
}));

const Header = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.grey[50],
}));

const Content = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    flex: 1,
    overflowY: 'auto',
}));

const NodeConfigPanel: React.FC<NodeConfigPanelProps> = ({ selectedNode, setNodes, onClose }) => {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [formData, setFormData] = useState<any>({});

  // Fetch automations only once
  useEffect(() => {
    fetchAutomations().then(setAutomations);
  }, []);

  // Update local form state when selection changes
  useEffect(() => {
    if (selectedNode) {
      setFormData({ ...selectedNode.data });
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Update React Flow state immediately
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  };

  const renderFields = () => {
    switch (selectedNode.type) {
      case NodeType.START:
        return (
          <Stack spacing={3}>
               <TextField
                 placeholder="Workflow Title"
                  variant="outlined"
                 fullWidth
                 size="small"
                 value={formData.label || ''}
                 onChange={(e) => handleChange('label', e.target.value)}
               />
               <Paper variant="outlined" sx={{ p: 2, bgcolor: 'primary.50', borderColor: 'primary.100' }}>
                   <Typography variant="caption" color="primary.main">
                       Start nodes can be configured with trigger metadata in a real backend environment.
                   </Typography>
               </Paper>
          </Stack>
        );

      case NodeType.TASK:
        return (
          <Stack spacing={3}>
             <TextField
               label="Task Title"
               variant="outlined"
               fullWidth
               size="small"
               value={formData.label || ''}
               onChange={(e) => handleChange('label', e.target.value)}
             />
             <TextField
               label="Description"
               variant="outlined"
               fullWidth
               multiline
               rows={3}
               size="small"
               value={formData.description || ''}
               onChange={(e) => handleChange('description', e.target.value)}
             />
             <TextField
               label="Assignee"
               variant="outlined"
               fullWidth
               size="small"
               placeholder="e.g. hr-onboarding"
               value={formData.assignee || ''}
               onChange={(e) => handleChange('assignee', e.target.value)}
             />
             <TextField
               label="Due Date"
               // Use text type initially so label floats inside.
               // Switch to date on focus so picker appears.
               type={formData.dueDate ? "date" : "text"}
               variant="outlined"
               fullWidth
               size="small"
               value={formData.dueDate || ''}
               onChange={(e) => handleChange('dueDate', e.target.value)}
               onFocus={(e) => (e.target as HTMLInputElement).type = 'date'}
               onBlur={(e) => {
                 if (!e.target.value) (e.target as HTMLInputElement).type = 'text';
               }}
             />
          </Stack>
        );

      case NodeType.APPROVAL:
         return (
            <Stack spacing={3}>
                <TextField
                   label="Step Name"
                   variant="outlined"
                   fullWidth
                   size="small"
                   value={formData.label || ''}
                   onChange={(e) => handleChange('label', e.target.value)}
                 />
                <FormControl fullWidth size="small">
                    <InputLabel id="approver-role-label">Approver Role</InputLabel>
                    <Select
                        labelId="approver-role-label"
                        value={formData.approverRole || ''}
                        label="Approver Role"
                        onChange={(e) => handleChange('approverRole', e.target.value)}
                    >
                        <MenuItem value="Manager">Manager</MenuItem>
                        <MenuItem value="HRBP">HR Business Partner</MenuItem>
                        <MenuItem value="Director">Director</MenuItem>
                        <MenuItem value="IT_Admin">IT Admin</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Auto-Approve Threshold ($)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={formData.autoApproveThreshold || 0}
                    onChange={(e) => handleChange('autoApproveThreshold', parseInt(e.target.value))}
                />
            </Stack>
         );
      
      case NodeType.AUTOMATION:
        const selectedAction = automations.find(a => a.id === formData.actionId);
        return (
            <Stack spacing={3}>
                 <TextField
                   label="Step Name"
                   variant="outlined"
                   fullWidth
                   size="small"
                   value={formData.label || ''}
                   onChange={(e) => handleChange('label', e.target.value)}
                 />
                <FormControl fullWidth size="small">
                    <InputLabel id="action-select-label">Action</InputLabel>
                    <Select
                        labelId="action-select-label"
                        value={formData.actionId || ''}
                        label="Action"
                        onChange={(e) => handleChange('actionId', e.target.value)}
                    >
                        {automations.map(a => (
                            <MenuItem key={a.id} value={a.id}>{a.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedAction && (
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>PARAMETERS</Typography>
                        <Stack spacing={2}>
                            {selectedAction.params.map(param => (
                                <TextField
                                    key={param}
                                    label={param.toUpperCase().replace('_', ' ')}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    placeholder={`Enter value`}
                                    // Simplified: not persisting dynamic params for prototype
                                />
                            ))}
                        </Stack>
                    </Paper>
                )}
            </Stack>
        );

      case NodeType.END:
        return (
            <Stack spacing={3}>
                <TextField
                   label="Step Name"
                   variant="outlined"
                   fullWidth
                   size="small"
                   value={formData.label || ''}
                   onChange={(e) => handleChange('label', e.target.value)}
                 />
                 <TextField
                   label="End Message"
                   variant="outlined"
                   fullWidth
                   multiline
                   rows={3}
                   size="small"
                   value={formData.endMessage || ''}
                   onChange={(e) => handleChange('endMessage', e.target.value)}
                 />
            </Stack>
        );

      default:
        return <Typography color="text.secondary">Select a node to configure.</Typography>;
    }
  };

  return (
    <PanelContainer elevation={4}>
      <Header>
        <Typography variant="subtitle1" fontWeight="bold">Configuration</Typography>
        <IconButton size="small" onClick={onClose}>
            <X size={18} />
        </IconButton>
      </Header>
      <Content>
        <Box sx={{ mb: 3 }}>
            <Chip 
                label={`${selectedNode.type} Node`} 
                size="small" 
                color="default" 
                sx={{ borderRadius: 1, textTransform: 'uppercase', fontWeight: 600, fontSize: '0.7rem' }} 
            />
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1, fontFamily: 'monospace' }}>
                ID: {selectedNode.id}
            </Typography>
        </Box>
        {renderFields()}
      </Content>
    </PanelContainer>
  );
};

export default NodeConfigPanel;