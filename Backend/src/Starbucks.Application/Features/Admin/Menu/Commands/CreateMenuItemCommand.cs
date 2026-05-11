using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Common;
using Mapster;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

public record CreateMenuItemCommand(CreateMenuItemRequestDto Request) : IRequest<Result<MenuItemManagementDto>>;

public class CreateMenuItemCommandHandler : IRequestHandler<CreateMenuItemCommand, Result<MenuItemManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public CreateMenuItemCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<MenuItemManagementDto>> Handle(CreateMenuItemCommand request, CancellationToken cancellationToken)
    {
        // Check if category exists
        var categoryExists = await _context.MenuCategories.AnyAsync(c => c.Id == request.Request.CategoryId, cancellationToken);
        if (!categoryExists)
        {
            return Result<MenuItemManagementDto>.Failure("Category not found.");
        }

        // Generate slug from name
        var slug = request.Request.NameEn.ToLower().Replace(" ", "-").Replace("'", "");

        var menuItem = new MenuItem
        {
            Id = Guid.NewGuid(),
            // We'll use the first subcategory for now, or assume CategoryId in DTO maps to a primary subcategory
            // For Starbucks Egypt, categories often map 1:1 or we need a specific subcategory.
            // Let's check if we can find a subcategory for this category.
            SubcategoryId = (await _context.MenuSubcategories
                .Where(s => s.CategoryId == request.Request.CategoryId)
                .OrderBy(s => s.SortOrder)
                .FirstOrDefaultAsync(cancellationToken))?.Id ?? Guid.Empty,
            
            Slug = slug,
            Name = new LocalizedContent { En = request.Request.NameEn, Ar = request.Request.NameAr },
            Description = new LocalizedContent { En = request.Request.DescriptionEn, Ar = request.Request.DescriptionAr },
            Price = request.Request.Price,
            ImageUrl = request.Request.Image,
            Calories = request.Request.Calories ?? 0,
            SortOrder = request.Request.DisplayOrder,
            IsAvailable = true,
            IsActive = true,
            CreatedAt = _dateTime.UtcNow
        };

        if (menuItem.SubcategoryId == Guid.Empty)
        {
            return Result<MenuItemManagementDto>.Failure("The selected category has no subcategories to hold items.");
        }

        _context.MenuItems.Add(menuItem);
        await _context.SaveChangesAsync(cancellationToken);

        // Audit Log
        await _auditService.LogActionAsync(
            userId: Guid.Empty, // System/Admin
            action: "CREATE",
            entityType: "MenuItem",
            entityId: menuItem.Id,
            oldValues: null,
            newValues: new { menuItem.Name.En, menuItem.Price, menuItem.SubcategoryId },
            cancellationToken: cancellationToken
        );

        var dto = menuItem.Adapt<MenuItemManagementDto>();
        dto.CategoryId = request.Request.CategoryId;
        dto.CategoryName = (await _context.MenuCategories.FindAsync(new object[] { request.Request.CategoryId }, cancellationToken))?.Name.En ?? string.Empty;

        return Result<MenuItemManagementDto>.Success(dto);
    }
}
