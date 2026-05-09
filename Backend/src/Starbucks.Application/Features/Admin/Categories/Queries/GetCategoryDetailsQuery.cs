using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Categories.Queries;

public record GetCategoryDetailsQuery(Guid CategoryId) : IRequest<Result<CategoryManagementDto>>;

public class GetCategoryDetailsQueryHandler : IRequestHandler<GetCategoryDetailsQuery, Result<CategoryManagementDto>>
{
    private readonly IApplicationDbContext _context;

    public GetCategoryDetailsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CategoryManagementDto>> Handle(GetCategoryDetailsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var category = await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Id == request.CategoryId && !c.IsDeleted, cancellationToken);

            if (category == null)
            {
                return Result<CategoryManagementDto>.Failure("Category not found.");
            }

            var itemCount = await _context.MenuItems
                .CountAsync(m => m.CategoryId == category.Id && !m.IsDeleted, cancellationToken);

            var dto = category.Adapt<CategoryManagementDto>();
            dto.ItemCount = itemCount;

            return Result<CategoryManagementDto>.Success(dto);
        }
        catch (Exception ex)
        {
            return Result<CategoryManagementDto>.Failure($"Failed to retrieve category details: {ex.Message}");
        }
    }
}
