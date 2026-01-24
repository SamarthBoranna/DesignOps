import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import ComponentPanel from '../../components/panels/ComponentPanel/ComponentPanel'
import RightSidebar from '../../components/panels/RightSidebar/RightSidebar'
import NodeConfigPanel from '../../components/panels/NodeConfigPanel/NodeConfigPanel'
import './Workspace.css'

let nodeIdCounter = 0

function Workspace() {
  const { id } = useParams()
  const navigate = useNavigate()
  const reactFlowWrapper = useRef(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [workspace, setWorkspace] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  useEffect(() => {
    fetchWorkspace()
  }, [id])

  useEffect(() => {
    if (workspace && workspace.nodes) {
      const loadNodes = async () => {
        const flowNodes = await Promise.all(
          workspace.nodes.map(async (node) => {
            // Try to fetch component name if not available
            let componentName = node.componentName
            if (!componentName) {
              try {
                const response = await fetch(`/api/components/${node.componentId}`)
                const component = await response.json()
                componentName = component.name || node.componentId
              } catch (error) {
                componentName = node.componentId
              }
            }
            
            return {
              id: node.nodeId,
              type: 'default',
              position: node.position || { x: 100, y: 100 },
              data: {
                label: componentName,
                componentId: node.componentId,
                configOverrides: node.configOverrides || {},
              },
            }
          })
        )
        setNodes(flowNodes)
      }
      loadNodes()
    }
  }, [workspace])

  const fetchWorkspace = async () => {
    try {
      const response = await fetch(`/api/workspaces/${id}`)
      if (response.status === 404) {
        navigate('/')
        return
      }
      const data = await response.json()
      setWorkspace(data)
    } catch (error) {
      console.error('Error fetching workspace:', error)
    }
  }

  const saveWorkspace = async (updatedNodes) => {
    if (!workspace) return

    const nodesToSave = updatedNodes.map(node => ({
      nodeId: node.id,
      componentId: node.data.componentId,
      componentName: node.data.label,
      position: node.position,
      configOverrides: node.data.configOverrides || {},
    }))

    try {
      const response = await fetch(`/api/workspaces/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: nodesToSave })
      })
      const updated = await response.json()
      setWorkspace(updated)
    } catch (error) {
      console.error('Error saving workspace:', error)
    }
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault()

      const componentData = event.dataTransfer.getData('application/reactflow')
      if (!componentData) return

      const component = JSON.parse(componentData)
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode = {
        id: `node-${nodeIdCounter++}`,
        type: 'default',
        position,
        data: {
          label: component.name,
          componentId: component.id,
          configOverrides: {},
        },
      }

      const updatedNodes = [...nodes, newNode]
      setNodes(updatedNodes)
      await saveWorkspace(updatedNodes)
    },
    [reactFlowInstance, nodes, setNodes]
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  const handleNodeConfigUpdate = useCallback(async (nodeId, configOverrides) => {
    const updatedNodes = nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            configOverrides,
          },
        }
      }
      return node
    })
    setNodes(updatedNodes)
    await saveWorkspace(updatedNodes)
  }, [nodes, setNodes])

  const handleNodeDelete = useCallback(async (nodeId) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId)
    setNodes(updatedNodes)
    setSelectedNode(null)
    await saveWorkspace(updatedNodes)
  }, [nodes, setNodes])

  const nodesForCost = nodes.map(node => ({
    nodeId: node.id,
    componentId: node.data.componentId,
    configOverrides: node.data.configOverrides || {},
  }))

  if (!workspace) {
    return <div style={{ padding: '2rem' }}>Loading workspace...</div>
  }

  return (
    <div className="workspace-container">
      <ComponentPanel />
      <div className="workspace-canvas" ref={reactFlowWrapper}>
        <div className="workspace-header">
          <h2>{workspace.name}</h2>
          <button onClick={() => navigate('/')} className="btn-secondary">
            ← Back to Workspaces
          </button>
        </div>
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
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {selectedNode ? (
        <NodeConfigPanel
          node={selectedNode}
          onUpdate={handleNodeConfigUpdate}
          onDelete={handleNodeDelete}
          onClose={() => setSelectedNode(null)}
        />
      ) : (
        <RightSidebar nodes={nodesForCost} />
      )}
    </div>
  )
}

export default Workspace
