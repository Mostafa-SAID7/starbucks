using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Locations.Commands;

public record DeleteLocationCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteLocationCommandHandler : IRequestHandler<DeleteLocationCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IAuditService _auditService;

    public DeleteLocationCommandHandler(IApplicationDbContext context, IAuditService auditService)
    {
        _context = context;
        _auditService = auditService;
    }

    public async Task<Result<bool>> Handle(DeleteLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await _context.Locations.FindAsync(new object[] { request.Id }, cancellationToken);

        if (location == null)
        {
            return Result<bool>.Failure("Location not found.");
        }

        _context.Locations.Remove(location);
        await _context.SaveChangesAsync(cancellationToken);

        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "DELETE",
            entityType: "Location",
            entityId: request.Id,
            oldValues: new { Name = location.Name },
            newValues: null,
            cancellationToken: cancellationToken
        );

        return Result<bool>.Success(true);
    }
}
