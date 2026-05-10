using Microsoft.AspNetCore.Mvc;
using Starbucks.Application.Common.Models;

namespace Starbucks.API.Extensions;

/// <summary>
/// Extension methods for handling API responses consistently across controllers
/// Reduces duplication of error handling and response formatting
/// </summary>
public static class ResponseExtensions
{
    /// <summary>
    /// Converts a Result to an IActionResult with appropriate HTTP status code
    /// </summary>
    public static IActionResult ToActionResult<T>(this Result<T> result, ControllerBase controller)
    {
        if (result.IsSuccess)
        {
            return controller.Ok(result.Data);
        }

        return controller.BadRequest(new { errors = result.Errors });
    }

    /// <summary>
    /// Converts a Result to an IActionResult with NotFound for failures
    /// </summary>
    public static IActionResult ToNotFoundActionResult<T>(this Result<T> result, ControllerBase controller)
    {
        if (result.IsSuccess)
        {
            return controller.Ok(result.Data);
        }

        return controller.NotFound(new { message = result.Errors.FirstOrDefault() });
    }

    /// <summary>
    /// Converts a Result to an IActionResult with CreatedAtAction response
    /// </summary>
    public static IActionResult ToCreatedAtActionResult<T>(this Result<T> result, ControllerBase controller, string actionName, object? routeValues, T? data)
    {
        if (result.IsSuccess)
        {
            return controller.CreatedAtAction(actionName, routeValues, data ?? result.Data);
        }

        return controller.BadRequest(new { errors = result.Errors });
    }

    /// <summary>
    /// Converts a Result to an IActionResult with NoContent response
    /// </summary>
    public static IActionResult ToNoContentActionResult<T>(this Result<T> result, ControllerBase controller)
    {
        if (result.IsSuccess)
        {
            return controller.NoContent();
        }

        return controller.NotFound(new { message = result.Errors.FirstOrDefault() });
    }

    /// <summary>
    /// Converts a Result to an IActionResult with custom error handler
    /// </summary>
    public static IActionResult ToActionResultWithErrorHandler<T>(this Result<T> result, ControllerBase controller, Func<string[], IActionResult> errorHandler)
    {
        if (result.IsSuccess)
        {
            return controller.Ok(result.Data);
        }

        return errorHandler(result.Errors);
    }

    /// <summary>
    /// Converts a PagedResult to an IActionResult
    /// </summary>
    public static IActionResult ToActionResult<T>(this Result<PagedResult<T>> result, ControllerBase controller)
    {
        if (result.IsSuccess)
        {
            return controller.Ok(result.Data);
        }

        return controller.BadRequest(new { errors = result.Errors });
    }
}
