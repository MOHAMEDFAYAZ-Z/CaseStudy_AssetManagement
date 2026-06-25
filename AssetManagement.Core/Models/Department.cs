using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}