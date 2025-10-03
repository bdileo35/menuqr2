-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "plan" TEXT DEFAULT 'basic',
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" DATETIME,
    "whatsappPhone" TEXT,
    "whatsappToken" TEXT,
    "whatsappPhoneId" TEXT,
    "whatsappEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurantId" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "logoPublicId" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "secondaryColor" TEXT NOT NULL DEFAULT '#64748b',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "textColor" TEXT NOT NULL DEFAULT '#1f2937',
    "fontFamily" TEXT NOT NULL DEFAULT 'Inter',
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "contactAddress" TEXT,
    "contactWebsite" TEXT,
    "socialInstagram" TEXT,
    "socialFacebook" TEXT,
    "socialTwitter" TEXT,
    "showPrices" BOOLEAN NOT NULL DEFAULT true,
    "showImages" BOOLEAN NOT NULL DEFAULT true,
    "showDescriptions" BOOLEAN NOT NULL DEFAULT true,
    "showNutritional" BOOLEAN NOT NULL DEFAULT false,
    "allowOrdering" BOOLEAN NOT NULL DEFAULT false,
    "currency" TEXT NOT NULL DEFAULT '$',
    "language" TEXT NOT NULL DEFAULT 'es',
    "deliveryEnabled" BOOLEAN NOT NULL DEFAULT false,
    "deliveryFee" REAL NOT NULL DEFAULT 0,
    "deliveryRadius" REAL,
    "deliveryMinOrder" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "menus_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "menuId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "categories_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "originalPrice" REAL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "galleryImages" TEXT,
    "hasImage" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isPromo" BOOLEAN NOT NULL DEFAULT false,
    "spicyLevel" INTEGER NOT NULL DEFAULT 0,
    "preparationTime" INTEGER,
    "tags" TEXT,
    "menuId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tableNumber" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "customerAddress" TEXT,
    "deliveryNotes" TEXT,
    "restaurantId" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "confirmedAt" DATETIME,
    "completedAt" DATETIME,
    "whatsappSent" BOOLEAN NOT NULL DEFAULT false,
    "whatsappMessage" TEXT,
    CONSTRAINT "orders_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemPrice" REAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "subtotal" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_restaurantId_key" ON "users"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "menus_restaurantId_key" ON "menus"("restaurantId");
