using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;

namespace FinanceSmart.Tests.Tests;

[TestFixture]
[Category("Email")]
public class ForgotPasswordTests : PageTest
{
    // TODO: use um e-mail de usuário que EXISTA no sistema (cadastre antes pela tela ou API)
    private const string UserEmail = "usuario.teste@financesmart.local";

    private IAPIRequestContext _mailpit = null!;

    [SetUp]
    public async Task Setup()
    {
        _mailpit = await Playwright.APIRequest.NewContextAsync(new() { BaseURL = TestConfig.MailpitUrl });
        await _mailpit.DeleteAsync("/api/v1/messages"); // caixa limpa antes de cada teste
    }

    [TearDown]
    public async Task Teardown() => await _mailpit.DisposeAsync();

    [Test]
    public async Task ForgotPassword_ShouldShowConfirmation_AndSendEmail()
    {
        await Page.GotoAsync(TestConfig.FrontUrl);
        await page.GotoAsync("http://localhost:5173/");
        await page.GotoAsync("http://localhost:5173/login");
        await page.GetByRole(AriaRole.Link, new() { Name = "Esqueci minha senha" }).ClickAsync();
        await page.GetByRole(AriaRole.Textbox, new() { Name = "E-mail" }).ClickAsync();
        await page.GetByRole(AriaRole.Textbox, new() { Name = "E-mail" }).FillAsync("lucaspietscher@gmail.com");
        
        // A tela deve dar retorno ao usuário informando que o e-mail de recuperação foi enviado
        await page.GetByRole(AriaRole.Button, new() { Name = "Enviar" }).ClickAsync();
        await Expect(Page.GetByText("e-mail", new() { Exact = false })).ToBeVisibleAsync();

        var message = await WaitForEmailAsync(UserEmail, TimeSpan.FromSeconds(20));
        Assert.That(message, Is.Not.Null, "Nenhum e-mail de recuperação foi recebido.");
    }

    [Test]
    public async Task ForgotPassword_ShouldCallAuthApi_WithEmail()
    {
        await Page.GotoAsync(TestConfig.FrontUrl);
        await Page.GetByText("Esqueci minha senha").ClickAsync();
        await Page.GetByLabel("E-mail").FillAsync(UserEmail);

        // Captura a chamada do front para o auth_service (porta 8001)
        var response = await Page.RunAndWaitForResponseAsync(
            async () => await Page.GetByRole(AriaRole.Button, new() { Name = "Enviar" }).ClickAsync(),
            r => r.Url.StartsWith(TestConfig.AuthUrl) && r.Request.Method == "POST");

        Assert.That(response.Ok, Is.True, $"API retornou {response.Status}");
    }

    // Consulta a API do Mailpit até o e-mail chegar (ou estourar o tempo)
    private async Task<JsonElement?> WaitForEmailAsync(string toEmail, TimeSpan timeout)
    {
        var deadline = DateTime.UtcNow + timeout;
        while (DateTime.UtcNow < deadline)
        {
            var res = await _mailpit.GetAsync($"/api/v1/search?query=to:{toEmail}");
            using var doc = JsonDocument.Parse(await res.TextAsync());
            var messages = doc.RootElement.GetProperty("messages");
            if (messages.GetArrayLength() > 0)
                return messages[0].Clone();

            await Task.Delay(1000);
        }
        return null;
    }
}
