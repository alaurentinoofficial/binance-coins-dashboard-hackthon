using System.Collections.Concurrent;
using System.Text.Json;
using crypto_notify_api.notifications.stream;
using Microsoft.AspNetCore.Mvc;

namespace crypto_notify_api.notifications.controllers;

[ApiController]
[Route("[controller]")]
public class NotificationController : Controller
{
    private static List<Notification> _notifications = new List<Notification>();
    private static ConcurrentBag<StreamWriter> _clients = new ConcurrentBag<StreamWriter>();
    
    [HttpGet(Name = nameof(MonitorNotificationForAUser))]
    public IActionResult MonitorNotificationForAUser()
    {
        return new StreamResult(
            (stream, cancelToken) => {
                var wait = cancelToken.WaitHandle;
                var client = new StreamWriter(stream);
                _clients.Add(client);

                wait.WaitOne();

                StreamWriter ignore;
                _clients.TryTake(out ignore);
            }, 
            HttpContext.RequestAborted);
    }
    
    private async Task WriteOnStream(Notification data, string action)
    {
        foreach (var client in _clients)
        {
            string jsonData = string.Format("{0}\n", JsonSerializer.Serialize(new { data, action }));
            await client.WriteAsync(jsonData);
            await client.FlushAsync();
        }
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<Notification>> Put(long id, [FromBody] Notification value)
    {
        var item = _notifications.SingleOrDefault(i => i.Id == id);
        _notifications.Add(value);
        if(item != null)
        {
            _notifications.Remove(item);
            value.Id = id;
            _notifications.Add(value);

            await WriteOnStream(value, "Item updated");

            return item;
        }
        _notifications.Add(value);
        return item;
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(long id)
    {
        var item = _notifications.SingleOrDefault(i => i.Id == id);
        if(item != null)
        {
            _notifications.Remove(item);
            await WriteOnStream(item, "Item removed");
            return Ok(new { Description = "Item removed" });
        }

        return BadRequest();
    }
    
    [HttpPost("AddNotification")]
    public async Task<ActionResult<Notification>> Post([FromBody] Notification value)
    {
        if(value == null)
            return BadRequest();

        if(value.Id == 0)
        {
            var max = _notifications.Max(i => i.Id);
            value.Id = max+1;
        }

        _notifications.Add(value);

        await WriteOnStream(value, "Item added");

        return value;
    }
    
}

public class Notification
{
    public long Id { get; set; }
    public string Name { get; set; }
    public bool IsComplete { get; set; }

    public override string ToString() => $"{Id} - {Name} - {IsComplete}";

}