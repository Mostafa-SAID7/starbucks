using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Menu;
using Mapster;

namespace Starbucks.Application.Features.Favorites.Queries;

public record GetMyFavoritesQuery() : IRequest<Result<List<MenuItemDto>>>;

public class GetMyFavoritesQueryHandler : IRequestHandler<GetMyFavoritesQuery, Result<List<MenuItemDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetMyFavoritesQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<MenuItemDto>>> Handle(GetMyFavoritesQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == Guid.Empty) return Result<List<MenuItemDto>>.Failure("User not authenticated.");

        var favorites = await _context.Favorites
            .Include(f => f.MenuItem)
                .ThenInclude(m => m.Variants)
            .Where(f => f.UserId == userId)
            .Select(f => f.MenuItem)
            .ToListAsync(cancellationToken);

        var dtos = favorites.Adapt<List<MenuItemDto>>();
        return Result<List<MenuItemDto>>.Success(dtos);
    }
}
