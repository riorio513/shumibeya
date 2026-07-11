# りおちの趣味部屋

ブログ「りおちの書置き」、Webツール置き場「りおちのおもちゃばこ」、お問い合わせフォームを持つ静的サイトです。
Eleventy（11ty）でビルドし、Netlifyでホスティング、Decap CMS（旧Netlify CMS）でブログ・ツール紹介記事を管理します。

## 技術構成

- 静的サイトジェネレーター：Eleventy（11ty） v3
- スタイリング：Tailwind CSS v3
- 記事管理：Decap CMS（git-gatewayバックエンド）
- ホスティング：Netlify（無料枠）
- お問い合わせ送信：Formspree（無料枠）
- ツール埋め込みURL保護：Netlify Functions（署名付き・有効期限付きトークン）

## ディレクトリ構成

```
src/
  _data/          サイト共通データ（ナビ、カテゴリー、SNSリンクなど）
  _includes/      レイアウト・共通コンポーネント（ヘッダー、フッター、SVGパーツ）
  admin/          Decap CMS 管理画面（config.yml / index.html）
  blog/           ブログ（りおちの書置き）
    posts/        記事のMarkdownファイル（Decap CMSが自動生成）
  tools/           りおちのおもちゃばこ
    items/         ツール紹介のMarkdownファイル（Decap CMSが自動生成）
  contact/         お問い合わせフォーム
  monstera/        From Monstera（Coming Soon 紹介ページ）
  assets/          画像・SVG・ビルド後CSS
netlify/functions/  ツール埋め込みURLの署名・検証を行うサーバーレス関数
scripts/            ビルド時にツール情報をfunctions用データへ変換するスクリプト
```

将来のコミュニティ機能（From Monstera本体）は `src/community/` のような形で追加していく想定です。
ナビゲーションは `src/_data/nav.json` を編集するだけで項目を追加・変更できます。

---

## 1. はじめての人向け：Decap CMSでブログ記事を投稿する手順

コードやMarkdownの知識は不要です。ブラウザだけで完結します。

1. ブラウザで `https://（あなたのサイトのURL）/admin/` を開きます。
2. 「Login with Netlify Identity」ボタンをクリックします。
3. 初回はメールで届く招待リンクからパスワードを設定してください（招待方法は下記「Netlify側の初期設定」参照）。
4. ログインすると、左側に「りおちの書置き（ブログ）」「りおちのおもちゃばこ（ツール紹介）」の2つのコーナーが表示されます。
5. 「りおちの書置き（ブログ）」→右上の「New りおちの書置き（ブログ）」ボタンをクリックします。
6. フォームに沿って入力します。
   - タイトル
   - 公開日
   - カテゴリー（創作／AI／観葉植物／コーヒー／学習／その他から選択）
   - サムネイル画像（必須。画像をドラッグ＆ドロップ、またはクリックしてアップロード）
   - 抜粋文（任意。一覧ページに表示される短い説明文）
   - 本文（Markdown形式の簡易エディタ。太字や見出し、画像挿入もボタンから操作できます）
7. 右上の「Publish」ボタン→「Publish now」をクリックすると、自動的にGitHubへ保存され、Netlifyが数十秒〜数分でサイトを再ビルドして公開します。
8. 公開後、サイトの「りおちの書置き」一覧に反映されているか確認してください。

スマートフォンからでも同じ手順で投稿・画像アップロードができます。

### ツール紹介（りおちのおもちゃばこ）を投稿する手順

1. 管理画面で「りおちのおもちゃばこ（ツール紹介）」→「New ツール」を選択します。
2. 以下を入力します。
   - ツール名
   - URLに使うスラッグ（半角英数字とハイフンのみ。例：`gajumaru`）
   - カテゴリー
   - 紹介コメント
   - 埋め込み元URL（ツール本体の実際のURL。このURLはページ上にそのまま表示されず、期限付きの安全なURLに自動変換されて埋め込まれます）
   - サムネイル画像（任意）
   - 公開日
3. 「Publish」を押すと、サイト上の「りおちのおもちゃばこ」に自動的にカードが追加されます。

---

## 2. Netlify側の初期設定（サイト管理者が最初に一度だけ行う作業）

以下はGitHubリポジトリ作成後、Netlifyのダッシュボード上で行う作業です（ブラウザ操作のみ、コード操作は不要）。

1. [Netlify](https://app.netlify.com/) にログイン（GitHubアカウントでログイン可）。
2. 「Add new site」→「Import an existing project」→GitHubを選択し、このリポジトリを選ぶ。
3. ビルド設定は `netlify.toml` に書かれているため、通常はそのまま「Deploy site」でOKです。
   - Build command: `npm run build`
   - Publish directory: `_site`
   - Functions directory: `netlify/functions`
4. デプロイ完了後、Netlifyダッシュボードの該当サイト→「Site configuration」→「Identity」を開き、「Enable Identity」をクリックします。
5. 「Identity」設定の中の「Registration」を「Invite only」に設定します（第三者が勝手にアカウント登録できないようにするためです）。
6. 同じくIdentity設定内の「Services」→「Git Gateway」で「Enable Git Gateway」をクリックします（Decap CMSがGitHubへ記事を保存できるようにする連携です）。
7. 「Identity」タブの「Invite users」から、りおちさん自身のメールアドレスを招待します。届いたメールからパスワードを設定すれば、`/admin/` にログインできるようになります。
8. お問い合わせフォームを使うために、[Formspree](https://formspree.io/) で無料アカウントを作成し、新しいフォームを作成してエンドポイントURL（`https://formspree.io/f/xxxxxxx` の形式）を取得します。
9. `src/contact/index.njk` 内の `action="https://formspree.io/f/YOUR_FORM_ID"` の `YOUR_FORM_ID` 部分を取得したIDに書き換えて、GitHubにpushしてください（Netlifyが自動で再デプロイします）。
10. 環境変数 `EMBED_SECRET` を Netlify の「Site configuration」→「Environment variables」で設定してください（りおちのおもちゃばこのURL保護に使う秘密の文字列です。ランダムな英数字の文字列を設定してください）。未設定の場合は開発用の仮の値が使われるため、本番公開前に必ず設定してください。

これで、Decap CMSでの記事投稿・お問い合わせフォームの送信・ツール紹介の埋め込みがすべて機能する状態になります。

---

## 3. ローカルでの開発

```bash
npm install
npm run start      # http://localhost:8080 でプレビュー（CSS監視あり）
npm run build       # 本番ビルド（_site/ に出力）
```

Netlify Functionsをローカルで試すには [Netlify CLI](https://docs.netlify.com/cli/get-started/) の `netlify dev` を利用してください。

## 4. りおちのおもちゃばこのURL保護について（技術メモ）

- ツール紹介ページには実URLを直接埋め込まず、閲覧者がボタンを押した時点で `netlify/functions/embed-token.js` が5分間だけ有効な署名付きトークンを発行します。
- iframeはそのトークンURL（`/.netlify/functions/embed-redirect`）を経由して実URLへサーバー側でリダイレクトされるため、ページのHTMLソースやネットワークタブから実URLを直接見つけることはできません。
- `robots.txt` によるクロール拒否、`<meta name="robots" content="noai, noimageai, noindex">`、レスポンスヘッダー `X-Robots-Tag`、iframeの`sandbox`属性、簡易的な右クリック・開発者ツール抑止も組み合わせています。
- ただし、これらはあくまで「収集のハードルを上げ、意思表示として機能させる」ためのものであり、AIによる学習やスクレイピングを完全に防止するものではありません。
