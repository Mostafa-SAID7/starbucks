using MediatR;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;
using Starbucks.Application.DTOs.Admin;
using Starbucks.Domain.Entities;
using Mapster;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

public record CreateSubcategoryCommand(CreateSubcategoryRequestDto Request) : IRequest<Result<SubcategoryManagementDto>>;

public class CreateSubcategoryCommandHandler : IRequestHandler<CreateSubcategoryCommand, Result<SubcategoryManagementDto>>
{
    private readonly IApplicationDbContext _context;

    public CreateSubcategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<SubcategoryManagementDto>> Handle(CreateSubcategoryCommand request, CancellationToken cancellationToken)
    {
        var subcategory = new MenuSubcategory
        {
            Id = Guid.NewGuid(),
            CategoryId = request.Request.CategoryId,
            Name = new() { En = request.Request.NameEn, Ar = request.Request.NameAr },
            ImageUrl = request.Request.Image,
            SortOrder = request.Request.DisplayOrder,
            IsActive = true
        };

        _context.MenuSubcategories.Add(subcategory);
        await _context.SaveChangesAsync(cancellationToken);

        return Result<SubcategoryManagementDto>.Success(subcategory.Adapt<SubcategoryManagementDto>());
    }
}
