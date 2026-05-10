using FluentAssertions;
using Starbucks.Domain.Entities;
using Starbucks.Domain.Enums;
using Starbucks.Domain.Services;
using Starbucks.Tests.Builders;
using Xunit;

namespace Starbucks.Tests.Unit.Domain.Services;

/// <summary>
/// Unit tests for OrderDomainService.
/// Tests all business logic methods for order management.
/// </summary>
public class OrderDomainServiceTests
{
    private readonly OrderDomainService _service = new();

    #region CanBeCancelled Tests

    [Fact]
    public void CanBeCancelled_WithPendingStatus_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act
        var result = _service.CanBeCancelled(order);

        // Assert
        result.Should().BeTrue("Pending orders can be cancelled");
    }

    [Fact]
    public void CanBeCancelled_WithConfirmedStatus_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Confirmed)
            .Build();

        // Act
        var result = _service.CanBeCancelled(order);

        // Assert
        result.Should().BeTrue("Confirmed orders can be cancelled");
    }

    [Theory]
    [InlineData(OrderStatus.Preparing)]
    [InlineData(OrderStatus.Ready)]
    [InlineData(OrderStatus.Completed)]
    [InlineData(OrderStatus.Cancelled)]
    public void CanBeCancelled_WithNonCancellableStatus_ReturnsFalse(OrderStatus status)
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(status)
            .Build();

        // Act
        var result = _service.CanBeCancelled(order);

        // Assert
        result.Should().BeFalse($"{status} orders cannot be cancelled");
    }

    #endregion

    #region Cancel Tests

    [Fact]
    public void Cancel_WithValidPendingOrder_CancelsSuccessfully()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act
        _service.Cancel(order, "Customer requested cancellation");

        // Assert
        order.Status.Should().Be(OrderStatus.Cancelled);
        order.CancellationReason.Should().Be("Customer requested cancellation");
        order.CancelledAt.Should().NotBeNull();
    }

    [Fact]
    public void Cancel_WithNonCancellableOrder_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Completed)
            .Build();

        // Act & Assert
        var action = () => _service.Cancel(order, "Customer requested cancellation");
        action.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Cancel_WithEmptyReason_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act & Assert
        var action = () => _service.Cancel(order, "");
        action.Should().Throw<ArgumentException>();
    }

    #endregion

    #region UpdateStatus Tests

    [Fact]
    public void UpdateStatus_WithValidTransition_UpdatesStatus()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act
        _service.UpdateStatus(order, OrderStatus.Confirmed);

        // Assert
        order.Status.Should().Be(OrderStatus.Confirmed);
    }

    [Fact]
    public void UpdateStatus_WithInvalidTransition_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Completed)
            .Build();

        // Act & Assert
        var action = () => _service.UpdateStatus(order, OrderStatus.Pending);
        action.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void UpdateStatus_UpdatesTimestamp()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();
        var originalUpdatedAt = order.UpdatedAt;
        System.Threading.Thread.Sleep(10);

        // Act
        _service.UpdateStatus(order, OrderStatus.Confirmed);

        // Assert
        order.UpdatedAt.Should().BeAfter(originalUpdatedAt.GetValueOrDefault());
    }

    #endregion

    #region CalculateTotal Tests

    [Fact]
    public void CalculateTotal_WithValidItems_CalculatesCorrectly()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithSubtotal(100m)
            .WithDeliveryFee(20m)
            .WithDiscount(0m)
            .Build();

        // Act
        var total = _service.CalculateTotal(order);

        // Assert
        // Subtotal: 100, Tax: 14 (14%), Delivery: 20, Discount: 0, Total: 134
        total.Should().Be(134m);
    }

    [Fact]
    public void CalculateTotal_WithDiscount_SubtractsDiscount()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithSubtotal(100m)
            .WithDeliveryFee(0m)
            .WithDiscount(10m)
            .Build();

        // Act
        var total = _service.CalculateTotal(order);

        // Assert
        // Subtotal: 100, Tax: 14, Discount: 10, Total: 104
        total.Should().Be(104m);
    }

    [Fact]
    public void CalculateTotal_WithNoItems_ReturnsZero()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithItems(new List<OrderItem>())
            .Build();

        // Act
        var total = _service.CalculateTotal(order);

        // Assert
        total.Should().Be(0);
    }

    #endregion

    #region ApplyDiscount Tests

    [Fact]
    public void ApplyDiscount_WithValidAmount_AppliesDiscount()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithSubtotal(100m)
            .WithDiscount(0m)
            .Build();

        // Act
        _service.ApplyDiscount(order, 20m);

        // Assert
        order.Discount.Should().Be(20m);
    }

    [Fact]
    public void ApplyDiscount_WithNegativeAmount_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder().Build();

        // Act & Assert
        var action = () => _service.ApplyDiscount(order, -10m);
        action.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void ApplyDiscount_ExceedingSubtotal_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithSubtotal(100m)
            .Build();

        // Act & Assert
        var action = () => _service.ApplyDiscount(order, 150m);
        action.Should().Throw<InvalidOperationException>();
    }

    #endregion

    #region MarkAsReady Tests

    [Fact]
    public void MarkAsReady_WithConfirmedOrder_MarksAsReady()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Confirmed)
            .Build();

        // Act
        _service.MarkAsReady(order);

        // Assert
        order.Status.Should().Be(OrderStatus.Ready);
        order.PreparedAt.Should().NotBeNull();
    }

    [Fact]
    public void MarkAsReady_WithPreparingOrder_MarksAsReady()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Preparing)
            .Build();

        // Act
        _service.MarkAsReady(order);

        // Assert
        order.Status.Should().Be(OrderStatus.Ready);
        order.PreparedAt.Should().NotBeNull();
    }

    [Fact]
    public void MarkAsReady_WithInvalidStatus_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act & Assert
        var action = () => _service.MarkAsReady(order);
        action.Should().Throw<InvalidOperationException>();
    }

    #endregion

    #region MarkAsCompleted Tests

    [Fact]
    public void MarkAsCompleted_WithReadyOrder_MarksAsCompleted()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Ready)
            .Build();

        // Act
        _service.MarkAsCompleted(order);

        // Assert
        order.Status.Should().Be(OrderStatus.Completed);
        order.CompletedAt.Should().NotBeNull();
    }

    [Fact]
    public void MarkAsCompleted_WithNonReadyOrder_ThrowsException()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act & Assert
        var action = () => _service.MarkAsCompleted(order);
        action.Should().Throw<InvalidOperationException>();
    }

    #endregion

    #region IsExpired Tests

    [Fact]
    public void IsExpired_WithReadyOrderNotExpired_ReturnsFalse()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Ready)
            .WithPreparedAt(DateTime.UtcNow.AddMinutes(-10))
            .Build();

        // Act
        var result = _service.IsExpired(order);

        // Assert
        result.Should().BeFalse("Orders prepared less than 30 minutes ago are not expired");
    }

    [Fact]
    public void IsExpired_WithReadyOrderExpired_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Ready)
            .WithPreparedAt(DateTime.UtcNow.AddMinutes(-35))
            .Build();

        // Act
        var result = _service.IsExpired(order);

        // Assert
        result.Should().BeTrue("Orders prepared more than 30 minutes ago are expired");
    }

    [Fact]
    public void IsExpired_WithNonReadyOrder_ReturnsFalse()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act
        var result = _service.IsExpired(order);

        // Assert
        result.Should().BeFalse("Non-ready orders cannot be expired");
    }

    #endregion

    #region CanBeModified Tests

    [Fact]
    public void CanBeModified_WithPendingOrder_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(OrderStatus.Pending)
            .Build();

        // Act
        var result = _service.CanBeModified(order);

        // Assert
        result.Should().BeTrue("Pending orders can be modified");
    }

    [Theory]
    [InlineData(OrderStatus.Confirmed)]
    [InlineData(OrderStatus.Preparing)]
    [InlineData(OrderStatus.Ready)]
    [InlineData(OrderStatus.Completed)]
    [InlineData(OrderStatus.Cancelled)]
    public void CanBeModified_WithNonPendingOrder_ReturnsFalse(OrderStatus status)
    {
        // Arrange
        var order = new OrderBuilder()
            .WithStatus(status)
            .Build();

        // Act
        var result = _service.CanBeModified(order);

        // Assert
        result.Should().BeFalse($"{status} orders cannot be modified");
    }

    #endregion

    #region IsValidStatusTransition Tests

    [Theory]
    [InlineData(OrderStatus.Pending, OrderStatus.Confirmed, true)]
    [InlineData(OrderStatus.Pending, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Confirmed, OrderStatus.Preparing, true)]
    [InlineData(OrderStatus.Confirmed, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Preparing, OrderStatus.Ready, true)]
    [InlineData(OrderStatus.Preparing, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Ready, OrderStatus.Completed, true)]
    [InlineData(OrderStatus.Ready, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Completed, OrderStatus.Pending, false)]
    [InlineData(OrderStatus.Cancelled, OrderStatus.Pending, false)]
    public void IsValidStatusTransition_WithVariousTransitions_ReturnsCorrectly(
        OrderStatus from, OrderStatus to, bool expected)
    {
        // Act
        var result = _service.IsValidStatusTransition(from, to);

        // Assert
        result.Should().Be(expected);
    }

    #endregion

    #region GetEstimatedPrepTime Tests

    [Fact]
    public void GetEstimatedPrepTime_WithPickupOrder_CalculatesCorrectly()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.PickUp)
            .WithItems(new List<OrderItem>
            {
                new OrderItem(),
                new OrderItem()
            })
            .Build();

        // Act
        var prepTime = _service.GetEstimatedPrepTime(order);

        // Assert
        // Base: 10, Items: 2*2=4, Delivery: 0, Total: 14
        prepTime.Should().Be(14);
    }

    [Fact]
    public void GetEstimatedPrepTime_WithDeliveryOrder_AddsDeliveryTime()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.Delivery)
            .WithItems(new List<OrderItem>
            {
                new OrderItem(),
                new OrderItem()
            })
            .Build();

        // Act
        var prepTime = _service.GetEstimatedPrepTime(order);

        // Assert
        // Base: 10, Items: 2*2=4, Delivery: 5, Total: 19
        prepTime.Should().Be(19);
    }

    [Fact]
    public void GetEstimatedPrepTime_WithNoItems_ReturnsBaseTime()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.PickUp)
            .WithItems(new List<OrderItem>())
            .Build();

        // Act
        var prepTime = _service.GetEstimatedPrepTime(order);

        // Assert
        // Base: 10, Items: 0, Delivery: 0, Total: 10
        prepTime.Should().Be(10);
    }

    #endregion

    #region IsPaymentComplete Tests

    [Fact]
    public void IsPaymentComplete_WithCompletedPayment_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithPaymentStatus(PaymentStatus.Completed)
            .Build();

        // Act
        var result = _service.IsPaymentComplete(order);

        // Assert
        result.Should().BeTrue("Orders with completed payment status are paid");
    }

    [Theory]
    [InlineData(PaymentStatus.Pending)]
    [InlineData(PaymentStatus.Processing)]
    [InlineData(PaymentStatus.Failed)]
    [InlineData(PaymentStatus.Cancelled)]
    public void IsPaymentComplete_WithNonCompletedPayment_ReturnsFalse(PaymentStatus status)
    {
        // Arrange
        var order = new OrderBuilder()
            .WithPaymentStatus(status)
            .Build();

        // Act
        var result = _service.IsPaymentComplete(order);

        // Assert
        result.Should().BeFalse($"Orders with {status} payment status are not paid");
    }

    #endregion

    #region IsDeliveryOrder Tests

    [Fact]
    public void IsDeliveryOrder_WithDeliveryType_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.Delivery)
            .Build();

        // Act
        var result = _service.IsDeliveryOrder(order);

        // Assert
        result.Should().BeTrue("Delivery type orders are delivery orders");
    }

    [Fact]
    public void IsDeliveryOrder_WithPickupType_ReturnsFalse()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.PickUp)
            .Build();

        // Act
        var result = _service.IsDeliveryOrder(order);

        // Assert
        result.Should().BeFalse("Pickup type orders are not delivery orders");
    }

    #endregion

    #region IsPickupOrder Tests

    [Fact]
    public void IsPickupOrder_WithPickupType_ReturnsTrue()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.PickUp)
            .Build();

        // Act
        var result = _service.IsPickupOrder(order);

        // Assert
        result.Should().BeTrue("Pickup type orders are pickup orders");
    }

    [Fact]
    public void IsPickupOrder_WithDeliveryType_ReturnsFalse()
    {
        // Arrange
        var order = new OrderBuilder()
            .WithType(OrderType.Delivery)
            .Build();

        // Act
        var result = _service.IsPickupOrder(order);

        // Assert
        result.Should().BeFalse("Delivery type orders are not pickup orders");
    }

    #endregion
}
