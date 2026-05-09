using MediatR;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Mapster;

namespace Starbucks.Application.Features.Admin.Categories.Commands;

public record CreateCategoryCommand(CreateCategoryRequestDto Request) : IRequest<Result<CategoryManagementDto>>;

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result<CategoryManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public CreateCategoryCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<CategoryManagementDto>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var category = new Category
            {
                Id = Guid.NewGuid(),
                NameEn = request.Request.NameEn,
                NameAr = request.Request.NameAr,
                DescriptionEn = request.Request.DescriptionEn,
                DescriptionAr = request.Request.DescriptionAr,
                Image = request.Request.Image,
                DisplayOrder = request.Request.DisplayOrder,
                IsActive = true,
                CreatedAt = _dateTime.UtcNow
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync(cancellationToken);

            // Create audit log
            await _auditService.LogActionAsync(
                userId: Guid.Empty,
                action: "CREATE",
                entityType: "Category",
                entityId: category.Id,
                oldValues: null,
                newValues: new { category.NameEn, category.NameAr, category.DisplayOrder },
                cancellationToken: cancellationToken
            );

            var dto = category.Adapt<CategoryManagementDto>();
            dto.ItemCount = 0;

            return Result<CategoryManagementDto>.Success(dto);
        }
        catch (Exception ex)
        {
            return Result<CategoryManagementDto>.Failure($"Failed to create category: {ex.Message}");
        }
    }
}
