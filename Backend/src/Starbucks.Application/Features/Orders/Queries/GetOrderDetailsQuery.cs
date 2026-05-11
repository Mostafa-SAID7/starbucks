using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Orders;
using Mapster;

namespace Starbucks.Application.Features.Orders.Queries;

public record GetOrderDetailsQuery(Guid OrderId) : IRequest<Result<OrderDto>>;

public class GetOrderDetailsQueryHandler : IRequestHandler<GetOrderDetailsQuery, Result<OrderDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetOrderDetailsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<OrderDto>> Handle(GetOrderDetailsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        var order = await _context.Orders
            .Include(o => o.Items)
                .ThenInclude(i => i.MenuItem)
            .Include(o => o.Location)
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.UserId == userId, cancellationToken);

        if (order == null) return Result<OrderDto>.Failure("Order not found.");

        var dto = order.Adapt<OrderDto>();
        dto.Items = order.Items.Select(i => new OrderItemDto {
            MenuItemId = i.MenuItemId,
            MenuItemName = i.MenuItem.Name.En,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            TotalPrice = i.TotalPrice,
            SpecialInstructions = i.SpecialInstructions
        }).ToList();

        return Result<OrderDto>.Success(dto);
    }
}
