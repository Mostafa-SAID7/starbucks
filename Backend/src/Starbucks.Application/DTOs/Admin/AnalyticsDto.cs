namespace Starbucks.Application.DTOs.Admin;

/// <summary>
/// DTO for system analytics summary.
/// </summary>
public class AnalyticsSummaryDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int NewUsersThisMonth { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal RevenueThisMonth { get; set; }
    public int TotalOrders { get; set; }
    public int OrdersThisMonth { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int TotalLocations { get; set; }
    public int TotalMenuItems { get; set; }
    public double UserRetentionRate { get; set; }
    public double ConversionRate { get; set; }
    public decimal GrowthRate { get; set; }
}


/// <summary>
/// DTO for sales analytics.
/// </summary>
public class SalesAnalyticsDto
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int UniqueCustomers { get; set; }
}

/// <summary>
/// DTO for user analytics.
/// </summary>
public class UserAnalyticsDto
{
    public DateTime Date { get; set; }
    public int NewUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int ReturningUsers { get; set; }
    public double RetentionRate { get; set; }
    public double ChurnRate { get; set; }
}

/// <summary>
/// DTO for order analytics.
/// </summary>
public class OrderAnalyticsDto
{
    public DateTime Date { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
    public double CompletionRate { get; set; }
}

/// <summary>
/// DTO for location performance.
/// </summary>
public class LocationPerformanceDto
{
    public Guid LocationId { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
    public int UniqueCustomers { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
}

/// <summary>
/// DTO for menu item popularity.
/// </summary>
public class MenuItemPopularityDto
{
    public Guid MenuItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int OrderCount { get; set; }
    public decimal Revenue { get; set; }
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public double PopularityScore { get; set; }
}

/// <summary>
/// DTO for custom report generation.
/// </summary>
public class ReportGenerationRequestDto
{
    public string ReportType { get; set; } = string.Empty; // "Sales", "Users", "Orders", "Locations", "MenuItems"
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? Format { get; set; } = "json"; // "json", "csv", "pdf"
    public Dictionary<string, string>? Filters { get; set; }
}

/// <summary>
/// DTO for report data.
/// </summary>
public class ReportDataDto
{
    public string ReportType { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public Dictionary<string, object>? Summary { get; set; }
    public List<Dictionary<string, object>>? Data { get; set; }
}
