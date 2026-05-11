namespace Starbucks.Application.DTOs.Admin;

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalLocations { get; set; }
    public int TotalMenuItems { get; set; }
    public decimal GrowthRate { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
    public List<RevenuePointDto> RevenueChart { get; set; } = new();
    public List<TopProductDto> TopProducts { get; set; } = new();
}

public class RecentOrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class RevenuePointDto
{
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
}

public class TopProductDto
{
    public string ProductName { get; set; } = string.Empty;
    public int QuantitySold { get; set; }
    public decimal TotalRevenue { get; set; }
}
