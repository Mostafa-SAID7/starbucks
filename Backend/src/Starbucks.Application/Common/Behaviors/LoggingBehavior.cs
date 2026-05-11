using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Starbucks.Application.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<TRequest> _logger;

    public LoggingBehavior(ILogger<TRequest> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var sw = Stopwatch.StartNew();

        _logger.LogInformation("Starbucks Request: {Name} {@Request}",
            requestName, request);

        try
        {
            var response = await next();
            sw.Stop();

            if (sw.ElapsedMilliseconds > 500)
            {
                _logger.LogWarning("Starbucks Performance Warning: {Name} was slow ({ElapsedMilliseconds}ms)",
                    requestName, sw.ElapsedMilliseconds);
            }
            else
            {
                _logger.LogInformation("Starbucks Response: {Name} handled in {ElapsedMilliseconds}ms",
                    requestName, sw.ElapsedMilliseconds);
            }

            return response;
        }
        catch (Exception ex)
        {
            sw.Stop();
            _logger.LogError(ex, "Starbucks Request: Unhandled Exception for {Name} {@Request} after {ElapsedMilliseconds}ms",
                requestName, request, sw.ElapsedMilliseconds);
            throw;
        }
    }
}
