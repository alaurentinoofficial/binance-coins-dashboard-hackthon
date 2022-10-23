using Microsoft.AspNetCore.Mvc;

namespace crypto_notify_api.notifications.controllers;

public class notifications : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}