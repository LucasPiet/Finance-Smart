using Microsoft.Data.SqlClient;

namespace FinanceSmart.Tests.Tests;

[TestFixture]
[Category("Database")]
public class DatabaseTests
{
    private SqlConnection _conn = null!;

    [SetUp]
    public async Task Setup()
    {
        _conn = new SqlConnection(TestConfig.DbConnection);
        await _conn.OpenAsync();
    }

    [TearDown]
    public async Task Teardown() => await _conn.DisposeAsync();

    [Test]
    public void Connection_ShouldBeOpen()
    {
        Assert.That(_conn.State, Is.EqualTo(System.Data.ConnectionState.Open));
    }

    [Test]
    public async Task Database_FinanceSmart_ShouldExist()
    {
        await using var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM sys.databases WHERE name = 'FINANCE_SMART'", _conn);
        var count = (int)(await cmd.ExecuteScalarAsync())!;
        Assert.That(count, Is.EqualTo(1));
    }

    [Test]
    public async Task Database_ShouldHaveTables()
    {
        await using var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'", _conn);
        var count = (int)(await cmd.ExecuteScalarAsync())!;
        Assert.That(count, Is.GreaterThan(0));
    }

    [Test]
    public async Task Trigger_GerenciaSaldo_ShouldExist()
    {
        await using var cmd = new SqlCommand(
            "SELECT COUNT(*) FROM sys.triggers WHERE name LIKE '%SALDO%'", _conn);
        var count = (int)(await cmd.ExecuteScalarAsync())!;
        Assert.That(count, Is.GreaterThan(0));
    }
}