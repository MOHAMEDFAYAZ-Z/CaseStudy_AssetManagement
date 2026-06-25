using System.ComponentModel.DataAnnotations;

namespace AssetManagement.Core.Models
{
    public class Notification
    {
        [Key]
        public int NotificationId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}