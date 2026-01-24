# Backend services for cost calculations
from .componentService import ComponentService

class CostService:
    @staticmethod
    def calculate_node_cost(component_id: str, config_overrides: dict = None):
        """Calculate cost for a single node/component"""
        component = ComponentService.get_component_by_id(component_id)
        if not component:
            return 0
        
        config = component.get("config", {}).copy()
        if config_overrides:
            config.update(config_overrides)
        
        pricing = component.get("pricing", {})
        cost = 0
        
        # API Gateway pricing
        if component_id == "aws-api-gateway":
            requests = config.get("requestsPerMonth", 0)
            cost = (requests / 1000000) * pricing.get("perMillionRequests", 0)
        
        # Lambda pricing
        elif component_id == "aws-lambda":
            requests = config.get("requestsPerMonth", 0)
            memory_mb = config.get("memoryMB", 512)
            execution_time_ms = config.get("executionTimeMs", 100)
            
            request_cost = (requests / 1000000) * pricing.get("perMillionRequests", 0)
            compute_cost = (requests * memory_mb / 1024 * execution_time_ms / 1000 / 3600) * pricing.get("perGBSecond", 0)
            cost = request_cost + compute_cost
        
        # EC2 pricing
        elif component_id == "aws-ec2":
            instance_type = config.get("instanceType", "t3.micro")
            hours = config.get("hoursPerMonth", 730)
            hourly_rate = pricing.get(instance_type, 0)
            cost = hours * hourly_rate
        
        # S3 pricing
        elif component_id == "aws-s3":
            storage_gb = config.get("storageGB", 0)
            requests = config.get("requestsPerMonth", 0)
            transfer_gb = config.get("dataTransferGB", 0)
            
            storage_cost = storage_gb * pricing.get("perGBStorage", 0)
            request_cost = (requests / 1000) * pricing.get("per1000Requests", 0)
            transfer_cost = transfer_gb * pricing.get("perGBTransfer", 0)
            cost = storage_cost + request_cost + transfer_cost
        
        # RDS pricing
        elif component_id == "aws-rds":
            instance_type = config.get("instanceType", "db.t3.micro")
            storage_gb = config.get("storageGB", 0)
            hours = config.get("hoursPerMonth", 730)
            
            instance_cost = hours * pricing.get(instance_type, 0)
            storage_cost = storage_gb * pricing.get("perGBStorage", 0)
            cost = instance_cost + storage_cost
        
        return round(cost, 2)
    
    @staticmethod
    def calculate_total_cost(nodes: list):
        """Calculate total cost for a list of nodes"""
        total = 0
        breakdown = []
        
        for node in nodes:
            component_id = node.get("componentId")
            config_overrides = node.get("configOverrides", {})
            cost = CostService.calculate_node_cost(component_id, config_overrides)
            total += cost
            
            component = ComponentService.get_component_by_id(component_id)
            breakdown.append({
                "nodeId": node.get("nodeId"),
                "componentName": component.get("name") if component else component_id,
                "cost": cost
            })
        
        return {
            "total_cost": round(total, 2),
            "breakdown": breakdown
        }
    
    @staticmethod
    def get_cost_breakdown(nodes: list):
        """Get detailed cost breakdown"""
        return CostService.calculate_total_cost(nodes)
