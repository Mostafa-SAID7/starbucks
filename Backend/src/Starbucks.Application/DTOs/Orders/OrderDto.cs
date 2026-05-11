using Starbucks.Domain.Enums;

namespace Starbucks.Application.DTOs.Orders;

public class OrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public OrderType Type { get; set; }
    public decimal Total { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Discount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public string? Notes { get; set; }
    public string? DeliveryAddress { get; set; }
}

public class OrderItemDto
{
    public Guid MenuItemId { get; set; }
    public Guid? VariantId { get; set; }
    public string MenuItemName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? SpecialInstructions { get; set; }
    public string? Customizations { get; set; }
}

public class CreateOrderRequestDto
{
    public OrderType Type { get; set; } = OrderType.PickUp;
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CreditCard;
    public Guid? LocationId { get; set; }
    public string? Notes { get; set; }
    public string? DeliveryAddress { get; set; }
    public string? DeliveryPhoneNumber { get; set; }
    public List<CreateOrderItemRequestDto> Items { get; set; } = new();
}

public class CreateOrderItemRequestDto
{
    public Guid MenuItemId { get; set; }
    public Guid? VariantId { get; set; }
    public int Quantity { get; set; }
    public string? SpecialInstructions { get; set; }
    public string? Customizations { get; set; }
}
