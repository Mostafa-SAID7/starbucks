using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Orders;
using Mapster;

namespace Starbucks.Application.Features.Orders.Queries;

public record GetMyOrdersQuery : IRequest<Result<List<OrderDto>>>;

public class GetMyOrdersQueryHandler : IRequestHandler<GetMyOrdersQuery, Result<List<OrderDto>>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUserService;

    public GetMyOrdersQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    public async Task<Result<List<OrderDto>>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        if (!_currentUserService.UserId.HasValue)
        {
            return Result<List<OrderDto>>.Failure("User not authenticated.");
        }

        var orders = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(i => i.MenuItem)
            .Where(o => o.UserId == _currentUserService.UserId.Value)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        var dtos = orders.Select(o => {
            var dto = o.Adapt<OrderDto>();
            dto.Items = o.Items.Select(i => new OrderItemDto {
                MenuItemId = i.MenuItemId,
                MenuItemName = i.MenuItem.Name.En,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice,
                SpecialInstructions = i.SpecialInstructions
            }).ToList();
            return dto;
        }).ToList();

        return Result<List<OrderDto>>.Success(dtos);
    }
}
