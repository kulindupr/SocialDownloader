# Cookie Setup Guide for SocialDownloader

This guide explains how to set up cookies to enable YouTube, Instagram, and TikTok downloads from your deployed server.

## Why Cookies Are Needed

Cloud providers like Fly.io have IP addresses that are often blocked by social media platforms. By using cookies from a logged-in browser session, we can bypass these restrictions.

## Step 1: Install a Cookie Export Extension

Install one of these browser extensions:
- **Chrome**: [Get cookies.txt LOCALLY](https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
- **Firefox**: [cookies.txt](https://addons.mozilla.org/en-US/firefox/addon/cookies-txt/)

## Step 2: Export Cookies

### For YouTube:
1. Go to [youtube.com](https://youtube.com) and log in
2. Click the cookie extension icon
3. Export cookies (Netscape format)
4. Save as `youtube_cookies.txt`

### For Instagram:
1. Go to [instagram.com](https://instagram.com) and log in
2. Click the cookie extension icon
3. Export cookies (Netscape format)
4. Save as `instagram_cookies.txt`

### For TikTok:
1. Go to [tiktok.com](https://tiktok.com) and log in
2. Click the cookie extension icon
3. Export cookies (Netscape format)
4. Save as `tiktok_cookies.txt`

## Step 3: Convert Cookies to Base64

### Windows PowerShell:
```powershell
# YouTube
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("youtube_cookies.txt")) | Set-Clipboard
# Paste this value as YOUTUBE_COOKIES in Fly.io secrets

# Instagram
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("instagram_cookies.txt")) | Set-Clipboard
# Paste this value as INSTAGRAM_COOKIES in Fly.io secrets

# TikTok
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("tiktok_cookies.txt")) | Set-Clipboard
# Paste this value as TIKTOK_COOKIES in Fly.io secrets
```

### Mac/Linux:
```bash
# YouTube
base64 -i youtube_cookies.txt | pbcopy  # Mac
base64 youtube_cookies.txt | xclip      # Linux

# Instagram
base64 -i instagram_cookies.txt | pbcopy

# TikTok
base64 -i tiktok_cookies.txt | pbcopy
```

## Step 4: Set Secrets on Fly.io

```bash
flyctl secrets set YOUTUBE_COOKIES="<paste_base64_here>" --app server-twilight-flower-1963
flyctl secrets set INSTAGRAM_COOKIES="<paste_base64_here>" --app server-twilight-flower-1963
flyctl secrets set TIKTOK_COOKIES="<paste_base64_here>" --app server-twilight-flower-1963
```

Or set them all at once:
```bash
flyctl secrets set \
  YOUTUBE_COOKIES="<base64>" \
  INSTAGRAM_COOKIES="<base64>" \
  TIKTOK_COOKIES="<base64>" \
  --app server-twilight-flower-1963
```

## Step 5: Verify

After setting secrets, Fly.io will automatically redeploy. Check the health endpoint:

```
https://server-twilight-flower-1963.fly.dev/health
```

You should see:
```json
{
  "status": "ok",
  "ytdlp": "available",
  "cookies": {
    "youtube": true,
    "instagram": true,
    "tiktok": true
  }
}
```

## Notes

- Cookies expire! You may need to re-export them periodically
- Keep your cookies secure - they can be used to access your accounts
- Instagram cookies expire faster (usually within 24-48 hours)
- YouTube cookies last longer (weeks to months)
