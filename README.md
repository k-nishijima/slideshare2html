# これはなあに？

[http://www.slideshare.net/](http://www.slideshare.net/) さんからRSSを取得し、HTMLに整形するnode.jsで動くスクリプトです。

# 使い方

local.jsの前の方の変数を幾つか設定して、実行。

* ```oldLimit``` これより古いアイテムは取得できたとしても捨てる
* ```authors``` ユーザ名はURLに出てくるものになるが、これを読みやすい文字列に置換するためのマップ
* ```urls``` /rss/user/ユーザ名 （更に "/tag/必要ならタグ" でタグ絞りも可能）

```例：
var oldLimit = new Date("01 Jan 2015 00:00:00");
var authors = {
    KoichiroNishijima: 'K Nishijima',
    tkonparu: 'T Konparu'
};
var urls = ['http://www.slideshare.net/rss/user/KoichiroNishijima/tag/aws',
            'http://www.slideshare.net/rss/user/tkonparu/tag/aws'];
```

# 実行

```
$ node local.js > slideshare.html
```

# テンプレートファイル

``template.ect`` がECTのテンプレートファイルなので、ご自由に編集してください。

