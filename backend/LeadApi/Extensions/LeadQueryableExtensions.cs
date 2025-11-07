using System.Globalization;
using System.Linq;
using LeadApi.Dtos;
using LeadApi.Models;

namespace LeadApi.Extensions;

public static class LeadQueryableExtensions
{
    private static readonly string[] AllowedStatuses =
    {
        "novo",
        "em_andamento",
        "convertido",
        "perdido"
    };

    public static IQueryable<Lead> ApplyFilter(this IQueryable<Lead> query, LeadFilterQuery filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Busca))
        {
            var busca = filter.Busca.Trim();
            query = query.Where(lead =>
                lead.Nome.Contains(busca, StringComparison.OrdinalIgnoreCase) ||
                lead.Empresa.Contains(busca, StringComparison.OrdinalIgnoreCase) ||
                lead.Email.Contains(busca, StringComparison.OrdinalIgnoreCase) ||
                lead.Telefone.Contains(busca, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(filter.Status) && !string.Equals(filter.Status, "todos", StringComparison.OrdinalIgnoreCase))
        {
            if (AllowedStatuses.Contains(filter.Status))
            {
                query = query.Where(lead => lead.Status == filter.Status);
            }
        }

        if (!string.IsNullOrWhiteSpace(filter.Origem))
        {
            query = query.Where(lead => lead.Origem.Equals(filter.Origem, StringComparison.OrdinalIgnoreCase));
        }

        var dataInicial = ParseDate(filter.DataInicial);
        if (dataInicial is not null)
        {
            query = query.Where(lead => lead.CriadoEm >= dataInicial.Value);
        }

        var dataFinal = ParseDate(filter.DataFinal);
        if (dataFinal is not null)
        {
            query = query.Where(lead => lead.CriadoEm <= dataFinal.Value);
        }

        return query;
    }

    public static bool IsValidStatus(string? status) =>
        !string.IsNullOrWhiteSpace(status) && AllowedStatuses.Contains(status);

    private static DateTimeOffset? ParseDate(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        if (DateTimeOffset.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.AssumeUniversal, out var parsed))
        {
            return parsed;
        }

        return null;
    }
}
