using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Categories.Commands;

public record DeleteCategoryCommand(Guid CategoryId) : IRequest<Result<string>>;

public class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Result<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public DeleteCategoryCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<string>> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == request.CategoryId && !c.IsDeleted, cancellationToken);

            if (category == null)
            {
                return Result<string>.Failure("Category not found.");
            }

            // Check if category has menu items
            var itemCount = await _context.MenuItems
                .CountAsync(m => m.CategoryId == category.Id && !m.IsDeleted, cancellationToken);

            if (itemCount > 0)
            {
                return Result<string>.Failure($"Cannot delete category with {itemCount} menu items. Please delete or move items first.");
            }

            // Soft delete
            category.IsDeleted = true;
            category.UpdatedAt = _dateTime.UtcNow;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync(cancellationToken);

            // Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty,
                action: "DELETE",
                entityType: "Category",
                entityId: category.Id,
                oldValues: new { category.NameEn, category.NameAr },
                newValues: new { IsDeleted = true },
                cancellationToken: cancellationToken
            );

            return Result<string>.Success("Category deleted successfully.");
        }
        catch (Exception ex)
        {
            return Result<string>.Failure($"Failed to delete category: {ex.Message}");
        }
    }
}
