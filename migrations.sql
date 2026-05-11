IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Locations] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(200) NOT NULL,
    [DisplayName_English] nvarchar(2000) NOT NULL,
    [DisplayName_Arabic] nvarchar(2000) NOT NULL,
    [Address] nvarchar(500) NOT NULL,
    [LocalizedAddress_English] nvarchar(2000) NULL,
    [LocalizedAddress_Arabic] nvarchar(2000) NULL,
    [City] nvarchar(100) NOT NULL,
    [Governorate] nvarchar(100) NOT NULL,
    [PostalCode] nvarchar(20) NULL,
    [Country] nvarchar(100) NOT NULL,
    [Latitude] float NULL,
    [Longitude] float NULL,
    [PhoneNumber] nvarchar(20) NULL,
    [Email] nvarchar(100) NULL,
    [OperatingHours] nvarchar(max) NULL,
    [HasWifi] bit NOT NULL,
    [HasParking] bit NOT NULL,
    [HasDriveThru] bit NOT NULL,
    [IsAccessible] bit NOT NULL,
    [HasOutdoorSeating] bit NOT NULL,
    [AcceptsMobileOrders] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [SortOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_Locations] PRIMARY KEY ([Id])
);

CREATE TABLE [MenuCategories] (
    [Id] uniqueidentifier NOT NULL,
    [Slug] nvarchar(100) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(500) NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_MenuCategories] PRIMARY KEY ([Id])
);

CREATE TABLE [Users] (
    [Id] uniqueidentifier NOT NULL,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [DateOfBirth] datetime2 NULL,
    [Role] int NOT NULL,
    [IsEmailVerified] bit NOT NULL,
    [IsPhoneVerified] bit NOT NULL,
    [EmailVerificationToken] nvarchar(max) NULL,
    [PhoneVerificationToken] nvarchar(max) NULL,
    [PasswordResetToken] nvarchar(max) NULL,
    [PasswordResetTokenExpiry] datetime2 NULL,
    [LastLoginAt] datetime2 NULL,
    [FailedLoginAttempts] int NOT NULL,
    [LockoutEnd] datetime2 NULL,
    [LastFailedLoginAt] datetime2 NULL,
    [RefreshToken] nvarchar(450) NULL,
    [RefreshTokenExpiry] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);

CREATE TABLE [MenuSubcategories] (
    [Id] uniqueidentifier NOT NULL,
    [CategoryId] uniqueidentifier NOT NULL,
    [Slug] nvarchar(100) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ImageUrl] nvarchar(500) NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_MenuSubcategories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MenuSubcategories_MenuCategories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [MenuCategories] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Orders] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [LocationId] uniqueidentifier NULL,
    [OrderNumber] nvarchar(20) NOT NULL,
    [Status] int NOT NULL,
    [Type] int NOT NULL,
    [Subtotal] decimal(10,2) NOT NULL,
    [Tax] decimal(10,2) NOT NULL,
    [DeliveryFee] decimal(10,2) NOT NULL,
    [Discount] decimal(10,2) NOT NULL,
    [Total] decimal(10,2) NOT NULL,
    [PaymentMethod] int NOT NULL,
    [PaymentStatus] int NOT NULL,
    [PaymentTransactionId] nvarchar(100) NULL,
    [ScheduledFor] datetime2 NULL,
    [PreparedAt] datetime2 NULL,
    [CompletedAt] datetime2 NULL,
    [CancelledAt] datetime2 NULL,
    [Notes] nvarchar(500) NULL,
    [CancellationReason] nvarchar(500) NULL,
    [DeliveryAddress] nvarchar(500) NULL,
    [DeliveryPhoneNumber] nvarchar(20) NULL,
    [DeliveryLatitude] float NULL,
    [DeliveryLongitude] float NULL,
    [PointsEarned] int NOT NULL,
    [PointsRedeemed] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Locations_LocationId] FOREIGN KEY ([LocationId]) REFERENCES [Locations] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);

CREATE TABLE [UserProfiles] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [ProfileImageUrl] nvarchar(500) NULL,
    [Gender] int NULL,
    [City] nvarchar(100) NULL,
    [Country] nvarchar(100) NULL,
    [PreferredLanguage] nvarchar(10) NOT NULL,
    [EmailNotifications] bit NOT NULL,
    [SmsNotifications] bit NOT NULL,
    [PushNotifications] bit NOT NULL,
    [MarketingEmails] bit NOT NULL,
    [RewardPoints] int NOT NULL,
    [TotalPointsEarned] int NOT NULL,
    [TotalPointsRedeemed] int NOT NULL,
    [LastPointsActivity] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_UserProfiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_UserProfiles_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [MenuItems] (
    [Id] uniqueidentifier NOT NULL,
    [SubcategoryId] uniqueidentifier NOT NULL,
    [Slug] nvarchar(100) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NULL,
    [ShortDescription] nvarchar(max) NULL,
    [ImageUrl] nvarchar(500) NULL,
    [Price] decimal(10,2) NOT NULL,
    [DiscountedPrice] decimal(10,2) NULL,
    [Calories] int NOT NULL,
    [IsNew] bit NOT NULL,
    [IsFeatured] bit NOT NULL,
    [IsAvailable] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [SortOrder] int NOT NULL,
    [Fat] decimal(18,2) NULL,
    [SaturatedFat] decimal(18,2) NULL,
    [TransFat] decimal(18,2) NULL,
    [Cholesterol] decimal(18,2) NULL,
    [Sodium] decimal(18,2) NULL,
    [Carbohydrates] decimal(18,2) NULL,
    [Fiber] decimal(18,2) NULL,
    [Sugar] decimal(18,2) NULL,
    [Protein] decimal(18,2) NULL,
    [Caffeine] decimal(18,2) NULL,
    [ContainsMilk] bit NOT NULL,
    [ContainsEggs] bit NOT NULL,
    [ContainsNuts] bit NOT NULL,
    [ContainsGluten] bit NOT NULL,
    [ContainsSoy] bit NOT NULL,
    [IsVegan] bit NOT NULL,
    [IsVegetarian] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_MenuItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MenuItems_MenuSubcategories_SubcategoryId] FOREIGN KEY ([SubcategoryId]) REFERENCES [MenuSubcategories] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [MenuItemVariants] (
    [Id] uniqueidentifier NOT NULL,
    [MenuItemId] uniqueidentifier NOT NULL,
    [Size] nvarchar(50) NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [PriceAdjustment] decimal(10,2) NOT NULL,
    [CalorieAdjustment] int NOT NULL,
    [IsDefault] bit NOT NULL,
    [IsAvailable] bit NOT NULL,
    [SortOrder] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_MenuItemVariants] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MenuItemVariants_MenuItems_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuItems] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [OrderItems] (
    [Id] uniqueidentifier NOT NULL,
    [OrderId] uniqueidentifier NOT NULL,
    [MenuItemId] uniqueidentifier NOT NULL,
    [VariantId] uniqueidentifier NULL,
    [Quantity] int NOT NULL,
    [UnitPrice] decimal(10,2) NOT NULL,
    [TotalPrice] decimal(10,2) NOT NULL,
    [SpecialInstructions] nvarchar(500) NULL,
    [Customizations] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_MenuItemVariants_VariantId] FOREIGN KEY ([VariantId]) REFERENCES [MenuItemVariants] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_OrderItems_MenuItems_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuItems] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_Locations_City] ON [Locations] ([City]);

CREATE INDEX [IX_Locations_City_Governorate] ON [Locations] ([City], [Governorate]);

CREATE INDEX [IX_Locations_Governorate] ON [Locations] ([Governorate]);

CREATE UNIQUE INDEX [IX_MenuCategories_Slug] ON [MenuCategories] ([Slug]) WHERE [IsDeleted] = 0;

CREATE UNIQUE INDEX [IX_MenuItems_SubcategoryId_Slug] ON [MenuItems] ([SubcategoryId], [Slug]) WHERE [IsDeleted] = 0;

CREATE INDEX [IX_MenuItemVariants_MenuItemId] ON [MenuItemVariants] ([MenuItemId]);

CREATE INDEX [IX_MenuItemVariants_MenuItemId_IsAvailable_IsDeleted] ON [MenuItemVariants] ([MenuItemId], [IsAvailable], [IsDeleted]);

CREATE UNIQUE INDEX [IX_MenuSubcategories_CategoryId_Slug] ON [MenuSubcategories] ([CategoryId], [Slug]) WHERE [IsDeleted] = 0;

CREATE INDEX [IX_OrderItems_MenuItemId] ON [OrderItems] ([MenuItemId]);

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);

CREATE INDEX [IX_OrderItems_VariantId] ON [OrderItems] ([VariantId]);

CREATE INDEX [IX_Orders_LocationId] ON [Orders] ([LocationId]);

CREATE UNIQUE INDEX [IX_Orders_OrderNumber] ON [Orders] ([OrderNumber]);

CREATE INDEX [IX_Orders_Status_CreatedAt] ON [Orders] ([Status], [CreatedAt]);

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);

CREATE INDEX [IX_Orders_UserId_Status_CreatedAt] ON [Orders] ([UserId], [Status], [CreatedAt]);

CREATE UNIQUE INDEX [IX_UserProfiles_UserId] ON [UserProfiles] ([UserId]);

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]) WHERE [IsDeleted] = 0;

CREATE UNIQUE INDEX [IX_Users_PhoneNumber] ON [Users] ([PhoneNumber]) WHERE [IsDeleted] = 0;

CREATE INDEX [IX_Users_RefreshToken] ON [Users] ([RefreshToken]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260509105036_InitialCreate', N'9.0.0');

ALTER TABLE [Users] ADD [RefreshTokenIssuedAt] datetime2 NULL;

ALTER TABLE [Users] ADD [RefreshTokenVersion] int NOT NULL DEFAULT 0;

CREATE TABLE [AuditLogs] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Action] nvarchar(50) NOT NULL,
    [EntityType] nvarchar(100) NOT NULL,
    [EntityId] uniqueidentifier NOT NULL,
    [OldValues] nvarchar(max) NULL,
    [NewValues] nvarchar(max) NULL,
    [Timestamp] datetime2 NOT NULL,
    [IpAddress] nvarchar(45) NULL,
    [Notes] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_AuditLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AuditLogs_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ErrorLogs] (
    [Id] uniqueidentifier NOT NULL,
    [Message] nvarchar(max) NOT NULL,
    [StackTrace] nvarchar(max) NULL,
    [Severity] int NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [UserId] uniqueidentifier NULL,
    [StatusCode] int NULL,
    [RequestPath] nvarchar(500) NULL,
    [HttpMethod] nvarchar(10) NULL,
    [Context] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_ErrorLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ErrorLogs_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id])
);

CREATE TABLE [SystemMetrics] (
    [Id] uniqueidentifier NOT NULL,
    [MetricType] nvarchar(50) NOT NULL,
    [Value] decimal(18,2) NOT NULL,
    [Timestamp] datetime2 NOT NULL,
    [Tags] nvarchar(max) NULL,
    [Unit] nvarchar(50) NULL,
    [Description] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_SystemMetrics] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_MenuSubcategories_CategoryId] ON [MenuSubcategories] ([CategoryId]);

CREATE INDEX [IX_MenuItems_SubcategoryId] ON [MenuItems] ([SubcategoryId]);

CREATE INDEX [IX_MenuItems_SubcategoryId_IsActive_IsDeleted] ON [MenuItems] ([SubcategoryId], [IsActive], [IsDeleted]);

CREATE INDEX [IX_AuditLogs_UserId] ON [AuditLogs] ([UserId]);

CREATE INDEX [IX_ErrorLogs_UserId] ON [ErrorLogs] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260511022016_FixDomainMappings', N'9.0.0');

ALTER TABLE [MenuItems] ADD [AverageRating] float NOT NULL DEFAULT 0.0E0;

ALTER TABLE [MenuItems] ADD [ReviewCount] int NOT NULL DEFAULT 0;

ALTER TABLE [Locations] ADD [DisplayName_Ar] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Locations] ADD [DisplayName_En] nvarchar(max) NOT NULL DEFAULT N'';

ALTER TABLE [Locations] ADD [LocalizedAddress_Ar] nvarchar(max) NULL;

ALTER TABLE [Locations] ADD [LocalizedAddress_En] nvarchar(max) NULL;

CREATE TABLE [CartItems] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [MenuItemId] uniqueidentifier NOT NULL,
    [MenuItemVariantId] uniqueidentifier NULL,
    [Quantity] int NOT NULL,
    [SelectedModifiersJson] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_CartItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CartItems_MenuItemVariants_MenuItemVariantId] FOREIGN KEY ([MenuItemVariantId]) REFERENCES [MenuItemVariants] ([Id]),
    CONSTRAINT [FK_CartItems_MenuItems_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuItems] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CartItems_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [ContactSubmissions] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(max) NOT NULL,
    [Email] nvarchar(max) NOT NULL,
    [Subject] nvarchar(max) NOT NULL,
    [Message] nvarchar(max) NOT NULL,
    [IsRead] bit NOT NULL,
    [Response] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_ContactSubmissions] PRIMARY KEY ([Id])
);

CREATE TABLE [Favorites] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [MenuItemId] uniqueidentifier NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_Favorites] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Favorites_MenuItems_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuItems] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Favorites_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [HomeBanners] (
    [Id] uniqueidentifier NOT NULL,
    [Name] nvarchar(100) NOT NULL,
    [Title_English] nvarchar(2000) NOT NULL,
    [Title_Arabic] nvarchar(2000) NOT NULL,
    [Title_En] nvarchar(max) NOT NULL,
    [Title_Ar] nvarchar(max) NOT NULL,
    [Subtitle_English] nvarchar(2000) NULL,
    [Subtitle_Arabic] nvarchar(2000) NULL,
    [Subtitle_En] nvarchar(max) NULL,
    [Subtitle_Ar] nvarchar(max) NULL,
    [ImageUrl] nvarchar(500) NOT NULL,
    [MobileImageUrl] nvarchar(500) NULL,
    [ActionUrl] nvarchar(500) NULL,
    [ActionText_English] nvarchar(2000) NULL,
    [ActionText_Arabic] nvarchar(2000) NULL,
    [ActionText_En] nvarchar(max) NULL,
    [ActionText_Ar] nvarchar(max) NULL,
    [BackgroundColor] nvarchar(max) NULL,
    [TextColor] nvarchar(max) NULL,
    [SortOrder] int NOT NULL,
    [IsActive] bit NOT NULL,
    [StartDate] datetime2 NULL,
    [EndDate] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_HomeBanners] PRIMARY KEY ([Id])
);

CREATE TABLE [Notifications] (
    [Id] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Title_English] nvarchar(2000) NOT NULL,
    [Title_Arabic] nvarchar(2000) NOT NULL,
    [Title_En] nvarchar(max) NOT NULL,
    [Title_Ar] nvarchar(max) NOT NULL,
    [Message_English] nvarchar(2000) NOT NULL,
    [Message_Arabic] nvarchar(2000) NOT NULL,
    [Message_En] nvarchar(max) NOT NULL,
    [Message_Ar] nvarchar(max) NOT NULL,
    [ActionUrl] nvarchar(max) NULL,
    [IsRead] bit NOT NULL,
    [ReadAt] datetime2 NULL,
    [Type] nvarchar(50) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Notifications_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Reviews] (
    [Id] uniqueidentifier NOT NULL,
    [MenuItemId] uniqueidentifier NOT NULL,
    [UserId] uniqueidentifier NOT NULL,
    [Rating] int NOT NULL,
    [Comment] nvarchar(max) NOT NULL,
    [IsApproved] bit NOT NULL,
    [ApprovedAt] datetime2 NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reviews_MenuItems_MenuItemId] FOREIGN KEY ([MenuItemId]) REFERENCES [MenuItems] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [SystemSettings] (
    [Id] uniqueidentifier NOT NULL,
    [Key] nvarchar(max) NOT NULL,
    [Value] nvarchar(max) NOT NULL,
    [Group] nvarchar(max) NOT NULL,
    [Description] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [IsEncrypted] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [CreatedBy] nvarchar(max) NULL,
    [UpdatedBy] nvarchar(max) NULL,
    [IsDeleted] bit NOT NULL,
    [DeletedAt] datetime2 NULL,
    [DeletedBy] nvarchar(max) NULL,
    [RowVersion] rowversion NOT NULL,
    CONSTRAINT [PK_SystemSettings] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_CartItems_MenuItemId] ON [CartItems] ([MenuItemId]);

CREATE INDEX [IX_CartItems_MenuItemVariantId] ON [CartItems] ([MenuItemVariantId]);

CREATE INDEX [IX_CartItems_UserId] ON [CartItems] ([UserId]);

CREATE INDEX [IX_Favorites_MenuItemId] ON [Favorites] ([MenuItemId]);

CREATE INDEX [IX_Favorites_UserId] ON [Favorites] ([UserId]);

CREATE INDEX [IX_Notifications_UserId] ON [Notifications] ([UserId]);

CREATE INDEX [IX_Reviews_MenuItemId] ON [Reviews] ([MenuItemId]);

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260511174510_FixMissingProperties', N'9.0.0');

COMMIT;
GO

