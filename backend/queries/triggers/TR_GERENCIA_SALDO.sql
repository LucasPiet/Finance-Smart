USE FINANCE_SMART;
GO

CREATE OR ALTER TRIGGER TRG_ATUALIZA_SALDO
ON TRANSACOES
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- ====== INSERT ======
    IF EXISTS(SELECT * FROM INSERTED) AND NOT EXISTS(SELECT * FROM DELETED)
    BEGIN
        MERGE dbo.SALDOS AS target
        USING (
            SELECT USUARIO_ID,
                   SUM(CASE WHEN TIPO = 'C' THEN VALOR ELSE -VALOR END) AS SALDO
            FROM INSERTED
            GROUP BY USUARIO_ID
        ) AS source
        ON target.USUARIO_ID = source.USUARIO_ID
        WHEN MATCHED THEN
            UPDATE SET target.SALDO = target.SALDO + source.SALDO,
                       target.ATUALIZADO_EM = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN
            INSERT (USUARIO_ID, SALDO)
            VALUES (source.USUARIO_ID, source.SALDO);
    END

    -- ====== DELETE ======
    IF EXISTS(SELECT * FROM DELETED) AND NOT EXISTS(SELECT * FROM INSERTED)
    BEGIN
        MERGE dbo.SALDOS AS target
        USING (
            SELECT USUARIO_ID,
                   SUM(CASE WHEN TIPO = 'C' THEN -VALOR ELSE VALOR END) AS SALDO
            FROM DELETED
            GROUP BY USUARIO_ID
        ) AS source
        ON target.USUARIO_ID = source.USUARIO_ID
        WHEN MATCHED THEN
            UPDATE SET target.SALDO = target.SALDO + source.SALDO,
                       target.ATUALIZADO_EM = SYSUTCDATETIME();
    END

    -- ====== UPDATE ======
    IF EXISTS(SELECT * FROM INSERTED) AND EXISTS(SELECT * FROM DELETED)
    BEGIN
        MERGE dbo.SALDOS AS target
        USING (
            SELECT i.USUARIO_ID,
                   SUM(
                       CASE WHEN i.TIPO = 'C' THEN i.VALOR ELSE -i.VALOR END
                       -
                       CASE WHEN d.TIPO = 'C' THEN d.VALOR ELSE -d.VALOR END
                   ) AS SALDO
            FROM INSERTED i
            INNER JOIN DELETED d ON i.ID = d.ID
            GROUP BY i.USUARIO_ID
        ) AS source
        ON target.USUARIO_ID = source.USUARIO_ID
        WHEN MATCHED THEN
            UPDATE SET target.SALDO = target.SALDO + source.SALDO,
                       target.ATUALIZADO_EM = SYSUTCDATETIME();
    END
END
GO