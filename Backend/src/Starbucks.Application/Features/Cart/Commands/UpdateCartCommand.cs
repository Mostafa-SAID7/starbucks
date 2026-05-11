using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Domain.Entities;

namespace Starbucks.Application.Features.Cart.Commands;

public record UpdateCartCommand(Guid MenuItemId, Guid? VariantId, int Quantity, string? ModifiersJson) : IRequest<Result<bool>>;

public class UpdateCartCommandHandler : IRequestHandler<UpdateCartCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UpdateCartCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<bool>> Handle(UpdateCartCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (userId == Guid.Empty) return Result<bool>.Failure("User not authenticated.");

        if (request.Quantity <= 0)
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.MenuItemId == request.MenuItemId && c.MenuItemVariantId == request.VariantId, cancellationToken);
            
            if (item != null) _context.CartItems.Remove(item);
        }
        else
        {
            var item = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.MenuItemId == request.MenuItemId && c.MenuItemVariantId == request.VariantId, cancellationToken);

            if (item != null)
            {
                item.Quantity = request.Quantity;
                item.SelectedModifiersJson = request.ModifiersJson;
            }
            else
            {
                _context.CartItems.Add(new CartItem
                {
                    UserId = userId,
                    MenuItemId = request.MenuItemId,
                    MenuItemVariantId = request.VariantId,
                    Quantity = request.Quantity,
                    SelectedModifiersJson = request.ModifiersJson
                });
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
