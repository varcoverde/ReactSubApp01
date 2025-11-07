using LeadApi.Data;
using LeadApi.Dtos;
using LeadApi.Extensions;
using LeadApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// var databasePath = Path.Combine(AppContext.BaseDirectory, "leads.db");
var databasePath = "C:\\Projetos\\neo\\repos\\ReactSubApp01\\backend\\LeadApi\\leads.db";
builder.Services.AddDbContext<LeadContext>(options =>
    options.UseSqlite($"Data Source={databasePath}"));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LeadContext>();
    context.Database.EnsureCreated();
    SeedData.Initialize(context);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var leads = app.MapGroup("/leads").WithTags("Leads");

leads.MapGet("/", async ([AsParameters] LeadFilterQuery filtro, LeadContext context) =>
    Results.Ok(await context.Leads
        .AsNoTracking()
        .ApplyFilter(filtro)
        .OrderByDescending(lead => lead.CriadoEm)
        .Select(lead => lead.ToSummaryDto())
        .ToListAsync()));

leads.MapGet("/{id:guid}", async (Guid id, LeadContext context) =>
{
    var lead = await context.Leads
        .Include(l => l.Comentarios)
        .Include(l => l.Historico)
        .AsNoTracking()
        .FirstOrDefaultAsync(l => l.Id == id);

    return lead is null
        ? Results.NotFound()
        : Results.Ok(lead.ToDetailDto());
});

leads.MapPatch("/{id:guid}", async (Guid id, LeadUpdateRequest payload, LeadContext context) =>
{
    var lead = await context.Leads
        .Include(l => l.Comentarios)
        .Include(l => l.Historico)
        .FirstOrDefaultAsync(l => l.Id == id);

    if (lead is null)
    {
        return Results.NotFound();
    }

    var statusAlterado = false;

    if (payload.Status is not null)
    {
        if (!LeadQueryableExtensions.IsValidStatus(payload.Status))
        {
            return Results.BadRequest(new ProblemDetails
            {
                Title = "Status inválido",
                Detail = "Informe um status válido: novo, em_andamento, convertido ou perdido."
            });
        }

        if (!string.Equals(lead.Status, payload.Status, StringComparison.Ordinal))
        {
            lead.Status = payload.Status;
            statusAlterado = true;
        }
    }

    if (payload.ObservacoesInternas is not null)
    {
        lead.ObservacoesInternas = payload.ObservacoesInternas;
    }

    if (statusAlterado)
    {
        lead.Historico.Add(new LeadTimelineEntry
        {
            Id = Guid.NewGuid(),
            LeadId = lead.Id,
            Descricao = $"Status atualizado para '{lead.Status}'.",
            CriadoEm = DateTimeOffset.UtcNow,
            CriadoPor = "Sistema"
        });
    }

    await context.SaveChangesAsync();
    await context.Entry(lead).Collection(l => l.Comentarios).LoadAsync();
    await context.Entry(lead).Collection(l => l.Historico).LoadAsync();

    return Results.Ok(lead.ToDetailDto());
});

leads.MapPost("/{id:guid}/comentarios", async (Guid id, CommentRequest payload, LeadContext context) =>
{
    if (string.IsNullOrWhiteSpace(payload.Conteudo))
    {
        return Results.BadRequest(new ProblemDetails
        {
            Title = "Comentário inválido",
            Detail = "O campo conteudo é obrigatório."
        });
    }

    var lead = await context.Leads
        .Include(l => l.Comentarios)
        .Include(l => l.Historico)
        .FirstOrDefaultAsync(l => l.Id == id);

    if (lead is null)
    {
        return Results.NotFound();
    }

    var comentario = new LeadComment
    {
        Id = Guid.NewGuid(),
        LeadId = lead.Id,
        Autor = "Equipe Comercial",
        Conteudo = payload.Conteudo.Trim(),
        CriadoEm = DateTimeOffset.UtcNow
    };

    lead.Comentarios.Add(comentario);
    lead.Historico.Add(new LeadTimelineEntry
    {
        Id = Guid.NewGuid(),
        LeadId = lead.Id,
        Descricao = "Novo comentário adicionado.",
        CriadoEm = comentario.CriadoEm,
        CriadoPor = comentario.Autor
    });

    await context.SaveChangesAsync();
    await context.Entry(lead).Collection(l => l.Comentarios).LoadAsync();
    await context.Entry(lead).Collection(l => l.Historico).LoadAsync();

    return Results.Ok(lead.ToDetailDto());
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();
