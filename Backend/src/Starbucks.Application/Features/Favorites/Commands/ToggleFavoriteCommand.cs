using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Entities;

namespace Starbucks.Application.Features.Favorites.Commands;

public record ToggleFavoriteCommand(Guid MenuItemId) : IRequest<Result<bool>>;

public class ToggleFavoriteCommandHandler : IRequestHandler<ToggleFavoriteCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public ToggleFavoriteCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<bool>> Handle(ToggleFavoriteCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == Guid.Empty) return Result<bool>.Failure("User not authenticated.");

        var existing = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.MenuItemId == request.MenuItemId, cancellationToken);

        if (existing != null)
        {
            _context.Favorites.Remove(existing);
            await _context.SaveChangesAsync(cancellationToken);
            return Result<bool>.Success(false); // Removed
        }

        var favorite = new Favorite
        {
            UserId = userId,
            MenuItemId = request.MenuItemId
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync(cancellationToken);
        
        return Result<bool>.Success(true); // Added
    }
}
