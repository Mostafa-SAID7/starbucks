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

public record UpdateMenuItemCommand(Guid Id, UpdateMenuItemRequestDto Request) : IRequest<Result<MenuItemManagementDto>>;

public class UpdateMenuItemCommandHandler : IRequestHandler<UpdateMenuItemCommand, Result<MenuItemManagementDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public UpdateMenuItemCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<MenuItemManagementDto>> Handle(UpdateMenuItemCommand request, CancellationToken cancellationToken)
    {
        var menuItem = await _context.MenuItems
            .Include(m => m.Subcategory)
            .ThenInclude(s => s.Category)
            .FirstOrDefaultAsync(m => m.Id == request.Id, cancellationToken);

        if (menuItem == null)
        {
            return Result<MenuItemManagementDto>.Failure("Menu item not found.");
        }

        var oldValues = new { menuItem.Name.En, menuItem.Price, menuItem.IsAvailable };

        // Update basic properties if provided
        if (request.Request.NameEn != null) menuItem.Name.En = request.Request.NameEn;
        if (request.Request.NameAr != null) menuItem.Name.Ar = request.Request.NameAr;
        if (request.Request.DescriptionEn != null)
        {
            menuItem.Description ??= new LocalizedContent();
            menuItem.Description.En = request.Request.DescriptionEn;
        }
        if (request.Request.DescriptionAr != null)
        {
            menuItem.Description ??= new LocalizedContent();
            menuItem.Description.Ar = request.Request.DescriptionAr;
        }
        
        if (request.Request.Price.HasValue) menuItem.Price = request.Request.Price.Value;
        if (request.Request.Image != null) menuItem.ImageUrl = request.Request.Image;
        if (request.Request.Calories.HasValue) menuItem.Calories = request.Request.Calories.Value;
        if (request.Request.IsAvailable.HasValue) menuItem.IsAvailable = request.Request.IsAvailable.Value;
        if (request.Request.DisplayOrder.HasValue) menuItem.SortOrder = request.Request.DisplayOrder.Value;

        // Handle category change (if subcategory needs to be reassigned)
        if (request.Request.CategoryId.HasValue && request.Request.CategoryId != menuItem.Subcategory.CategoryId)
        {
            var newSubcategory = await _context.MenuSubcategories
                .Where(s => s.CategoryId == request.Request.CategoryId.Value)
                .OrderBy(s => s.SortOrder)
                .FirstOrDefaultAsync(cancellationToken);

            if (newSubcategory == null)
            {
                return Result<MenuItemManagementDto>.Failure("Target category has no subcategories.");
            }

            menuItem.SubcategoryId = newSubcategory.Id;
        }

        menuItem.UpdatedAt = _dateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        // Audit Log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "UPDATE",
            entityType: "MenuItem",
            entityId: menuItem.Id,
            oldValues: oldValues,
            newValues: new { menuItem.Name.En, menuItem.Price, menuItem.IsAvailable },
            cancellationToken: cancellationToken
        );

        var dto = menuItem.Adapt<MenuItemManagementDto>();
        dto.CategoryId = menuItem.Subcategory.CategoryId;
        dto.CategoryName = menuItem.Subcategory.Category.Name.En;

        return Result<MenuItemManagementDto>.Success(dto);
    }
}
