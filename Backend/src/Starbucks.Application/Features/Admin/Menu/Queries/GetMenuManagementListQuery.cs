using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Menu.Queries;

public record GetMenuManagementListQuery : IRequest<Result<List<MenuItemManagementDto>>>;

public class GetMenuManagementListQueryHandler : IRequestHandler<GetMenuManagementListQuery, Result<List<MenuItemManagementDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetMenuManagementListQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<List<MenuItemManagementDto>>> Handle(GetMenuManagementListQuery request, CancellationToken cancellationToken)
    {
        var items = await _context.MenuItems
            .Include(m => m.Subcategory)
            .ThenInclude(s => s.Category)
            .OrderBy(m => m.Subcategory.Category.SortOrder)
            .ThenBy(m => m.Subcategory.SortOrder)
            .ThenBy(m => m.SortOrder)
            .ToListAsync(cancellationToken);

        var dtos = items.Select(m => {
            var dto = m.Adapt<MenuItemManagementDto>();
            dto.CategoryId = m.Subcategory.CategoryId;
            dto.CategoryName = m.Subcategory.Category.Name.En;
            dto.NameEn = m.Name.En;
            dto.NameAr = m.Name.Ar;
            dto.DescriptionEn = m.Description?.En;
            dto.DescriptionAr = m.Description?.Ar;
            dto.Image = m.ImageUrl;
            return dto;
        }).ToList();

        return Result<List<MenuItemManagementDto>>.Success(dtos);
    }
}
