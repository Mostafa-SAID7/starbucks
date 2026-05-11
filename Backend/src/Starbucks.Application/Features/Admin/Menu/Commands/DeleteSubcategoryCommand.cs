using MediatR;
using Microsoft.EntityFrameworkCore;
using Starbucks.Application.Common.Interfaces.Data;
using Starbucks.Application.Common.Models;

namespace Starbucks.Application.Features.Admin.Menu.Commands;

public record DeleteSubcategoryCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteSubcategoryCommandHandler : IRequestHandler<DeleteSubcategoryCommand, Result<bool>>
{
    private readonly IApplicationDbContext _context;

    public DeleteSubcategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(DeleteSubcategoryCommand request, CancellationToken cancellationToken)
    {
        var subcategory = await _context.MenuSubcategories
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (subcategory == null) return Result<bool>.Failure("Subcategory not found.");

        if (subcategory.Items.Any())
        {
            return Result<bool>.Failure("Cannot delete subcategory with items. Delete or move items first.");
        }

        _context.MenuSubcategories.Remove(subcategory);
        await _context.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
