BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserTable] (
    [UserId] NVARCHAR(1000) NOT NULL,
    [Firstname] NVARCHAR(1000) NOT NULL,
    [Lastname] NVARCHAR(1000) NOT NULL,
    [Username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [Email] NVARCHAR(1000) NOT NULL,
    [IdDeleted] BIT NOT NULL CONSTRAINT [UserTable_IdDeleted_df] DEFAULT 0,
    [DateJoined] DATETIME2 NOT NULL CONSTRAINT [UserTable_DateJoined_df] DEFAULT CURRENT_TIMESTAMP,
    [LastUpdated] DATETIME2 NOT NULL,
    CONSTRAINT [UserTable_pkey] PRIMARY KEY CLUSTERED ([UserId]),
    CONSTRAINT [UserTable_Username_key] UNIQUE NONCLUSTERED ([Username]),
    CONSTRAINT [UserTable_Email_key] UNIQUE NONCLUSTERED ([Email])
);

-- CreateTable
CREATE TABLE [dbo].[TasksTable] (
    [TaskID] NVARCHAR(1000) NOT NULL,
    [TaskTitle] NVARCHAR(1000) NOT NULL,
    [TaskDescription] NVARCHAR(1000) NOT NULL,
    [IsCompleted] BIT NOT NULL CONSTRAINT [TasksTable_IsCompleted_df] DEFAULT 0,
    [IsDeleted] BIT NOT NULL CONSTRAINT [TasksTable_IsDeleted_df] DEFAULT 0,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [TasksTable_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [UpdatedAt] DATETIME2 NOT NULL,
    [UserId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TasksTable_pkey] PRIMARY KEY CLUSTERED ([TaskID])
);

-- AddForeignKey
ALTER TABLE [dbo].[TasksTable] ADD CONSTRAINT [TasksTable_UserId_fkey] FOREIGN KEY ([UserId]) REFERENCES [dbo].[UserTable]([UserId]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
