namespace Starbucks.Application.Features.Resources.Queries;

using MediatR;
using Starbucks.Application.Common.Models;

/// <summary>
/// Get localization resources only
/// 
/// Returns all UI text, labels, messages organized by module
/// 
/// Cache key: resources:localization:{language}:{module}:{client}
/// </summary>
public record GetLocalizationQuery(
    string Language = "en",
    string? Module = null,
    string Client = "frontend"
) : IRequest<Result<Dictionary<string, Dictionary<string, object>>>>;
