namespace LeadApi.Models;

public class LeadComment
{
    public Guid Id { get; set; }
    public Guid LeadId { get; set; }
    public string Autor { get; set; } = string.Empty;
    public string Conteudo { get; set; } = string.Empty;
    public DateTimeOffset CriadoEm { get; set; }
}
