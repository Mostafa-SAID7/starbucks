using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

public record UpdateSubcategoryCommand(Guid Id, UpdateSubcategoryRequestDto Request) : IRequest<Result<SubcategoryManagementDto>>;

public class UpdateSubcategoryCommandHandler : IRequestHandler<UpdateSubcategoryCommand, Result<SubcategoryManagementDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateSubcategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<SubcategoryManagementDto>> Handle(UpdateSubcategoryCommand request, CancellationToken cancellationToken)
    {
        var subcategory = await _context.MenuSubcategories
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (subcategory == null) return Result<SubcategoryManagementDto>.Failure("Subcategory not found.");

        if (request.Request.CategoryId.HasValue) subcategory.CategoryId = request.Request.CategoryId.Value;
        if (request.Request.NameEn != null) subcategory.Name.En = request.Request.NameEn;
        if (request.Request.NameAr != null) subcategory.Name.Ar = request.Request.NameAr;
        if (request.Request.Image != null) subcategory.ImageUrl = request.Request.Image;
        if (request.Request.DisplayOrder.HasValue) subcategory.SortOrder = request.Request.DisplayOrder.Value;
        if (request.Request.IsActive.HasValue) subcategory.IsActive = request.Request.IsActive.Value;

        await _context.SaveChangesAsync(cancellationToken);
        return Result<SubcategoryManagementDto>.Success(subcategory.Adapt<SubcategoryManagementDto>());
    }
}
