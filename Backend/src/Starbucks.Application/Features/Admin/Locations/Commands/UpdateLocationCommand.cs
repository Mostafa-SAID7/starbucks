using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Locations.Commands;

public record UpdateLocationCommand(Guid Id, CreateLocationDto Request) : IRequest<Result<bool>>;

public class UpdateLocationCommandHandler : IRequestHandler<UpdateLocationCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public UpdateLocationCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<bool>> Handle(UpdateLocationCommand request, CancellationToken cancellationToken)
    {
        var location = await _context.Locations.FindAsync(new object[] { request.Id }, cancellationToken);

        if (location == null)
        {
            return Result<bool>.Failure("Location not found.");
        }

        var oldValues = location.Adapt<LocationManagementDto>();
        
        request.Request.Adapt(location);
        location.UpdatedAt = _dateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        await _auditService.LogActionAsync(
            userId: Guid.Empty,
            action: "UPDATE",
            entityType: "Location",
            entityId: location.Id,
            oldValues: oldValues,
            newValues: request.Request,
            cancellationToken: cancellationToken
        );

        return Result<bool>.Success(true);
    }
}
