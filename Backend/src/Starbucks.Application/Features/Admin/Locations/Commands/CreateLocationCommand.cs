using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Interfaces.Services;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Mapster;

namespace Starbucks.Application.Features.Admin.Locations.Commands;

public record CreateLocationCommand(CreateLocationDto Request) : IRequest<Result<Guid>>;

public class CreateLocationCommandHandler : IRequestHandler<CreateLocationCommand, Result<Guid>>
{
    private readonly IApplicationDbContext _context;
    private readonly IDateTimeService _dateTime;
    private readonly IAuditService _auditService;

    public CreateLocationCommandHandler(
        IApplicationDbContext context,
        IDateTimeService dateTime,
        IAuditService auditService)
    {
        _context = context;
        _dateTime = dateTime;
        _auditService = auditService;
    }

    public async Task<Result<Guid>> Handle(CreateLocationCommand request, CancellationToken cancellationToken)
    {
        var location = request.Request.Adapt<Location>();
        location.Id = Guid.NewGuid();
        location.CreatedAt = _dateTime.UtcNow;
        location.Country = "Egypt"; // Hardcoded for this project

        _context.Locations.Add(location);
        await _context.SaveChangesAsync(cancellationToken);

        await _auditService.LogActionAsync(
            userId: Guid.Empty, // System or Admin ID
            action: "CREATE",
            entityType: "Location",
            entityId: location.Id,
            newValues: request.Request,
            cancellationToken: cancellationToken
        );

        return Result<Guid>.Success(location.Id);
    }
}
