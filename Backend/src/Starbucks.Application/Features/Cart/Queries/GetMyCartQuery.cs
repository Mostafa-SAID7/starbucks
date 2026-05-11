using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Cart;
using Mapster;

namespace Starbucks.Application.Features.Cart.Queries;

public record GetMyCartQuery() : IRequest<Result<List<CartItemDto>>>;

public class GetMyCartQueryHandler : IRequestHandler<GetMyCartQuery, Result<List<CartItemDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetMyCartQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<CartItemDto>>> Handle(GetMyCartQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == Guid.Empty) return Result<List<CartItemDto>>.Failure("User not authenticated.");

        var items = await _context.CartItems
            .Include(i => i.MenuItem)
            .Include(i => i.Variant)
            .Where(i => i.UserId == userId)
            .ToListAsync(cancellationToken);

        var dtos = items.Adapt<List<CartItemDto>>();
        return Result<List<CartItemDto>>.Success(dtos);
    }
}
