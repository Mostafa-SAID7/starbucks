using System.Linq.Expressions;
using Starbucks.Domain.Common;

namespace Starbucks.Application.Common.Specifications;

/// <summary>
/// Specification pattern interface for encapsulating query logic
/// Allows complex queries to be defined in a reusable, testable way
/// </summary>
public interface ISpecification<T> where T : class
{
    /// <summary>
    /// The base query criteria
    /// </summary>
    Expression<Func<T, bool>>? Criteria { get; }

    /// <summary>
    /// Include expressions for eager loading related entities
    /// </summary>
    List<Expression<Func<T, object>>> Includes { get; }

    /// <summary>
    /// String-based include paths for complex navigation
    /// </summary>
    List<string> IncludeStrings { get; }

    /// <summary>
    /// Order by expression
    /// </summary>
    Expression<Func<T, object>>? OrderBy { get; }

    /// <summary>
    /// Order by descending expression
    /// </summary>
    Expression<Func<T, object>>? OrderByDescending { get; }

    /// <summary>
    /// Indicates if pagination should be applied
    /// </summary>
    bool IsPagingEnabled { get; }

    /// <summary>
    /// Number of items to skip
    /// </summary>
    int Take { get; }

    /// <summary>
    /// Number of items to take
    /// </summary>
    int Skip { get; }

    /// <summary>
    /// Indicates if the total count should be calculated
    /// </summary>
    bool IsTotalCountEnabled { get; }
}

/// <summary>
/// Base specification class for implementing common query patterns
/// </summary>
public abstract class BaseSpecification<T> : ISpecification<T> where T : class
{
    public Expression<Func<T, bool>>? Criteria { get; protected set; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();
    public List<string> IncludeStrings { get; } = new();
    public Expression<Func<T, object>>? OrderBy { get; protected set; }
    public Expression<Func<T, object>>? OrderByDescending { get; protected set; }
    public int Take { get; private set; }
    public int Skip { get; private set; }
    public bool IsPagingEnabled { get; private set; }
    public bool IsTotalCountEnabled { get; private set; }

    protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
    {
        Includes.Add(includeExpression);
    }

    protected virtual void AddInclude(string includeString)
    {
        IncludeStrings.Add(includeString);
    }

    protected virtual void ApplyPaging(int skip, int take)
    {
        Skip = skip;
        Take = take;
        IsPagingEnabled = true;
    }

    protected virtual void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
    {
        OrderBy = orderByExpression;
    }

    protected virtual void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
    {
        OrderByDescending = orderByDescendingExpression;
    }

    protected virtual void ApplyTotalCount()
    {
        IsTotalCountEnabled = true;
    }
}
