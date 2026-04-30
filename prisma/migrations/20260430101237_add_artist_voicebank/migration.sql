-- CreateTable
CREATE TABLE "artists" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "realName" TEXT,
    "oldName" TEXT,
    "jobs" TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "softDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voiceBanks" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT[],
    "software" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "softDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "voiceBanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArtistToArtist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArtistToArtist_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ArtistToVoiceBank" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArtistToVoiceBank_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArtistToArtist_B_index" ON "_ArtistToArtist"("B");

-- CreateIndex
CREATE INDEX "_ArtistToVoiceBank_B_index" ON "_ArtistToVoiceBank"("B");

-- AddForeignKey
ALTER TABLE "_ArtistToArtist" ADD CONSTRAINT "_ArtistToArtist_A_fkey" FOREIGN KEY ("A") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToArtist" ADD CONSTRAINT "_ArtistToArtist_B_fkey" FOREIGN KEY ("B") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToVoiceBank" ADD CONSTRAINT "_ArtistToVoiceBank_A_fkey" FOREIGN KEY ("A") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToVoiceBank" ADD CONSTRAINT "_ArtistToVoiceBank_B_fkey" FOREIGN KEY ("B") REFERENCES "voiceBanks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
