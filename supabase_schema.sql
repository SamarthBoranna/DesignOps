-- DesignOps Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/yhpyyspzujfvmekhhmty/sql)

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create nodes table
CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    component_id TEXT NOT NULL,
    component_name TEXT NOT NULL,
    position JSONB NOT NULL DEFAULT '{"x": 0, "y": 0}',
    config_overrides JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX IF NOT EXISTS idx_nodes_workspace_id ON nodes(workspace_id);

-- Enable Row Level Security
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Users can view their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can create their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can update their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can view nodes in their workspaces" ON nodes;
DROP POLICY IF EXISTS "Users can create nodes in their workspaces" ON nodes;
DROP POLICY IF EXISTS "Users can update nodes in their workspaces" ON nodes;
DROP POLICY IF EXISTS "Users can delete nodes in their workspaces" ON nodes;

-- RLS Policies for workspaces table
CREATE POLICY "Users can view their own workspaces"
    ON workspaces FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workspaces"
    ON workspaces FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspaces"
    ON workspaces FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workspaces"
    ON workspaces FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for nodes table
CREATE POLICY "Users can view nodes in their workspaces"
    ON nodes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = nodes.workspace_id
            AND workspaces.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create nodes in their workspaces"
    ON nodes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = nodes.workspace_id
            AND workspaces.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update nodes in their workspaces"
    ON nodes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = nodes.workspace_id
            AND workspaces.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete nodes in their workspaces"
    ON nodes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM workspaces
            WHERE workspaces.id = nodes.workspace_id
            AND workspaces.user_id = auth.uid()
        )
    );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on workspaces table
DROP TRIGGER IF EXISTS update_workspaces_updated_at ON workspaces;
CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
