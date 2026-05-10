using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Starbucks.Application.Common.Abstractions;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.Common.Utilities;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Menu.Queries;

public record GetMenuCategoryBySlugQuery(string Slug, string? Language = null) 
    : IRequest<Result<MenuCategoryDto>>;

public class GetMenuCategoryBySlugQueryHandler : CachedQueryHandler<GetMenuCategoryBySlugQuery, MenuCategoryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICacheService _cacheService;
    private readonly ILogger<GetMenuCategoryBySlugQueryHandler> _logger;

    public GetMenuCategoryBySlugQueryHandler(
        IApplicationDbContext context,
        ICacheService cacheService,
        ILogger<GetMenuCategoryBySlugQueryHandler> logger)
        : base(cacheService)
    {
        _context = context;
        _cacheService = cacheService;
        _logger = logger;
    }

    protected override string GenerateCacheKey(GetMenuCategoryBySlugQuery request)
        => CacheKeyGenerator.MenuCategoryBySlug(request.Slug, request.Language);

    protected override TimeSpan GetCacheDuration() => TimeSpan.FromHours(1);

    protected override async Task<Result<MenuCategoryDto>> ExecuteQueryAsync(
        GetMenuCategoryBySlugQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            // STEP 1: Validate input
            if (string.IsNullOrWhiteSpace(request.Slug))
                return Result<MenuCategoryDto>.Failure("Category slug is required");

            // STEP 2: Query using context (MenuCategory is not in IUnitOfWork yet)
            var category = await _context.MenuCategories
                .AsNoTracking()
                .Where(c => c.Slug == request.Slug && c.IsActive && !c.IsDeleted)
                .Include(c => c.Subcategories.Where(s => s.IsActive && !s.IsDeleted))
                .ThenInclude(s => s.Items.Where(i => i.IsActive && !i.IsDeleted))
                .ThenInclude(i => i.Variants.Where(v => v.IsAvailable && !v.IsDeleted))
                .FirstOrDefaultAsync(cancellationToken);

            if (category == null)
            {
                _logger.LogWarning("Menu category not found with slug: {Slug}", request.Slug);
                return Result<MenuCategoryDto>.Failure($"Menu category with slug '{request.Slug}' not found");
            }

            // STEP 3: Map and return
            var categoryDto = category.Adapt<MenuCategoryDto>();

            _logger.LogInformation("Menu category retrieved successfully: {Slug}", request.Slug);

            return Result<MenuCategoryDto>.Success(categoryDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetMenuCategoryBySlugQueryHandler for slug: {Slug}", request.Slug);
            return Result<MenuCategoryDto>.Failure("An error occurred while retrieving menu category");
        }
    }
}
