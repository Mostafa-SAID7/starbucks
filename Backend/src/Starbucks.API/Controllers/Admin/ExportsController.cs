using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using System.Text;

namespace Starbucks.API.Controllers.Admin;

/// <summary>
/// Admin – Data Export Services.
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/exports")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class ExportsController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public ExportsController(IApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Export all orders to CSV.
    /// </summary>
    [HttpGet("orders")]
    public async Task<IActionResult> ExportOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var builder = new StringBuilder();
        builder.AppendLine("OrderNumber,User,Total,Status,Date");

        foreach (var order in orders)
        {
            builder.AppendLine($"{order.OrderNumber},{order.User.Email},{order.Total},{order.Status},{order.CreatedAt:yyyy-MM-dd HH:mm}");
        }

        return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", $"orders_export_{DateTime.Now:yyyyMMdd}.csv");
    }

    /// <summary>
    /// Export all users to CSV.
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> ExportUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        var builder = new StringBuilder();
        builder.AppendLine("Email,FirstName,LastName,Role,CreatedAt");

        foreach (var user in users)
        {
            builder.AppendLine($"{user.Email},{user.FirstName},{user.LastName},{user.Role},{user.CreatedAt:yyyy-MM-dd}");
        }

        return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", $"users_export_{DateTime.Now:yyyyMMdd}.csv");
    }
}
