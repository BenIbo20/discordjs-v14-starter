# Discord.js v14 Starter

Discord.js v14 kullanılarak hazırlanmış, sade ve modüler bir Discord botu başlangıç altyapısıdır.

## Özellikler

- Slash komut sistemi
- Otomatik komut yükleme
- Event yönetimi
- Renkli terminal log sistemi
- `.env` ile yapılandırma
- Hata yönetimi

## Kurulum

```bash
git clone https://github.com/BenIbo20/discordjs-v14-starter.git
cd discordjs-v14-starter
npm install
```

`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli bilgileri doldurun.

## Yapılandırma

`.env` dosyası:

```env
BOT_TOKEN=
CLIENT_ID=
GUILD_ID=
LOG_TIMEZONE=Europe/Istanbul
```

## Kullanım

.env Dosyası oluşturmak için:

```bash
cp .env.example .env
```

Slash komutlarını yüklemek için:

```bash
npm run deploy
```

Botu başlatmak için:

```bash
npm start
```