using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;

namespace Starbucks.Tests.Builders;

/// <summary>
/// Builder for creating test Order entities with fluent API.
/// </summary>
public class OrderBuilder
{
    private Guid _userId = Guid.NewGuid();
    private Guid? _locationId = Guid.NewGuid();
    private string _orderNumber = $"ORD-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
    private List<OrderItem> _items = new List<OrderItem>();
    private OrderStatus _status = OrderStatus.Pending;
    private OrderType _type = OrderType.PickUp;
    private decimal _subtotal = 100m;
    private decimal _tax = 10m;
    private decimal _deliveryFee = 5m;
    private decimal _discount = 0m;
    private decimal _total = 115m;
    private PaymentMethod _paymentMethod = PaymentMethod.CreditCard;
    private PaymentStatus _paymentStatus = PaymentStatus.Pending;
    private string? _paymentTransactionId = null;
    private DateTime? _scheduledFor = null;
    private DateTime? _preparedAt = null;
    private DateTime? _completedAt = null;
    private DateTime? _cancelledAt = null;
    private string? _notes = null;
    private string? _cancellationReason = null;
    private string? _deliveryAddress = null;
    private string? _deliveryPhoneNumber = null;
    private double? _deliveryLatitude = null;
    private double? _deliveryLongitude = null;
    private int _pointsEarned = 0;
    private int _pointsRedeemed = 0;
    private bool _isDeleted = false;
    private DateTime _createdAt = DateTime.UtcNow;

    public OrderBuilder WithUserId(Guid userId)
    {
        _userId = userId;
        return this;
    }

    public OrderBuilder WithLocationId(Guid? locationId)
    {
        _locationId = locationId;
        return this;
    }

    public OrderBuilder WithOrderNumber(string orderNumber)
    {
        _orderNumber = orderNumber;
        return this;
    }

    public OrderBuilder WithStatus(OrderStatus status)
    {
        _status = status;
        return this;
    }

    public OrderBuilder WithType(OrderType type)
    {
        _type = type;
        return this;
    }

    public OrderBuilder WithSubtotal(decimal subtotal)
    {
        _subtotal = subtotal;
        RecalculateTotal();
        return this;
    }

    public OrderBuilder WithTax(decimal tax)
    {
        _tax = tax;
        RecalculateTotal();
        return this;
    }

    public OrderBuilder WithDeliveryFee(decimal deliveryFee)
    {
        _deliveryFee = deliveryFee;
        RecalculateTotal();
        return this;
    }

    public OrderBuilder WithDiscount(decimal discount)
    {
        _discount = discount;
        RecalculateTotal();
        return this;
    }

    public OrderBuilder WithTotal(decimal total)
    {
        _total = total;
        return this;
    }

    public OrderBuilder WithPaymentMethod(PaymentMethod paymentMethod)
    {
        _paymentMethod = paymentMethod;
        return this;
    }

    public OrderBuilder WithPaymentStatus(PaymentStatus paymentStatus)
    {
        _paymentStatus = paymentStatus;
        return this;
    }

    public OrderBuilder WithPaymentTransactionId(string transactionId)
    {
        _paymentTransactionId = transactionId;
        return this;
    }

    public OrderBuilder WithScheduledFor(DateTime scheduledFor)
    {
        _scheduledFor = scheduledFor;
        return this;
    }

    public OrderBuilder WithCompletedAt(DateTime completedAt)
    {
        _completedAt = completedAt;
        return this;
    }

    public OrderBuilder WithCancelledAt(DateTime cancelledAt)
    {
        _cancelledAt = cancelledAt;
        return this;
    }

    public OrderBuilder WithNotes(string notes)
    {
        _notes = notes;
        return this;
    }

    public OrderBuilder WithCancellationReason(string reason)
    {
        _cancellationReason = reason;
        return this;
    }

    public OrderBuilder WithDeliveryAddress(string address)
    {
        _deliveryAddress = address;
        return this;
    }

    public OrderBuilder WithDeliveryPhoneNumber(string phoneNumber)
    {
        _deliveryPhoneNumber = phoneNumber;
        return this;
    }

    public OrderBuilder WithDeliveryCoordinates(double latitude, double longitude)
    {
        _deliveryLatitude = latitude;
        _deliveryLongitude = longitude;
        return this;
    }

    public OrderBuilder WithPointsEarned(int points)
    {
        _pointsEarned = points;
        return this;
    }

    public OrderBuilder WithPointsRedeemed(int points)
    {
        _pointsRedeemed = points;
        return this;
    }

    public OrderBuilder AsDeleted()
    {
        _isDeleted = true;
        return this;
    }

    public OrderBuilder WithCreatedAt(DateTime createdAt)
    {
        _createdAt = createdAt;
        return this;
    }

    public OrderBuilder WithItems(List<OrderItem> items)
    {
        _items = items;
        return this;
    }

    public OrderBuilder WithPreparedAt(DateTime? preparedAt)
    {
        _preparedAt = preparedAt;
        return this;
    }

    private void RecalculateTotal()
    {
        _total = _subtotal + _tax + _deliveryFee - _discount;
    }

    public Order Build()
    {
        var order = new Order
        {
            UserId = _userId,
            LocationId = _locationId,
            OrderNumber = _orderNumber,
            Status = _status,
            Type = _type,
            Subtotal = _subtotal,
            Tax = _tax,
            DeliveryFee = _deliveryFee,
            Discount = _discount,
            Total = _total,
            PaymentMethod = _paymentMethod,
            PaymentStatus = _paymentStatus,
            PaymentTransactionId = _paymentTransactionId,
            ScheduledFor = _scheduledFor,
            PreparedAt = _preparedAt,
            CompletedAt = _completedAt,
            CancelledAt = _cancelledAt,
            Notes = _notes,
            CancellationReason = _cancellationReason,
            DeliveryAddress = _deliveryAddress,
            DeliveryPhoneNumber = _deliveryPhoneNumber,
            DeliveryLatitude = _deliveryLatitude,
            DeliveryLongitude = _deliveryLongitude,
            PointsEarned = _pointsEarned,
            PointsRedeemed = _pointsRedeemed,
            IsDeleted = _isDeleted,
            CreatedAt = _createdAt,
            Items = _items
        };

        return order;
    }
}
