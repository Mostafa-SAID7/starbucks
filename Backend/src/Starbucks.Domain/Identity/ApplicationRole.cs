using Microsoft.AspNetCore.Identity;

namespace Starbucks.Domain.Identity;

/// <summary>
/// Extended IdentityRole with custom properties for role management.
/// Provides hierarchical role system with descriptions.
/// </summary>
public class ApplicationRole : IdentityRole<Guid>
{
    /// <summary>
    /// Default constructor
    /// </summary>
    public ApplicationRole() : base()
    {
    }
    
    /// <summary>
    /// Constructor with role name
    /// </summary>
    /// <param name="roleName">Name of the role</param>
    public ApplicationRole(string roleName) : base(roleName)
    {
    }
    
    /// <summary>
    /// Description of what this role represents
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// Priority/hierarchy level (higher = more permissions)
    /// Customer = 0, Employee = 1, Manager = 2, Admin = 3, SuperAdmin = 4
    /// </summary>
    public int Priority { get; set; }
    
    /// <summary>
    /// Whether this role is a system role (cannot be deleted)
    /// </summary>
    public bool IsSystemRole { get; set; } = false;
    
    /// <summary>
    /// Audit: Who created this role
    /// </summary>
    public string? CreatedBy { get; set; }
    
    /// <summary>
    /// Audit: When this role was created
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Audit: Who last updated this role
    /// </summary>
    public string? UpdatedBy { get; set; }
    
    /// <summary>
    /// Audit: When this role was last updated
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
}
