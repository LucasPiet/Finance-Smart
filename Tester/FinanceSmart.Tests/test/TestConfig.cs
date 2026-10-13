namespace FinanceSmart.Tests;

public static class TestConfig
{
    public static string FrontUrl   => Env("FRONT_URL", "http://localhost:5173");
    public static string AuthUrl    => Env("AUTH_URL", "http://localhost:8001");
    public static string MailpitUrl => Env("MAILPIT_URL", "http://localhost:8025");

    // Porta 1434 = mapeamento do docker-compose (1434:1433)
    public static string DbConnection => Env("DB_CONNECTION",
        "Server=localhost,1434;Database=FINANCE_SMART;User Id=sa;Password=Smart123;" +
        "TrustServerCertificate=True;Connect Timeout=10");

    private static string Env(string key, string fallback) =>
        Environment.GetEnvironmentVariable(key) ?? fallback;
}