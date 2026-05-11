using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Common;
using Mapster;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

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
        var slug = request.Request.NameEn.ToLower().Replace(" ", "-").Replace("'", "");

        var category = new MenuCategory
        {
            Id = Guid.NewGuid(),
            Slug = slug,
            Name = new LocalizedContent { En = request.Request.NameEn, Ar = request.Request.NameAr },
            Description = new LocalizedContent { En = request.Request.DescriptionEn ?? "", Ar = request.Request.DescriptionAr ?? "" },
            ImageUrl = request.Request.Image,
            SortOrder = request.Request.DisplayOrder,
            IsActive = true,
            CreatedAt = _dateTime.UtcNow
        };

        // Create a default subcategory since MenuItem requires one
        var subcategory = new MenuSubcategory
        {
            Id = Guid.NewGuid(),
            CategoryId = category.Id,
            Slug = "all-" + slug,
            Name = new LocalizedContent { En = "All " + request.Request.NameEn, Ar = "الكل" },
            IsActive = true,
            CreatedAt = _dateTime.UtcNow
        };

        _context.MenuCategories.Add(category);
        _context.MenuSubcategories.Add(subcategory);
        
        await _context.SaveChangesAsync(cancellationToken);

        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "CREATE",
            entityType: "MenuCategory",
            entityId: category.Id,
            oldValues: null,
            newValues: new { category.Name.En, category.Slug },
            cancellationToken: cancellationToken
        );

        return Result<CategoryManagementDto>.Success(category.Adapt<CategoryManagementDto>());
    }
}
