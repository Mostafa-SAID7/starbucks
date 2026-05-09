using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Categories.Commands;

public record UpdateCategoryCommand(Guid CategoryId, UpdateCategoryRequestDto Request) : IRequest<Result<CategoryManagementDto>>;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<CategoryManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public UpdateCategoryCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<CategoryManagementDto>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == request.CategoryId && !c.IsDeleted, cancellationToken);

            if (category == null)
            {
                return Result<CategoryManagementDto>.Failure("Category not found.");
            }

            // Capture old values
            var oldValues = new
            {
                category.NameEn,
                category.NameAr,
                category.DescriptionEn,
                category.DescriptionAr,
                category.DisplayOrder,
                category.IsActive
            };

            // Update fields
            if (!string.IsNullOrWhiteSpace(request.Request.NameEn))
            {
                category.NameEn = request.Request.NameEn;
            }

            if (!string.IsNullOrWhiteSpace(request.Request.NameAr))
            {
                category.NameAr = request.Request.NameAr;
            }

            if (!string.IsNullOrWhiteSpace(request.Request.DescriptionEn))
            {
                category.DescriptionEn = request.Request.DescriptionEn;
            }

            if (!string.IsNullOrWhiteSpace(request.Request.DescriptionAr))
            {
                category.DescriptionAr = request.Request.DescriptionAr;
            }

            if (!string.IsNullOrWhiteSpace(request.Request.Image))
            {
                category.Image = request.Request.Image;
            }

            if (request.Request.DisplayOrder.HasValue)
            {
                category.DisplayOrder = request.Request.DisplayOrder.Value;
            }

            if (request.Request.IsActive.HasValue)
            {
                category.IsActive = request.Request.IsActive.Value;
            }

            category.UpdatedAt = _dateTime.UtcNow;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync(cancellationToken);

            // Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty,
                action: "UPDATE",
                entityType: "Category",
                entityId: category.Id,
                oldValues: oldValues,
                newValues: new { category.NameEn, category.NameAr, category.DisplayOrder, category.IsActive },
                cancellationToken: cancellationToken
            );

            var itemCount = await _context.MenuItems
                .CountAsync(m => m.CategoryId == category.Id && !m.IsDeleted, cancellationToken);

            var dto = category.Adapt<CategoryManagementDto>();
            dto.ItemCount = itemCount;

            return Result<CategoryManagementDto>.Success(dto);
        }
        catch (Exception ex)
        {
            return Result<CategoryManagementDto>.Failure($"Failed to update category: {ex.Message}");
        }
    }
}
