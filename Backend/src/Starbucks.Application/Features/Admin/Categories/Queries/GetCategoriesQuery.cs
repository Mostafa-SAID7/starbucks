using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Categories.Queries;

public record GetCategoriesQuery(
    int PageNumber = 1,
    int PageSize = 20,
    string? SearchTerm = null
) : IRequest<Result<PagedResult<CategoryManagementDto>>>;

public class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, Result<PagedResult<CategoryManagementDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetCategoriesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<CategoryManagementDto>>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var query = _context.Categories.AsNoTracking().Where(c => !c.IsDeleted);

            // Apply search filter
            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(c =>
                    c.NameEn.ToLower().Contains(searchTerm) ||
                    c.NameAr.ToLower().Contains(searchTerm)
                );
            }

            // Get total count
            var totalCount = await query.CountAsync(cancellationToken);

            // Apply pagination and ordering
            var categories = await query
                .OrderBy(c => c.DisplayOrder)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync(cancellationToken);

            // Map to DTOs and get item counts
            var categoryDtos = new List<CategoryManagementDto>();
            foreach (var category in categories)
            {
                var itemCount = await _context.MenuItems
                    .CountAsync(m => m.CategoryId == category.Id && !m.IsDeleted, cancellationToken);

                var dto = category.Adapt<CategoryManagementDto>();
                dto.ItemCount = itemCount;
                categoryDtos.Add(dto);
            }

            var result = PagedResult<CategoryManagementDto>.Create(categoryDtos, totalCount, request.PageNumber, request.PageSize);
            return Result<PagedResult<CategoryManagementDto>>.Success(result);
        }
        catch (Exception ex)
        {
            return Result<PagedResult<CategoryManagementDto>>.Failure($"Failed to retrieve categories: {ex.Message}");
        }
    }
}
