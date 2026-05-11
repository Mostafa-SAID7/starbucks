using Starbucks.Application.DTOs.Menu;

namespace Starbucks.Application.DTOs.Cart;

public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid MenuItemId { get; set; }
    public Guid? MenuItemVariantId { get; set; }
    public int Quantity { get; set; }
    public string? SelectedModifiersJson { get; set; }
    public MenuItemDto MenuItem { get; set; } = null!;
    public MenuItemVariantDto? Variant { get; set; }
}
