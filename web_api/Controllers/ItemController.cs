using System;
using mf_apis_web_services_fuel_manager.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize] // Requer autenticação para acessar alguns endpoints
// Define o controller e a rota base "api/item"
[ApiController]
[Route("api/[controller]")]
public class ItemController : ControllerBase
{
    // Acesso ao banco de dados
    private readonly AppDbContext _context;

    // Construtor para injeção de dependência do AppDbContext
    public ItemController(AppDbContext context)
    {
        _context = context;
    }

    // All Endpoints
    [AllowAnonymous]
    [HttpGet("item")] // Define a rota para o endpoint de listagem de items
    public async Task<ActionResult> GetAll()
    {
        var model = await _context.Items.ToListAsync();
        return Ok(model);
    }

    // Admin Endpoints
    [Authorize(Roles = "Admin")]
    [HttpPost("item")] // Define a rota para o endpoint de criação de item
    public async Task<ActionResult> Create(Item model)
    {
        _context.Items.Add(model);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")] // Define a rota para o endpoint de atualização de item
    public async Task<ActionResult> Update(int id , Item model)
    {
        if (id != model.Id) return BadRequest();

        var modelodb = await _context.Items.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        if (modelodb == null) return NotFound();

        _context.Items.Update(model);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")] // Define a rota para o endpoint de exclusão de item
    public async Task<ActionResult> Delete(int id)
    {
        var model = await _context.Items.FindAsync(id);

        if (model == null) return NotFound();

        _context.Items.Remove(model);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
