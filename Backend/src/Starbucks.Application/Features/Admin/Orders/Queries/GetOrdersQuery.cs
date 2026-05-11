using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Orders;
using Mapster;

namespace Starbucks.Application.Features.Admin.Orders.Queries;

public record GetOrdersQuery(int PageNumber = 1, int PageSize = 20) : IRequest<Result<PagedResult<OrderDto>>>;

public class GetOrdersQueryHandler : IRequestHandler<GetOrdersQuery, Result<PagedResult<OrderDto>>>
{
    private readonly IApplicationDbContext _context;

    public GetOrdersQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<PagedResult<OrderDto>>> Handle(GetOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
            .ThenInclude(i => i.MenuItem)
            .OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = items.Select(o => {
            var dto = o.Adapt<OrderDto>();
            dto.Items = o.Items.Select(i => new OrderItemDto {
                MenuItemId = i.MenuItemId,
                MenuItemName = i.MenuItem.Name.En,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice
            }).ToList();
            return dto;
        }).ToList();

        return Result<PagedResult<OrderDto>>.Success(new PagedResult<OrderDto>(dtos, totalCount, request.PageNumber, request.PageSize));
    }
}
