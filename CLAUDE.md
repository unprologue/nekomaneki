# NEKOMANEKI 公式サイト

www.nekomaneki.jp — UNPROLOGUE株式会社の招き猫ブランド「NEKOMANEKI」と「夢猫（YUMENEKO）」のサイト。
ビルド工程のない静的サイト（HTML / CSS / 素の JavaScript）。依存パッケージなし。

サイトを更新する人はプログラミング初心者のことが多い。説明は日本語で、専門用語を避けて短く書く。

## 構成

- `index.html` — トップ（ヒーロー動画 `#movie`、Concept、Size、Story、夢猫プロフィール `#product`、About、NEWS 5件）
- `news.html` — NEWS 一覧。NEWS を足すときは `index.html` と両方に入れる
- `about.html` / `shop.html` / `faq.html` / `contact.html` / `account.html` — 下層ページ
- `styles.css` — 全ページ共通の CSS。スマホ向けの調整は末尾近くの `@media (max-width: 760px)` / `(max-width: 720px)`
- `script.js` — メニュー、表示アニメーション、Shopify Buy Button の読み込み
- `shopify-config.js` — Shopify 接続設定（ストアドメイン、Storefront トークン、S/M/L の商品 ID、ログイン URL）。トークンと商品 ID が空の間は、サイズカードは「Coming soon」のまま
- `tokushoho.html` / `privacy.html` — 法律ページの下書き。【要確認】が残っていて `noindex`、どこからもリンクしていない
- ヘッダーとフッターは各 HTML に同じものが書かれている。直すときは全ページそろえる

## 本番への反映（重要）

GitHub `unprologue/nekomaneki` の `main` が本番だが、**プッシュしても Vercel の自動デプロイは動かない**（Vercel プロジェクトは agathatachiiri07-sketch さんの Hobby プラン。持ち主以外のコミットはデプロイされない）。

1. コミット・プッシュはユーザーに頼まれたときだけ行う
2. プッシュ後、Deploy Hook でデプロイする:
   ```bash
   curl -X POST "$(cat .git/vercel-deploy-hook)"
   ```
   フック URL は `.git/vercel-deploy-hook` に保存する（ユーザーから受け取る）。**公開リポジトリなので、URL をコミット・表示・資料に書かない**
3. 30秒〜1分後、本番に変更が出たか確認する（`curl "https://www.nekomaneki.jp/...?nc=$RANDOM"` で新しい内容を grep、`last-modified` ヘッダーの変化）
4. 見た目の変更は、本番をブラウザで PC（1280px）とスマホ（375px）の両方で確認する。横スクロールが出ていないか、読み込めない画像がないかも見る

Vercel の Deployments にある `cursor/…` ブランチの古いプレビューを Promote / Redeploy しないこと（別のサイトが本番に出る）。

## ローカル確認

```bash
python3 -m http.server 8123
```
http://localhost:8123/ で確認する。CSS がキャッシュされやすいので、確認時は再読み込みする。

## 注意

- クローン時の「paths have collided」警告は `NEKOMANEKI_ロゴ.jpg` が Unicode 正規化違いで2つ登録されているため。無視してよい
- Shopify ストアは `mp1vnh-e3.myshopify.com`。2026-10 時点で公開商品は会社猫（KAISHANEKO）だけで、夢猫は未登録。夢猫以外の商品をサイズカードにつながない
- 法律ページを公開するときは、【要確認】を埋める → `noindex` の行を消す → 全ページのフッター（`.footer-bottom`）に2ページへのリンクを戻す

## 残作業（2026-10-24 時点）

- 特商法ページの支払方法、プライバシーポリシーの確認と制定日（先方対応）
- 夢猫 S/M/L の Shopify 登録と Buy Button のトークン → `shopify-config.js` に設定し、カート〜支払い画面まで確認
- 11/1 以降、NEWS の Instagram キャンペーンを「終了」に変える

詳しい引き継ぎ資料: https://claude.ai/artifact/DobGn3mP9Kh861vRMLm8jk
