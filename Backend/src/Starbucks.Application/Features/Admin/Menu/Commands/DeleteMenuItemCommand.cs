using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

public record DeleteMenuItemCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteMenuItemCommandHandler : IRequestHandler<DeleteMenuItemCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public DeleteMenuItemCommandHandler(
        IApplicationDbContext context,
        IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    public async Task<Result<bool>> Handle(DeleteMenuItemCommand request, CancellationToken cancellationToken)
    {
        var menuItem = await _context.MenuItems.FindAsync(new object[] { request.Id }, cancellationToken);

        if (menuItem == null)
        {
            return Result<bool>.Failure("Menu item not found.");
        }

        var oldValues = new { menuItem.Name?.En, menuItem.Price };

        _context.MenuItems.Remove(menuItem);
        await _context.SaveChangesAsync(cancellationToken);

        // Audit Log
        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "DELETE",
            entityType: "MenuItem",
            entityId: request.Id,
            oldValues: oldValues,
            newValues: null,
            cancellationToken: cancellationToken
        );

        return Result<bool>.Success(true);
    }
}
