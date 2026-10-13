using System.Text.Json;
using Microsoft.Playwright;
using Microsoft.Playwright.NUnit;
using NUnit.Framework.Interfaces;

namespace FinanceSmart.Tests.Tests;

[TestFixture]
[Category("Email")]
public class ForgotPasswordTests : PageTest
{
    private const string UserEmail = "lucaspietscher@gmail.com";

    private IAPIRequestContext _mailpit = null!;

    [SetUp]
    public async Task Setup()
    {
        _mailpit = await Playwright.APIRequest.NewContextAsync(
            new() { BaseURL = TestConfig.MailpitUrl });
        await _mailpit.DeleteAsync("/api/v1/messages"); 

        Page.Console += (_, m) => TestContext.Out.WriteLine($"[console:{m.Type}] {m.Text}");
        Page.PageError += (_, e) => TestContext.Out.WriteLine($"[pageerror] {e}");
        Page.RequestFailed += (_, r) =>
            TestContext.Out.WriteLine($"[request-failed] {r.Method} {r.Url} -> {r.Failure}");
        Page.Response += (_, r) =>
        {
            if (r.Request.ResourceType is "fetch" or "xhr")
                TestContext.Out.WriteLine($"[response] {r.Request.Method} {r.Url} -> {r.Status}");
        };
    }

    [TearDown]
    public async Task Teardown()
    {
        if (TestContext.CurrentContext.Result.Outcome.Status == TestStatus.Failed)
        {
            var path = Path.Combine(TestContext.CurrentContext.WorkDirectory,
                $"falha-{TestContext.CurrentContext.Test.Name}.png");
            await Page.ScreenshotAsync(new() { Path = path, FullPage = true });
            TestContext.Out.WriteLine($"Screenshot salvo em: {path}");
        }
        await _mailpit.DisposeAsync();
    }

    private async Task OpenForgotPasswordAndFillAsync()
    {
        await Page.GotoAsync($"{TestConfig.FrontUrl}/login");
        await Page.GetByRole(AriaRole.Link, new() { Name = "Esqueci minha senha" }).ClickAsync();
        await Page.GetByRole(AriaRole.Textbox, new() { Name = "E-mail" }).FillAsync(UserEmail);
    }

    [Test]
    public async Task ForgotPassword_ShouldShowAlert_AndSendEmail()
    {
        var dialogMessage = new TaskCompletionSource<string>(
            TaskCreationOptions.RunContinuationsAsynchronously);
        Page.Dialog += async (_, dialog) =>
        {
            dialogMessage.TrySetResult(dialog.Message);
            await dialog.AcceptAsync();
        };

        await OpenForgotPasswordAndFillAsync();
        var sw = System.Diagnostics.Stopwatch.StartNew();
        await Page.GetByRole(AriaRole.Button, new() { Name = "Enviar Link" }).ClickAsync();

        var completed = await Task.WhenAny(dialogMessage.Task, Task.Delay(TimeSpan.FromSeconds(60)));
        TestContext.Out.WriteLine($"Tempo ate o alerta: {sw.Elapsed.TotalSeconds:F1}s");
        Assert.That(completed, Is.SameAs(dialogMessage.Task), "O alerta de confirmacao nao apareceu.");
        TestContext.Out.WriteLine($"Mensagem do alerta: {dialogMessage.Task.Result}");
        Assert.That(dialogMessage.Task.Result, Is.Not.Empty);

        var message = await WaitForEmailAsync(UserEmail, TimeSpan.FromSeconds(20));
        Assert.That(message, Is.Not.Null, "Nenhum e-mail de recuperacao foi recebido no Mailpit.");
    }

    [Test]
    public async Task ForgotPassword_ShouldCallApi_WithSuccess()
    {
        Page.Dialog += async (_, dialog) => await dialog.AcceptAsync();

        await OpenForgotPasswordAndFillAsync();

        var response = await Page.RunAndWaitForResponseAsync(
            async () => await Page.GetByRole(AriaRole.Button, new() { Name = "Enviar Link" }).ClickAsync(),
            r => r.Request.Method == "POST" && r.Request.ResourceType is "fetch" or "xhr",
            new() { Timeout = 60000 });

        TestContext.Out.WriteLine($"API chamada: {response.Url} -> {response.Status}");
        Assert.That(response.Ok, Is.True, $"A API retornou {response.Status} em {response.Url}");
    }

    private async Task<JsonElement?> WaitForEmailAsync(string toEmail, TimeSpan timeout)
    {
        var deadline = DateTime.UtcNow + timeout;
        var query = Uri.EscapeDataString($"to:{toEmail}");
        while (DateTime.UtcNow < deadline)
        {
            var res = await _mailpit.GetAsync($"/api/v1/search?query={query}");
            using var doc = JsonDocument.Parse(await res.TextAsync());
            var messages = doc.RootElement.GetProperty("messages");
            if (messages.GetArrayLength() > 0)
                return messages[0].Clone();

            await Task.Delay(1000);
        }
        return null;
    }
}