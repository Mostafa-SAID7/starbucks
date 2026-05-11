using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Mapster;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

public record UpdateCategoryCommand(Guid Id, UpdateCategoryRequestDto Request) : IRequest<Result<CategoryManagementDto>>;

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<CategoryManagementDto>>
{
    private readonly IApplicationDbContext _context;

    public UpdateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<CategoryManagementDto>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _context.MenuCategories
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (category == null) return Result<CategoryManagementDto>.Failure("Category not found.");

        if (request.Request.NameEn != null) category.Name.En = request.Request.NameEn;
        if (request.Request.NameAr != null) category.Name.Ar = request.Request.NameAr;
        if (request.Request.DescriptionEn != null) category.Description.En = request.Request.DescriptionEn;
        if (request.Request.DescriptionAr != null) category.Description.Ar = request.Request.DescriptionAr;
        if (request.Request.Image != null) category.ImageUrl = request.Request.Image;
        if (request.Request.DisplayOrder.HasValue) category.SortOrder = request.Request.DisplayOrder.Value;
        if (request.Request.IsActive.HasValue) category.IsActive = request.Request.IsActive.Value;

        await _context.SaveChangesAsync(cancellationToken);
        return Result<CategoryManagementDto>.Success(category.Adapt<CategoryManagementDto>());
    }
}
